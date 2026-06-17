/**
 * Preprocess OSM freight GeoJSON into a compact line dataset for canvas rendering.
 * Keeps LineString only, simplifies geometry, strips properties.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourcePath = join(root, 'public/geo/all_freight_wgs84.geojson')
const outputPath = join(root, 'public/geo/freight_lines.json')

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

function build() {
  if (!existsSync(sourcePath)) {
    console.warn(`[build-freight-lines] Source not found: ${sourcePath}`)
    return
  }

  const data = JSON.parse(readFileSync(sourcePath, 'utf8'))
  const lines = []

  for (const feature of data.features ?? []) {
    if (feature.geometry?.type !== 'LineString') continue

    const simplified = simplify(feature.geometry.coordinates, SIMPLIFY_TOLERANCE)
    if (simplified.length < 2) continue

    let minLng = Infinity
    let maxLng = -Infinity
    let minLat = Infinity
    let maxLat = -Infinity

    const coords = simplified.map(([lng, lat]) => {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      return [+lat.toFixed(4), +lng.toFixed(4)]
    })

    lines.push({
      b: [
        +minLat.toFixed(2),
        +minLng.toFixed(2),
        +maxLat.toFixed(2),
        +maxLng.toFixed(2),
      ],
      c: coords,
    })
  }

  const output = { lines }
  writeFileSync(outputPath, JSON.stringify(output))

  const sizeMb = (Buffer.byteLength(JSON.stringify(output), 'utf8') / 1024 / 1024).toFixed(2)
  console.log(`[build-freight-lines] Wrote ${lines.length} lines (${sizeMb} MB) -> ${outputPath}`)
}

build()
