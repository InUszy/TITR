import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '../i18n/LanguageContext'
import { addTiandituBaseLayers, swapTiandituAnnotationLayer, getTiandituToken } from '../utils/tianditu'
import { createFreightLinesLayer, loadFreightLinesData } from '../utils/freightLinesCanvas'
import {
  corridorNodes,
  nodeLatLng,
  type CorridorNode,
} from '../types/commandDashboard'
import type { TrainTrajectory, TrajectoryStation, TrajectoryStationRole } from '../types/trainTrajectory'

const DEFAULT_CENTER: L.LatLngExpression = [44, 58]
const DEFAULT_ZOOM = 4

interface FreightLinesMapProps {
  center?: L.LatLngExpression
  zoom?: number
  className?: string
  showLegend?: boolean
  showTmtmOverlay?: boolean
  trajectory?: TrainTrajectory | null
}

function stationLatLng(station: TrajectoryStation): L.LatLngExpression {
  return [station.lat, station.lng]
}

function stationLabel(station: TrajectoryStation, locale: string): string {
  return locale === 'en' && station.nameEn ? station.nameEn : station.name
}

function stationMatchKey(station: TrajectoryStation): string[] {
  const keys = [`coord:${station.lat.toFixed(4)},${station.lng.toFixed(4)}`]
  if (station.id) keys.push(`id:${station.id}`)
  return keys
}

function collectTrajectoryStationKeys(trajectory: TrainTrajectory): Set<string> {
  const keys = new Set<string>()
  const add = (station: TrajectoryStation) => {
    stationMatchKey(station).forEach((key) => keys.add(key))
  }
  add(trajectory.departure)
  add(trajectory.arrival)
  add(trajectory.current)
  trajectory.passedStations.forEach(add)
  return keys
}

function isCorridorNodeOnTrajectory(node: CorridorNode, trajectoryKeys: Set<string>): boolean {
  if (trajectoryKeys.has(`id:${node.id}`)) return true
  return trajectoryKeys.has(`coord:${node.lat.toFixed(4)},${node.lng.toFixed(4)}`)
}

