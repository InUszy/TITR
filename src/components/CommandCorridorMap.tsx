import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  corridorRoutes,
  getNodeById,
  getNodesForRegion,
  nodeLatLng,
  type CorridorNode,
  type DashboardRegion,
  type NodeStatus,
} from '../types/commandDashboard'
import { useLanguage } from '../i18n/LanguageContext'
import { addTiandituBaseLayers, swapTiandituAnnotationLayer, getTiandituToken } from '../utils/tianditu'
import { createFreightLinesLayer, loadFreightLinesData } from '../utils/freightLinesCanvas'

const STATUS_COLORS: Record<NodeStatus, string> = {
  normal: '#5aad4a',
  busy: '#f5a623',
  risk: '#e74c3c',
  offline: '#999',
}

const CORRIDOR_DEFAULT_CENTER: L.LatLngExpression = [44, 58]
const CORRIDOR_DEFAULT_ZOOM = 4

interface CommandCorridorMapProps {
  region: DashboardRegion
  selectedNodeId: string | null
  onSelectNode: (node: CorridorNode | null) => void
  onNodeAnchorUpdate?: (point: { x: number; y: number; w: number; h: number } | null) => void
}

function routeLatLngs(from: CorridorNode, to: CorridorNode, type: 'rail' | 'sea'): L.LatLngExpression[] {
  if (type === 'rail') {
    return [nodeLatLng(from), nodeLatLng(to)]
  }
  const midLat = (from.lat + to.lat) / 2
  const midLng = (from.lng + to.lng) / 2
  const offsetLat = (to.lng - from.lng) * 0.08
  const offsetLng = -(to.lat - from.lat) * 0.08
  return [
    nodeLatLng(from),
    [midLat + offsetLat, midLng + offsetLng],
    nodeLatLng(to),
  ]
}

function createNodeIcon(node: CorridorNode, label: string, isSelected: boolean) {
  const color = STATUS_COLORS[node.status]
  const pulse = node.status === 'risk'
    ? '<span class="cmd-leaflet-marker-pulse"></span>'
    : ''
  const ring = isSelected ? '<span class="cmd-leaflet-marker-ring"></span>' : ''

  return L.divIcon({
    className: 'cmd-leaflet-marker',
    html: `
      <div class="cmd-leaflet-marker-wrap${isSelected ? ' selected' : ''}">
        ${ring}
        ${pulse}
        <span class="cmd-leaflet-marker-dot" style="background:${color}"></span>
        <span class="cmd-leaflet-marker-label">${label}</span>
      </div>
    `,
    iconSize: [72, 36],
    iconAnchor: [36, 14],
  })
}

