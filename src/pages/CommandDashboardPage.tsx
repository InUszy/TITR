import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CommandCorridorMap, NodeStatusDot } from '../components/CommandCorridorMap'
import { useLanguage } from '../i18n/LanguageContext'
import {
  REGION_OPTIONS,
  activeTrajectories,
  corridorNodes,
  getNodeById,
  globalStats,
  riskAlerts,
  type CorridorNode,
  type DashboardRegion,
  type RiskAlert,
  type RiskLevel,
} from '../types/commandDashboard'

const MAP_VIEWBOX = { width: 420, height: 280 }

const expandIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
)

const compressIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 14h6v6" />
    <path d="M20 10h-6V4" />
    <path d="M14 14l7 7" />
    <path d="M3 3l7 7" />
  </svg>
)

function getAnchoredPopupStyle(node: CorridorNode) {
  const leftPct = (node.x / MAP_VIEWBOX.width) * 100
  const topPct = (node.y / MAP_VIEWBOX.height) * 100
  const flipX = leftPct > 62
  const flipY = topPct > 50
  return {
    left: `${leftPct}%`,
    top: `${topPct}%`,
    transform: `translate(calc(${flipX ? '-100% - 8px' : '12px'}), calc(${flipY ? '-100% - 8px' : '12px'}))`,
  } as const
}

function RiskBadge({ level }: { level: RiskLevel | 'none' }) {
  const { t } = useLanguage()
  if (level === 'none') return <span className="cmd-risk-none">{t('command.riskLevel.none')}</span>
  return <span className={`cmd-risk-badge cmd-risk-${level}`}>{t(`command.riskLevel.${level}`)}</span>
}

function nodeDisplayName(node: CorridorNode, locale: string) {
  return locale === 'en' ? node.nameEn : node.name
}

