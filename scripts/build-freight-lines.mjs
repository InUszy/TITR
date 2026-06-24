/**
 * Preprocess GeoJSON line features into compact datasets for canvas rendering.
 * Reads every *.geojson under public/geojson/, writes one JSON per file to public/railwayLineJson/.
 * Keeps LineString / MultiLineString only, simplifies geometry, strips properties.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourceDir = join(root, 'public/geojson')
const outputDir = join(root, 'public/railwayLineJson')

const SIMPLIFY_TOLERANCE = 0.005

function perpendicularDistance(point, start, end) {
  const [x, y] = point
  const [x1, y1] = start
  const [x2, y2] = end
  const dx = x2 - x1
  const dy = y2 - y1
  if (dx === 0 && dy === 0) {
    const ax = x - x1
    const ay = y - y1
    return ax * ax + ay * ay
  }
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
  const px = x1 + t * dx
  const py = y1 + t * dy
  const ox = x - px
  const oy = y - py
  return ox * ox + oy * oy
}

function simplify(coords, tolerance) {
  if (coords.length <= 2) return coords

  let maxDist = 0
  let index = 0
  const end = coords.length - 1
  const tolSq = tolerance * tolerance

  for (let i = 1; i < end; i += 1) {
    const dist = perpendicularDistance(coords[i], coords[0], coords[end])
    if (dist > maxDist) {
      maxDist = dist
      index = i
    }
  }

  if (maxDist > tolSq) {
    const left = simplify(coords.slice(0, index + 1), tolerance)
    const right = simplify(coords.slice(index), tolerance)
    return left.slice(0, -1).concat(right)
  }

  return [coords[0], coords[end]]
}

function coordsToLineRecord(coords) {
  const simplified = simplify(coords, SIMPLIFY_TOLERANCE)
  if (simplified.length < 2) return null

  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  const normalized = simplified.map(([lng, lat]) => {
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    return [+lat.toFixed(4), +lng.toFixed(4)]
  })

  return {
    b: [
      +minLat.toFixed(2),
      +minLng.toFixed(2),
      +maxLat.toFixed(2),
      +maxLng.toFixed(2),
    ],
    c: normalized,
  }
}

function extractLineStrings(geometry) {
  if (!geometry) return []

  if (geometry.type === 'LineString') {
    return [geometry.coordinates]
  }

  if (geometry.type === 'MultiLineString') {
    return geometry.coordinates
  }

  return []
}

function convertGeoJson(data) {
  const lines = []

  for (const feature of data.features ?? []) {
    for (const coords of extractLineStrings(feature.geometry)) {
      const line = coordsToLineRecord(coords)
      if (line) lines.push(line)
    }
  }

  return { lines }
}

function convertFile(sourcePath, outputPath) {
  const data = JSON.parse(readFileSync(sourcePath, 'utf8'))
  const output = convertGeoJson(data)
  writeFileSync(outputPath, JSON.stringify(output))

  const sizeMb = (Buffer.byteLength(JSON.stringify(output), 'utf8') / 1024 / 1024).toFixed(2)
  return { lineCount: output.lines.length, sizeMb }
}

function build() {
  if (!existsSync(sourceDir)) {
    console.warn(`[build-freight-lines] Source directory not found: ${sourceDir}`)
    return
  }

  mkdirSync(outputDir, { recursive: true })

  const geojsonFiles = readdirSync(sourceDir)
    .filter((name) => name.toLowerCase().endsWith('.geojson'))
    .sort()

  if (geojsonFiles.length === 0) {
    console.warn(`[build-freight-lines] No .geojson files in ${sourceDir}`)
    return
  }

  for (const fileName of geojsonFiles) {
    const sourcePath = join(sourceDir, fileName)
    const outputName = `${basename(fileName, '.geojson')}.json`
    const outputPath = join(outputDir, outputName)

    const { lineCount, sizeMb } = convertFile(sourcePath, outputPath)
    console.log(`[build-freight-lines] ${fileName} -> ${outputName} (${lineCount} lines, ${sizeMb} MB)`)
  }

  console.log(`[build-freight-lines] Done. ${geojsonFiles.length} file(s) -> ${outputDir}`)
}

build()