export function CommandCorridorMap({
  region,
  selectedNodeId,
  onSelectNode,
  onNodeAnchorUpdate,
}: CommandCorridorMapProps) {
  const { t, locale } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const routesLayerRef = useRef<L.LayerGroup | null>(null)
  const freightLayerRef = useRef<L.Layer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const annotationLayerRef = useRef<L.Layer | null>(null)
  const annotationLocaleRef = useRef<string | null>(null)
  const selectedNodeIdRef = useRef(selectedNodeId)
  const onAnchorUpdateRef = useRef(onNodeAnchorUpdate)
  selectedNodeIdRef.current = selectedNodeId
  onAnchorUpdateRef.current = onNodeAnchorUpdate
  const token = getTiandituToken()

  const visibleNodes = useMemo(
    () => getNodesForRegion(region),
    [region],
  )

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes],
  )

  const visibleRoutes = useMemo(
    () => corridorRoutes.filter((r) => visibleNodeIds.has(r.from) && visibleNodeIds.has(r.to)),
    [visibleNodeIds],
  )

  const updateAnchor = (map: L.Map, nodeId: string | null) => {
    const onNodeAnchorUpdate = onAnchorUpdateRef.current
    if (!onNodeAnchorUpdate) return
    if (!nodeId) {
      onNodeAnchorUpdate(null)
      return
    }
    const node = getNodeById(nodeId)
    const container = containerRef.current
    if (!node || !container) {
      onNodeAnchorUpdate(null)
      return
    }
    const point = map.latLngToContainerPoint(nodeLatLng(node))
    onNodeAnchorUpdate({
      x: point.x,
      y: point.y,
      w: container.clientWidth,
      h: container.clientHeight,
    })
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: CORRIDOR_DEFAULT_CENTER,
      zoom: CORRIDOR_DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    })

    if (token) {
      const { annotation } = addTiandituBaseLayers(map, token, locale)
      annotationLayerRef.current = annotation
      annotationLocaleRef.current = locale
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)
    }

    routesLayerRef.current = L.layerGroup().addTo(map)
    markersLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    let cancelled = false
    loadFreightLinesData().then((data) => {
      if (cancelled || !data || !mapRef.current) return
      const layer = createFreightLinesLayer(data)
      layer.addTo(mapRef.current)
      freightLayerRef.current = layer
    })

    const handleLayout = () => updateAnchor(map, selectedNodeIdRef.current)
    map.on('move', handleLayout)
    map.on('zoom', handleLayout)
    map.on('resize', handleLayout)

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
      updateAnchor(map, selectedNodeIdRef.current)
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      cancelled = true
      resizeObserver.disconnect()
      map.off('move', handleLayout)
      map.off('zoom', handleLayout)
      map.off('resize', handleLayout)
      if (freightLayerRef.current) {
        freightLayerRef.current.remove()
      }
      map.remove()
      mapRef.current = null
      freightLayerRef.current = null
      routesLayerRef.current = null
      markersLayerRef.current = null
      annotationLayerRef.current = null
      annotationLocaleRef.current = null
    }
  }, [token])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !token || annotationLocaleRef.current === locale) return

    annotationLayerRef.current = swapTiandituAnnotationLayer(
      map,
      token,
      locale,
      annotationLayerRef.current,
    )
    annotationLocaleRef.current = locale
  }, [locale, token])

  useEffect(() => {
    const map = mapRef.current
    const routesLayer = routesLayerRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !routesLayer || !markersLayer) return

    routesLayer.clearLayers()
    visibleRoutes.forEach((route) => {
      const from = getNodeById(route.from)
      const to = getNodeById(route.to)
      if (!from || !to) return

      L.polyline(routeLatLngs(from, to, route.type), {
        color: '#5aad4a',
        weight: route.type === 'sea' ? 3 : 2,
        opacity: 0.8,
        dashArray: route.type === 'rail' ? '6 5' : undefined,
      }).addTo(routesLayer)
    })

    markersLayer.clearLayers()
    visibleNodes.forEach((node) => {
      const isSelected = selectedNodeId === node.id
      const label = locale === 'en' ? node.nameEn : node.name
      const marker = L.marker(nodeLatLng(node), {
        icon: createNodeIcon(node, label, isSelected),
      })
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        onSelectNode(isSelected ? null : node)
      })
      marker.addTo(markersLayer)
    })

    const bounds = L.latLngBounds(visibleNodes.map((n) => nodeLatLng(n)))
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: region === 'all' ? 5 : 7 })
    }

    updateAnchor(map, selectedNodeId)
  }, [visibleNodes, visibleRoutes, selectedNodeId, locale, region, onSelectNode])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    updateAnchor(map, selectedNodeId)
  }, [selectedNodeId, onNodeAnchorUpdate])

  return (
    <div className="cmd-leaflet-map-root">
      <div ref={containerRef} className="cmd-leaflet-map" />
      {!token && (
        <div className="cmd-map-token-hint">
          {t('command.mapTokenHint')}
        </div>
      )}
      <div className="cmd-leaflet-legend">
        <div className="cmd-leaflet-legend-title">{t('command.mapLegend.title')}</div>
        <div className="cmd-leaflet-legend-row">
          <span className="cmd-leaflet-legend-line freight" />
          <span>{t('command.mapLegend.freight')}</span>
        </div>
        <div className="cmd-leaflet-legend-row">
          <span className="cmd-leaflet-legend-line rail" />
          <span>{t('command.mapLegend.rail')}</span>
        </div>
        <div className="cmd-leaflet-legend-row">
          <span className="cmd-leaflet-legend-line sea" />
          <span>{t('command.mapLegend.sea')}</span>
        </div>
        <div className="cmd-leaflet-legend-row">
          <span className="cmd-leaflet-legend-dot risk" />
          <span>{t('command.mapLegend.riskNode')}</span>
        </div>
      </div>
    </div>
  )
}

export function NodeStatusDot({ status }: { status: NodeStatus }) {
  const { t } = useLanguage()
  return (
    <span
      className="cmd-status-dot"
      style={{ background: STATUS_COLORS[status] }}
      title={t(`command.nodeStatusLabel.${status}`)}
    />
  )
}