function RiskAlertPopup({ risk, node, onClose }: { risk: RiskAlert; node: CorridorNode; onClose: () => void }) {
  const { t, locale } = useLanguage()
  const affectedTrajectories = activeTrajectories.filter(
    (t) => t.currentNodeId === risk.nodeId || t.routeNodeIds.includes(risk.nodeId),
  )

  return (
    <div className="cmd-map-popup cmd-risk-popup" style={getAnchoredPopupStyle(node)}>
      <div className={`cmd-risk-popup-accent cmd-risk-item-${risk.level}`} />
      <div className="cmd-map-popup-header">
        <div className="cmd-risk-popup-title-row">
          <RiskBadge level={risk.level} />
          <span className="cmd-risk-popup-node">{nodeDisplayName(node, locale)}</span>
        </div>
        <button type="button" className="cmd-map-popup-close" onClick={onClose} aria-label={t('common.close')}>×</button>
      </div>
      <strong className="cmd-risk-popup-title">{risk.title}</strong>
      <p className="cmd-risk-popup-message">{risk.message}</p>
      <span className="cmd-risk-popup-time">{risk.time}</span>
      {affectedTrajectories.length > 0 && (
        <div className="cmd-risk-popup-tracks">
          <h4>{t('command.impactTracking')} ({affectedTrajectories.length})</h4>
          {affectedTrajectories.slice(0, 3).map((track) => (
            <div key={track.id} className="cmd-track-mini">
              <span>{track.trainNo} · {track.containers.length} TEU</span>
              <RiskBadge level={track.riskLevel} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NodeDetailPanel({ node, onClose }: { node: CorridorNode; onClose: () => void }) {
  const { t, locale } = useLanguage()
  const relatedRisks = riskAlerts.filter((r) => r.nodeId === node.id)

  return (
    <div className="cmd-map-popup cmd-node-popup" style={getAnchoredPopupStyle(node)}>
      <div className="cmd-map-popup-header">
        <div>
          <h3>{nodeDisplayName(node, locale)}</h3>
          <span className="cmd-node-detail-en">{node.nameEn}</span>
        </div>
        <button type="button" className="cmd-map-popup-close" onClick={onClose} aria-label={t('common.close')}>×</button>
      </div>
      <dl className="cmd-node-popup-grid">
        <div><dt>{t('command.popup.status')}</dt><dd><NodeStatusDot status={node.status} /> {t(`command.nodeStatusLabel.${node.status}`)}</dd></div>
        <div><dt>{t('command.popup.congestion')}</dt><dd>{node.congestion}</dd></div>
        <div><dt>{t('command.popup.containers')}</dt><dd>{node.containers} TEU</dd></div>
        <div><dt>{t('command.popup.wait')}</dt><dd>{node.avgWaitHours}h</dd></div>
      </dl>
      {relatedRisks.length > 0 && (
        <div className="cmd-node-popup-risks">
          {relatedRisks.slice(0, 2).map((r) => (
            <div key={r.id} className={`cmd-risk-popup-mini cmd-risk-item-${r.level}`}>
              <strong>{r.title}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TRACK_POPOVER_GAP = 8

function TrainTrackCard({
  track,
  locale,
}: {
  track: (typeof activeTrajectories)[number]
  locale: string
}) {
  const { t } = useLanguage()
  const [showContainers, setShowContainers] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const anchorRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const currentNode = getNodeById(track.currentNodeId)
  const routeLabels = track.routeNodeIds
    .map((id) => {
      const n = getNodeById(id)
      return n ? nodeDisplayName(n, locale) : null
    })
    .filter(Boolean)
    .join(' → ')

  const updatePopoverPosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const height = popoverRef.current?.offsetHeight ?? 168
    const width = popoverRef.current?.offsetWidth ?? 240
    setPopoverPos({
      top: Math.max(8, rect.top - height - TRACK_POPOVER_GAP),
      left: Math.min(Math.max(8, rect.left), window.innerWidth - width - 8),
    })
  }, [])

  useLayoutEffect(() => {
    if (!showContainers) return
    updatePopoverPosition()
  }, [showContainers, updatePopoverPosition, track.containers.length])

  useEffect(() => {
    if (!showContainers) return

    window.addEventListener('scroll', updatePopoverPosition, true)
    window.addEventListener('resize', updatePopoverPosition)

    return () => {
      window.removeEventListener('scroll', updatePopoverPosition, true)
      window.removeEventListener('resize', updatePopoverPosition)
    }
  }, [showContainers, updatePopoverPosition])

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openContainers = () => {
    clearCloseTimer()
    setShowContainers(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setShowContainers(false), 120)
  }

  return (
    <div className="cmd-track-card">
      <div className="cmd-track-card-header">
        <span className="cmd-track-train">{track.trainNo}</span>
        <RiskBadge level={track.riskLevel} />
      </div>
      <div
        ref={anchorRef}
        className="cmd-track-meta-wrap"
        onMouseEnter={openContainers}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className="cmd-track-meta-trigger"
          aria-expanded={showContainers}
          onClick={(e) => {
            e.stopPropagation()
            if (showContainers) {
              setShowContainers(false)
            } else {
              openContainers()
            }
          }}
        >
          {t('command.containerCount')} {track.containers.length}
        </button>
      </div>
      <div className="cmd-track-route" title={routeLabels}>{routeLabels}</div>
      <div className="cmd-track-progress">
        <div className="cmd-track-progress-bar">
          <div className="cmd-track-progress-fill" style={{ width: `${track.progress}%` }} />
        </div>
        <span>{t('command.currentAt', { progress: track.progress, node: currentNode ? nodeDisplayName(currentNode, locale) : '—' })}</span>
      </div>

      {showContainers && createPortal(
        <div
          ref={popoverRef}
          className="cmd-track-containers-popover cmd-track-containers-popover-portal"
          style={{ top: popoverPos.top, left: popoverPos.left }}
          role="tooltip"
          onMouseEnter={openContainers}
          onMouseLeave={scheduleClose}
        >
          <div className="cmd-track-containers-popover-title">{t('command.containersOnTrain')}</div>
          <ul className="cmd-track-containers-list">
            {track.containers.map((c) => (
              <li key={c.containerNo} className="cmd-track-container-item">
                <span className="cmd-track-container-no">{c.containerNo}</span>
                <span className="cmd-track-container-waybill">{c.waybillNo}</span>
              </li>
            ))}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  )
}

export function CommandDashboardPage() {
  const { t, locale } = useLanguage()
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [region, setRegion] = useState<DashboardRegion>('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === dashboardRef.current)
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const toggleFullscreen = async () => {
    const el = dashboardRef.current
    if (!el) return
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen()
      } else {
        await el.requestFullscreen()
      }
    } catch {
      // 浏览器不支持或用户拒绝全屏时忽略
    }
  }

  const stats = useMemo(() => globalStats(region), [region])

  const filteredNodes = useMemo(
    () => (region === 'all' ? corridorNodes : corridorNodes.filter((n) => n.region === region)),
    [region],
  )

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes])

  const filteredRisks = useMemo(
    () => riskAlerts.filter((r) => region === 'all' || filteredNodeIds.has(r.nodeId)),
    [region, filteredNodeIds],
  )

  const filteredTrajectories = useMemo(
    () => activeTrajectories.filter((t) =>
      region === 'all' || filteredNodeIds.has(t.currentNodeId) || t.routeNodeIds.some((id) => filteredNodeIds.has(id)),
    ),
    [region, filteredNodeIds],
  )

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) ?? null : null
  const selectedRisk = selectedRiskId ? riskAlerts.find((r) => r.id === selectedRiskId) ?? null : null

  const breadcrumb = region === 'all'
    ? t('command.breadcrumbAll')
    : `${t(`command.region.${region}`)}${selectedNode ? ` › ${nodeDisplayName(selectedNode, locale)}` : ''}`

  const handleRegionChange = (next: DashboardRegion) => {
    setRegion(next)
    setSelectedNodeId(null)
    setSelectedRiskId(null)
  }

  const handleSelectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId)
    setSelectedRiskId(null)
  }

  const handleSelectRisk = (risk: RiskAlert) => {
    if (selectedRiskId === risk.id) {
      handleClosePopup()
      return
    }
    setSelectedRiskId(risk.id)
    setSelectedNodeId(risk.nodeId)
  }

  const handleClosePopup = () => {
    setSelectedNodeId(null)
    setSelectedRiskId(null)
  }

  return (
    <div className="cmd-dashboard" ref={dashboardRef}>
      <header className="cmd-header">
        <div className="cmd-header-left">
          <h1 className="cmd-title">{t('command.title')}</h1>
          <span className="cmd-subtitle">{t('command.subtitle')}</span>
          <span className="cmd-breadcrumb">{breadcrumb}</span>
        </div>
        <div className="cmd-header-right">
          <div className="cmd-region-tabs">
            {REGION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cmd-region-tab ${region === opt.value ? 'active' : ''}`}
                onClick={() => handleRegionChange(opt.value)}
              >
                {t(`command.region.${opt.value}`)}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="cmd-fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? t('command.exitFullscreen') : t('command.fullscreen')}
            aria-label={isFullscreen ? t('command.exitFullscreen') : t('command.fullscreen')}
          >
            {isFullscreen ? compressIcon : expandIcon}
          </button>
        </div>
      </header>

      <div className="cmd-kpi-row">
        <div className="cmd-kpi-card">
          <span className="cmd-kpi-value">{stats.inTransit}</span>
          <span className="cmd-kpi-label">{t('command.inTransit')}</span>
        </div>
        <div className="cmd-kpi-card">
          <span className="cmd-kpi-value">{stats.activeNodes}</span>
          <span className="cmd-kpi-label">{t('command.activeNodes')}</span>
        </div>
        <div className="cmd-kpi-card">
          <span className="cmd-kpi-value">{stats.totalContainers.toLocaleString()}</span>
          <span className="cmd-kpi-label">{t('command.totalContainers')}</span>
        </div>
        <div className="cmd-kpi-card cmd-kpi-risk">
          <span className="cmd-kpi-value">{stats.riskCount}</span>
          <span className="cmd-kpi-label">
            {t('command.riskAlerts')}
            {stats.highRiskCount > 0 && ` ${t('command.highRiskSuffix', { count: stats.highRiskCount })}`}
          </span>
        </div>
      </div>

      <div className="cmd-main">
        <aside className="cmd-panel cmd-panel-left">
          <h2 className="cmd-panel-title">{t('command.nodeStatus')}</h2>
          <div className="cmd-node-list">
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`cmd-node-item ${selectedNodeId === node.id ? 'active' : ''}`}
                onClick={() => handleSelectNode(node.id === selectedNodeId ? null : node.id)}
              >
                <NodeStatusDot status={node.status} />
                <div className="cmd-node-item-info">
                  <span className="cmd-node-item-name">{nodeDisplayName(node, locale)}</span>
                  <span className="cmd-node-item-meta">{node.congestion} · {node.containers} TEU</span>
                </div>
                <span className="cmd-node-item-status">{t(`command.nodeStatusLabel.${node.status}`)}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="cmd-map-area" onClick={() => handleClosePopup()}>
          <CommandCorridorMap
            region={region}
            selectedNodeId={selectedNodeId}
            onSelectNode={(node) => {
              if (node) handleSelectNode(node.id)
              else handleClosePopup()
            }}
          />
          <div className="cmd-map-popups" onClick={(e) => e.stopPropagation()}>
            {selectedRisk && selectedNode && (
              <RiskAlertPopup risk={selectedRisk} node={selectedNode} onClose={handleClosePopup} />
            )}
            {selectedNode && !selectedRisk && (
              <NodeDetailPanel node={selectedNode} onClose={handleClosePopup} />
            )}
          </div>
        </section>

        <aside className="cmd-panel cmd-panel-right">
          <h2 className="cmd-panel-title">{t('command.riskAlerts')}</h2>
          <div className="cmd-risk-list">
            {filteredRisks.length === 0 ? (
              <p className="cmd-empty">{t('command.noRisks')}</p>
            ) : (
              filteredRisks.map((risk) => (
                <button
                  key={risk.id}
                  type="button"
                  className={`cmd-risk-item cmd-risk-item-${risk.level} ${selectedRiskId === risk.id ? 'active' : ''}`}
                  onClick={() => handleSelectRisk(risk)}
                >
                  <div className="cmd-risk-item-header">
                    <RiskBadge level={risk.level} />
                    <span className="cmd-risk-node">{getNodeById(risk.nodeId) ? nodeDisplayName(getNodeById(risk.nodeId)!, locale) : risk.nodeName}</span>
                    <span className="cmd-risk-time">{risk.time.slice(11, 16)}</span>
                  </div>
                  <strong>{risk.title}</strong>
                  <p>{risk.message}</p>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      <footer className="cmd-track-panel">
        <h2 className="cmd-panel-title">{t('command.trajectory')}</h2>
        <div className="cmd-track-scroll">
          {filteredTrajectories.map((track) => (
            <TrainTrackCard key={track.id} track={track} locale={locale} />
          ))}
        </div>
      </footer>
    </div>
  )
}
