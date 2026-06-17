import L from 'leaflet'

const TIANDITU_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

export function getTiandituToken(): string {
  return import.meta.env.VITE_TIANDITU_TK?.trim() ?? ''
}

export function createTiandituVecLayer(token: string) {
  return L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${token}`,
    {
      subdomains: TIANDITU_SUBDOMAINS,
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.tianditu.gov.cn/" target="_blank" rel="noreferrer">天地图</a>',
    },
  )
}

export function createTiandituCvaLayer(token: string) {
  return L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${token}`,
    {
      subdomains: TIANDITU_SUBDOMAINS,
      maxZoom: 18,
    },
  )
}

export function addTiandituBaseLayers(map: L.Map, token: string) {
  const vec = createTiandituVecLayer(token)
  const cva = createTiandituCvaLayer(token)
  vec.addTo(map)
  cva.addTo(map)
  return { vec, cva }
}
