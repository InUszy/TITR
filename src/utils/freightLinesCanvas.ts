import L from 'leaflet'
import { RAILWAY_LINE_FILES, type CorridorCountryId } from '../types/corridorCountries'

export interface FreightLineRecord {
  /** [minLat, minLng, maxLat, maxLng] */
  b: [number, number, number, number]
  /** [lat, lng] pairs */
  c: [number, number][]
}

export interface FreightLinesData {
  lines: FreightLineRecord[]
}

const RAILWAY_LINES_BASE = '/railwayLineJson'

const STYLE = {
  color: '#b8860b',
  weight: 2,
  opacity: 0.7,
}

type FreightLayerState = {
  data: FreightLinesData
  map: L.Map | null
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  redrawScheduled: boolean
  isZooming: boolean
}

export type FreightLinesLayer = L.Layer & {
  setData: (data: FreightLinesData) => void
}

const railwayCache = new Map<CorridorCountryId, FreightLinesData>()

function mergeFreightLines(datasets: FreightLinesData[]): FreightLinesData {
  return { lines: datasets.flatMap((item) => item.lines) }
}

function syncCanvasPosition(state: FreightLayerState) {
  const { map, canvas } = state
  if (!map || !canvas) return
  const topLeft = map.containerPointToLayerPoint([0, 0])
  L.DomUtil.setPosition(canvas, topLeft)
}

function resetCanvas(state: FreightLayerState) {
  const { map, canvas, ctx } = state
  if (!map || !canvas || !ctx) return

  const size = map.getSize()
  syncCanvasPosition(state)

  const dpr = window.devicePixelRatio || 1
  const nextWidth = Math.floor(size.x * dpr)
  const nextHeight = Math.floor(size.y * dpr)
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth
    canvas.height = nextHeight
    canvas.style.width = `${size.x}px`
    canvas.style.height = `${size.y}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  scheduleRedraw(state)
}

function setCanvasVisible(state: FreightLayerState, visible: boolean) {
  if (state.canvas) state.canvas.style.visibility = visible ? '' : 'hidden'
}

function syncOnMapMove(state: FreightLayerState) {
  if (state.isZooming) return
  syncCanvasPosition(state)
  scheduleRedraw(state)
}

function scheduleRedraw(state: FreightLayerState) {
  if (state.redrawScheduled) return
  state.redrawScheduled = true
  requestAnimationFrame(() => {
    state.redrawScheduled = false
    redrawLines(state)
  })
}

function redrawLines(state: FreightLayerState) {
  const { map, ctx, data, canvas } = state
  if (!map || !ctx || !canvas) return

  const size = map.getSize()
  const bounds = map.getBounds().pad(0.08)
  const south = bounds.getSouth()
  const north = bounds.getNorth()
  const west = bounds.getWest()
  const east = bounds.getEast()
  const topLeft = map.containerPointToLayerPoint([0, 0])

  ctx.clearRect(0, 0, size.x, size.y)
  if (!data.lines.length) return

  ctx.strokeStyle = STYLE.color
  ctx.lineWidth = STYLE.weight
  ctx.globalAlpha = STYLE.opacity
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()

  for (const line of data.lines) {
    const [minLat, minLng, maxLat, maxLng] = line.b
    if (maxLat < south || minLat > north || maxLng < west || minLng > east) continue

    const coords = line.c
    for (let i = 0; i < coords.length; i += 1) {
      const layerPoint = map.latLngToLayerPoint(L.latLng(coords[i][0], coords[i][1]))
      const x = layerPoint.x - topLeft.x
      const y = layerPoint.y - topLeft.y
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
  }

  ctx.stroke()
}

async function loadCountryRailwayLines(country: CorridorCountryId): Promise<FreightLinesData | null> {
  const cached = railwayCache.get(country)
  if (cached) return cached

  const fileName = RAILWAY_LINE_FILES[country]
  if (!fileName) return null

  try {
    const res = await fetch(`${RAILWAY_LINES_BASE}/${fileName}`)
    if (!res.ok) return null
    const data = (await res.json()) as FreightLinesData
    if (!data.lines?.length) return null
    railwayCache.set(country, data)
    return data
  } catch {
    return null
  }
}

export async function loadRailwayLinesForCountries(
  countries: CorridorCountryId[],
): Promise<FreightLinesData> {
  const datasets = await Promise.all(countries.map(loadCountryRailwayLines))
  const valid = datasets.filter((item): item is FreightLinesData => item !== null)
  return valid.length ? mergeFreightLines(valid) : { lines: [] }
}

export async function loadAllRailwayLines(): Promise<FreightLinesData> {
  const countries = Object.keys(RAILWAY_LINE_FILES) as CorridorCountryId[]
  return loadRailwayLinesForCountries(countries)
}

export function createFreightLinesLayer(data: FreightLinesData = { lines: [] }): FreightLinesLayer {
  const state: FreightLayerState = {
    data,
    map: null,
    canvas: null,
    ctx: null,
    redrawScheduled: false,
    isZooming: false,
  }

  const handleReset = () => {
    state.isZooming = false
    setCanvasVisible(state, true)
    resetCanvas(state)
  }

  const onZoomStart = () => {
    state.isZooming = true
    setCanvasVisible(state, false)
  }

  const onMapMove = () => syncOnMapMove(state)

  const LayerClass = L.Layer.extend({
    onAdd(map: L.Map) {
      state.map = map
      state.canvas = L.DomUtil.create('canvas', 'cmd-freight-canvas')
      state.ctx = state.canvas.getContext('2d')
      state.canvas.style.pointerEvents = 'none'

      const pane = map.getPane('overlayPane')
      if (pane) pane.appendChild(state.canvas)

      map.on('move', onMapMove)
      map.on('zoomstart', onZoomStart)
      map.on('moveend zoomend resize viewreset', handleReset)
      handleReset()
    },

    onRemove(map: L.Map) {
      map.off('move', onMapMove)
      map.off('zoomstart', onZoomStart)
      map.off('moveend zoomend resize viewreset', handleReset)
      if (state.canvas) L.DomUtil.remove(state.canvas)
      state.map = null
      state.canvas = null
      state.ctx = null
    },

    setData(next: FreightLinesData) {
      state.data = next
      scheduleRedraw(state)
    },
  })

  return new LayerClass() as FreightLinesLayer
}
