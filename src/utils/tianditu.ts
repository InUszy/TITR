import L from 'leaflet'

const TIANDITU_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

export type TiandituAnnotationLocale = 'zh' | 'en'

export function getTiandituToken(): string {
  return import.meta.env.VITE_TIANDITU_TK?.trim() ?? ''
}

function createTiandituWmtsLayer(
  path: string,
  layerName: string,
  token: string,
  options: L.TileLayerOptions = {},
) {
  return L.tileLayer(
    `https://t{s}.tianditu.gov.cn/${path}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layerName}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${token}`,
    {
      subdomains: TIANDITU_SUBDOMAINS,
      maxZoom: 18,
      ...options,
    },
  )
}

export function createTiandituVecLayer(token: string) {
  return createTiandituWmtsLayer('vec_w', 'vec', token, { zIndex: 1 })
}

function createCartoEnglishLabelLayer() {
  return L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    {
      subdomains: 'abcd',
      maxZoom: 20,
      zIndex: 2,
      opacity: 0.95,
    },
  )
}

function attachEnglishLabelFallback(evaLayer: L.TileLayer, group: L.LayerGroup) {
  const carto = createCartoEnglishLabelLayer()
  let cartoAdded = false
  let evaLoaded = false

  const enableCartoFallback = () => {
    if (cartoAdded) return
    cartoAdded = true
    carto.addTo(group)
  }

  evaLayer.on('tileload', () => {
    evaLoaded = true
  })
  evaLayer.on('tileerror', enableCartoFallback)

  window.setTimeout(() => {
    if (!evaLoaded) enableCartoFallback()
  }, 1500)
}

export function createTiandituAnnotationLayer(token: string, locale: TiandituAnnotationLocale = 'zh') {
  if (locale === 'zh') {
    return createTiandituWmtsLayer('cva_w', 'cva', token, { zIndex: 2 })
  }

  const group = L.layerGroup()
  const eva = createTiandituWmtsLayer('eva_w', 'eva', token, { zIndex: 2 })
  eva.addTo(group)
  attachEnglishLabelFallback(eva, group)
  return group
}

/** @deprecated Use createTiandituAnnotationLayer(token, 'zh') */
export function createTiandituCvaLayer(token: string) {
  return createTiandituAnnotationLayer(token, 'zh')
}

export function addTiandituBaseLayers(
  map: L.Map,
  token: string,
  locale: TiandituAnnotationLocale = 'zh',
) {
  const vec = createTiandituVecLayer(token)
  const annotation = createTiandituAnnotationLayer(token, locale)
  vec.addTo(map)
  annotation.addTo(map)
  return { vec, annotation }
}

export function swapTiandituAnnotationLayer(
  map: L.Map,
  token: string,
  locale: TiandituAnnotationLocale,
  currentLayer: L.Layer | null,
) {
  if (currentLayer) {
    map.removeLayer(currentLayer)
  }
  const next = createTiandituAnnotationLayer(token, locale)
  next.addTo(map)
  if ('bringToFront' in next && typeof next.bringToFront === 'function') {
    next.bringToFront()
  }
  return next
}
