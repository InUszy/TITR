import L from 'leaflet'

export interface FreightLineRecord {
  /** [minLat, minLng, maxLat, maxLng] */
  b: [number, number, number, number]
  /** [lat, lng] pairs */
  c: [number, number][]
}

export interface FreightLinesData {
  lines: FreightLineRecord[]
}

const FREIGHT_LINES_URL = '/geo/freight_lines.json'

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
}

function resetCanvas(state: FreightLayerState) {
  const { map, canvas, ctx } = state
  if (!map || !canvas || !ctx) return

  const size = map.getSize()
  const topLeft = map.containerPointToLayerPoint([0, 0])
  L.DomUtil.setPosition(canvas, topLeft)

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.floor(size.x * dpr)
  canvas.height = Math.floor(size.y * dpr)
  canvas.style.width = `${size.x}px`
  canvas.style.height = `${size.y}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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

  ctx.clearRect(0, 0, size.x, size.y)
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
      const point = map.latLngToContainerPoint(L.latLng(coords[i][0], coords[i][1]))
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    }
  }

  ctx.stroke()
}

export function createFreightLinesLayer(data: FreightLinesData): L.Layer {
  const state: FreightLayerState = {
    data,
    map: null,
    canvas: null,
    ctx: null,
    redrawScheduled: false,
  }

  const handleReset = () => resetCanvas(state)

  const LayerClass = L.Layer.extend({
    onAdd(map: L.Map) {
      state.map = map
      state.canvas = L.DomUtil.create('canvas', 'cmd-freight-canvas')
      state.ctx = state.canvas.getContext('2d')
      state.canvas.style.pointerEvents = 'none'

      const pane = map.getPane('overlayPane')
      if (pane) pane.appendChild(state.canvas)

      map.on('moveend zoomend resize viewreset', handleReset)
      handleReset()
    },

    onRemove(map: L.Map) {
      map.off('moveend zoomend resize viewreset', handleReset)
      if (state.canvas) L.DomUtil.remove(state.canvas)
      state.map = null
      state.canvas = null
      state.ctx = null
    },
  })

  return new LayerClass()
}

export async function loadFreightLinesData(): Promise<FreightLinesData | null> {
  try {
    const res = await fetch(FREIGHT_LINES_URL)
    if (!res.ok) return null
    const data = (await res.json()) as FreightLinesData
    if (!data.lines?.length) return null
    return data
  } catch {
    return null
  }
}