function createTmtmNodeIcon(label: string) {
  return L.divIcon({
    className: 'tmtm-map-marker',
    html: `
      <div class="tmtm-map-marker-wrap">
        <span class="tmtm-map-marker-dot"></span>
        <span class="tmtm-map-marker-label">${label}</span>
      </div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 14],
  })
}

function createTrajectoryNodeIcon(label: string, role: TrajectoryStationRole, badge?: string) {
  const pulse = role === 'current'
    ? '<span class="trajectory-map-marker-pulse"></span><span class="trajectory-map-marker-ring"></span>'
    : ''
  const badgeHtml = badge
    ? `<span class="trajectory-map-marker-badge">${badge}</span>`
    : ''

  return L.divIcon({
    className: 'trajectory-map-marker',
    html: `
      <div class="trajectory-map-marker-wrap trajectory-map-marker-wrap--${role}">
        <div class="trajectory-map-marker-dot-wrap">
          ${pulse}
          <span class="trajectory-map-marker-dot"></span>
        </div>
        ${badgeHtml}
        <span class="trajectory-map-marker-label">${label}</span>
      </div>
    `,
    iconSize: role === 'current' ? [96, 52] : [88, 36],
    iconAnchor: [role === 'current' ? 48 : 44, role === 'current' ? 22 : 14],
  })
}

function addTrajectoryMarker(
  layer: L.LayerGroup,
  station: TrajectoryStation,
  role: TrajectoryStationRole,
  locale: string,
  popupTitle: string,
  currentBadge?: string,
) {
  const label = stationLabel(station, locale)
  const marker = L.marker(stationLatLng(station), {
    icon: createTrajectoryNodeIcon(label, role, role === 'current' ? currentBadge : undefined),
    zIndexOffset: role === 'current' ? 1200 : role === 'passed' ? 400 : 700,
  })
  const arrivedLine = station.arrivedAt
    ? `<div>${popupTitle}: ${station.arrivedAt}</div>`
    : ''
  marker.bindPopup(`
    <div class="tmtm-map-popup">
      <strong>${label}</strong>
      <div>${popupTitle}</div>
      ${arrivedLine}
    </div>
  `)
  marker.addTo(layer)
}

export function FreightLinesMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
  showLegend = false,
  showTmtmOverlay = false,
  trajectory = null,
}: FreightLinesMapProps) {
  const { t, locale } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const freightLayerRef = useRef<L.Layer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const trajectoryLayerRef = useRef<L.LayerGroup | null>(null)
  const annotationLayerRef = useRef<L.Layer | null>(null)
  const annotationLocaleRef = useRef<string | null>(null)
  const hasFitBoundsRef = useRef(false)
  const token = getTiandituToken()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center,
      zoom,
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

    mapRef.current = map

    if (showTmtmOverlay) {
      markersLayerRef.current = L.layerGroup().addTo(map)
    }
    trajectoryLayerRef.current = L.layerGroup().addTo(map)

    let cancelled = false
    loadFreightLinesData().then((data) => {
      if (cancelled || !data || !mapRef.current) return
      const layer = createFreightLinesLayer(data)
      layer.addTo(mapRef.current)
      freightLayerRef.current = layer
    })

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      cancelled = true
      resizeObserver.disconnect()
      if (freightLayerRef.current) {
        freightLayerRef.current.remove()
      }
      map.remove()
      mapRef.current = null
      freightLayerRef.current = null
      markersLayerRef.current = null
      trajectoryLayerRef.current = null
      annotationLayerRef.current = null
      annotationLocaleRef.current = null
      hasFitBoundsRef.current = false
    }
  }, [token, center, zoom, showTmtmOverlay])

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
    const markersLayer = markersLayerRef.current
    if (!showTmtmOverlay || !map || !markersLayer) return

    markersLayer.clearLayers()
    const trajectoryKeys = trajectory ? collectTrajectoryStationKeys(trajectory) : null

    corridorNodes.forEach((node) => {
      if (trajectoryKeys && isCorridorNodeOnTrajectory(node, trajectoryKeys)) return

      const label = locale === 'en' ? node.nameEn : node.name
      const marker = L.marker(nodeLatLng(node), {
        icon: createTmtmNodeIcon(label),
      })
      marker.bindPopup(`
        <div class="tmtm-map-popup">
          <strong>${label}</strong>
          <div>${t(`mapTest.nodeType.${node.type}`)} · ${t(`command.region.${node.region}`)}</div>
          <div>${node.remark}</div>
        </div>
      `)
      marker.addTo(markersLayer)
    })

    if (!trajectory && !hasFitBoundsRef.current) {
      const bounds = L.latLngBounds(corridorNodes.map((node) => nodeLatLng(node)))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5 })
        hasFitBoundsRef.current = true
      }
    }
  }, [showTmtmOverlay, locale, t, trajectory])

  useEffect(() => {
    const map = mapRef.current
    const trajectoryLayer = trajectoryLayerRef.current
    if (!map || !trajectoryLayer) return

    trajectoryLayer.clearLayers()
    if (!trajectory) return

    const completedPath: L.LatLngExpression[] = [
      stationLatLng(trajectory.departure),
      ...trajectory.passedStations.map(stationLatLng),
      stationLatLng(trajectory.current),
    ]

    if (completedPath.length >= 2) {
      L.polyline(completedPath, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.9,
      }).addTo(trajectoryLayer)
    }

    L.polyline([stationLatLng(trajectory.current), stationLatLng(trajectory.arrival)], {
      color: '#2563eb',
      weight: 2,
      opacity: 0.55,
      dashArray: '8 6',
    }).addTo(trajectoryLayer)

    addTrajectoryMarker(
      trajectoryLayer,
      trajectory.departure,
      'departure',
      locale,
      t('mapTest.trajectory.departure'),
    )
    trajectory.passedStations.forEach((station) => {
      addTrajectoryMarker(
        trajectoryLayer,
        station,
        'passed',
        locale,
        t('mapTest.trajectory.passed'),
      )
    })
    addTrajectoryMarker(
      trajectoryLayer,
      trajectory.current,
      'current',
      locale,
      t('mapTest.trajectory.current'),
      t('mapTest.trajectory.currentBadge'),
    )
    addTrajectoryMarker(
      trajectoryLayer,
      trajectory.arrival,
      'arrival',
      locale,
      t('mapTest.trajectory.arrival'),
    )

    const allPoints = [
      trajectory.departure,
      ...trajectory.passedStations,
      trajectory.current,
      trajectory.arrival,
    ].map(stationLatLng)
    const bounds = L.latLngBounds(allPoints)
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 6 })
    }
  }, [trajectory, locale, t])

  return (
    <div className={`freight-lines-map-root ${className}`.trim()}>
      <div ref={containerRef} className="freight-lines-map" />
      {!token && (
        <div className="freight-lines-map-token-hint">
          {t('command.mapTokenHint')}
        </div>
      )}
      {showLegend && (
        <div className="freight-lines-map-legend">
          <div className="freight-lines-map-legend-title">{t('command.mapLegend.title')}</div>
          <div className="freight-lines-map-legend-row">
            <span className="freight-lines-map-legend-line freight" />
            <span>{t('command.mapLegend.freight')}</span>
          </div>
          {showTmtmOverlay && (
            <div className="freight-lines-map-legend-row">
              <span className="freight-lines-map-legend-dot" />
              <span>{t('mapTest.legend.tmtmNode')}</span>
            </div>
          )}
          {trajectory && (
            <>
              <div className="freight-lines-map-legend-row">
                <span className="freight-lines-map-legend-line trajectory-done" />
                <span>{t('mapTest.legend.trajectoryDone')}</span>
              </div>
              <div className="freight-lines-map-legend-row">
                <span className="freight-lines-map-legend-line trajectory-planned" />
                <span>{t('mapTest.legend.trajectoryPlanned')}</span>
              </div>
              <div className="freight-lines-map-legend-row">
                <span className="freight-lines-map-legend-dot trajectory-passed" />
                <span>{t('mapTest.trajectory.passed')}</span>
              </div>
              <div className="freight-lines-map-legend-row">
                <span className="freight-lines-map-legend-dot trajectory-current" />
                <span>{t('mapTest.trajectory.current')}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
