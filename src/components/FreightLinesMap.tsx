import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '../i18n/LanguageContext'
import { addTiandituBaseLayers, swapTiandituAnnotationLayer, getTiandituToken } from '../utils/tianditu'
import {
  createFreightLinesLayer,
  loadRailwayLinesForCountries,
  type FreightLinesLayer,
} from '../utils/freightLinesCanvas'
import {
  corridorNodes,
  nodeLatLng,
  type CorridorNode,
} from '../types/commandDashboard'
import { getCorridorCountryLabel } from '../types/corridorCountries'
import {
  getRevealedStationsAtStep,
  getStationRoleAtStep,
  getVisibleCountriesAtStep,
  getMaxTrajectoryStep,
} from '../utils/trajectoryVisibility'
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
  /** 分步展示索引；不传则展示完整当前轨迹 */
  trajectoryStep?: number
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

function collectRevealedStationKeys(
  revealed: TrajectoryStation[],
  arrival: TrajectoryStation,
): Set<string> {
  const keys = new Set<string>()
  const add = (station: TrajectoryStation) => {
    stationMatchKey(station).forEach((key) => keys.add(key))
  }
  revealed.forEach(add)
  add(arrival)
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
  trajectoryStep,
}: FreightLinesMapProps) {
  const { t, locale } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const freightLayerRef = useRef<FreightLinesLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const trajectoryLayerRef = useRef<L.LayerGroup | null>(null)
  const annotationLayerRef = useRef<L.Layer | null>(null)
  const annotationLocaleRef = useRef<string | null>(null)
  const hasFitBoundsRef = useRef(false)
  const trajectoryFitKeyRef = useRef<string | null>(null)
  const token = getTiandituToken()

  const effectiveStep = trajectory && trajectoryStep !== undefined
    ? Math.min(Math.max(0, trajectoryStep), getMaxTrajectoryStep(trajectory))
    : (trajectory ? getMaxTrajectoryStep(trajectory) : 0)

  const visibleCountries = useMemo(
    () => (trajectory ? getVisibleCountriesAtStep(trajectory, effectiveStep) : []),
    [trajectory, effectiveStep],
  )
  const visibleCountrySet = useMemo(() => new Set(visibleCountries), [visibleCountries])

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

    const freightLayer = createFreightLinesLayer({ lines: [] })
    freightLayer.addTo(map)
    freightLayerRef.current = freightLayer

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(containerRef.current)

    return () => {
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
      trajectoryFitKeyRef.current = null
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
    const layer = freightLayerRef.current
    if (!layer) return

    let cancelled = false
    if (!visibleCountries.length) {
      layer.setData({ lines: [] })
      return undefined
    }

    loadRailwayLinesForCountries(visibleCountries).then((data) => {
      if (!cancelled) layer.setData(data)
    })

    return () => {
      cancelled = true
    }
  }, [visibleCountries])

  useEffect(() => {
    const map = mapRef.current
    const markersLayer = markersLayerRef.current
    if (!showTmtmOverlay || !map || !markersLayer) return

    markersLayer.clearLayers()
    if (!trajectory) return

    const revealed = getRevealedStationsAtStep(trajectory, effectiveStep)
    const trajectoryKeys = collectRevealedStationKeys(revealed, trajectory.arrival)

    corridorNodes.forEach((node) => {
      if (!visibleCountrySet.has(node.country)) return
      if (isCorridorNodeOnTrajectory(node, trajectoryKeys)) return

      const label = locale === 'en' ? node.nameEn : node.name
      const marker = L.marker(nodeLatLng(node), {
        icon: createTmtmNodeIcon(label),
      })
      marker.bindPopup(`
        <div class="tmtm-map-popup">
          <strong>${label}</strong>
          <div>${t(`mapTest.nodeType.${node.type}`)} · ${getCorridorCountryLabel(node.country, locale)}</div>
          <div>${node.remark}</div>
        </div>
      `)
      marker.addTo(markersLayer)
    })

    if (!hasFitBoundsRef.current) {
      const bounds = L.latLngBounds(corridorNodes.map((node) => nodeLatLng(node)))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5 })
        hasFitBoundsRef.current = true
      }
    }
  }, [showTmtmOverlay, locale, t, trajectory, visibleCountrySet, effectiveStep])

  useEffect(() => {
    const map = mapRef.current
    const trajectoryLayer = trajectoryLayerRef.current
    if (!map || !trajectoryLayer) return

    trajectoryLayer.clearLayers()
    if (!trajectory) return

    const revealed = getRevealedStationsAtStep(trajectory, effectiveStep)
    const completedPath = revealed.map(stationLatLng)

    if (completedPath.length >= 2) {
      L.polyline(completedPath, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.9,
      }).addTo(trajectoryLayer)
    }

    const lastRevealed = revealed[revealed.length - 1]
    if (lastRevealed) {
      L.polyline([stationLatLng(lastRevealed), stationLatLng(trajectory.arrival)], {
        color: '#2563eb',
        weight: 2,
        opacity: 0.55,
        dashArray: '8 6',
      }).addTo(trajectoryLayer)
    }

    revealed.forEach((station, index) => {
      const role = getStationRoleAtStep(trajectory, effectiveStep, index)
      const popupTitle = role === 'departure'
        ? t('mapTest.trajectory.departure')
        : role === 'current'
          ? t('mapTest.trajectory.current')
          : t('mapTest.trajectory.passed')
      addTrajectoryMarker(
        trajectoryLayer,
        station,
        role,
        locale,
        popupTitle,
        role === 'current' ? t('mapTest.trajectory.currentBadge') : undefined,
      )
    })

    addTrajectoryMarker(
      trajectoryLayer,
      trajectory.arrival,
      'arrival',
      locale,
      t('mapTest.trajectory.arrival'),
    )

    if (trajectoryFitKeyRef.current !== trajectory.trainNo) {
      trajectoryFitKeyRef.current = trajectory.trainNo
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
    }
  }, [trajectory, effectiveStep, locale, t])

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
          {showTmtmOverlay && trajectory && (
            <div className="freight-lines-map-legend-row">
              <span className="freight-lines-map-legend-dot" />
              <span>{t('mapTest.legend.tmtmNodeByCountry')}</span>
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
