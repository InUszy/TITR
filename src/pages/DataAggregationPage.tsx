import { useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import {
  AGGREGATION_STATIONS,
  aggregationMockData,
  truncateAggHash,
  type AggregationBlockchain,
  type AggregationBlockchainStatus,
  type AggregationMessage,
  type AggregationStructuredData,
} from '../types/dataAggregation'

const AGG_CERT_KEY: Record<AggregationBlockchainStatus, 'certified' | 'certifying' | 'none'> = {
  notarized: 'certified',
  pending: 'certifying',
  none: 'none',
}

function formatTimelineDate(dateStr: string) {
  const [datePart, timePart] = dateStr.split(' ')
  const [, month, day] = datePart.split('-')
  return {
    label: `${Number(day)} ${Number(month)}月`,
    year: datePart.slice(0, 4),
    time: timePart?.slice(0, 8) ?? '',
  }
}

function BlockchainStatusBadge({ status }: { status: AggregationBlockchainStatus }) {
  const { t } = useLanguage()
  if (status === 'none') return null
  return (
    <span className={`agg-chain-status agg-chain-status-${status}`}>
      {t(`aggregation.cert.${AGG_CERT_KEY[status]}`)}
    </span>
  )
}

function StructuredFields({ data }: { data: AggregationStructuredData }) {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined && value !== '')

  return (
    <dl className="agg-structured-grid">
      {entries.map(([key, value]) => (
        <div key={key} className="agg-structured-item">
          <dt>{fieldLabel(key)}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function fieldLabel(key: string) {
  const labels: Record<string, string> = {
    containerNo: '集装箱号',
    waybillNo: '运单号',
    eventType: '事件类型',
    location: '位置',
    status: '状态',
    trainNo: '车次',
    wagonNo: '车号',
    customsStatus: '报关状态',
    remark: '备注',
  }
  return labels[key] ?? key
}

function AggregationBlockchainModal({
  message,
  onClose,
}: {
  message: AggregationMessage
  onClose: () => void
}) {
  const { t } = useLanguage()
  const chain = message.blockchain as AggregationBlockchain

  return (
    <div className="file-modal-overlay" onClick={onClose}>
      <div className="export-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-modal-header">
          <div>
            <h2 className="file-modal-title">{t('aggregation.modalTitle')}</h2>
            <p className="file-modal-subtitle">
              {message.station} · {message.structured.eventType}
            </p>
          </div>
          <button type="button" className="file-modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className="file-modal-body">
          <div className="chain-info-banner">
            <span className="chain-info-icon">⛓</span>
            <div>
              <strong>{chain.chainName}</strong>
              <span className="chain-info-network">{chain.network}</span>
            </div>
            <BlockchainStatusBadge status={message.blockchainStatus} />
          </div>

          <dl className="chain-info-grid">
            <div className="chain-info-item">
              <dt>{t('blockchain.txHash')}</dt>
              <dd><code title={chain.txHash}>{chain.txHash}</code></dd>
            </div>
            <div className="chain-info-item">
              <dt>{t('blockchain.dataHash')}</dt>
              <dd><code title={chain.dataHash}>{chain.dataHash}</code></dd>
            </div>
            <div className="chain-info-item">
              <dt>{t('blockchain.blockHeight')}</dt>
              <dd>{chain.blockHeight.toLocaleString()}</dd>
            </div>
            <div className="chain-info-item">
              <dt>{t('blockchain.blockTime')}</dt>
              <dd>{chain.blockTime}</dd>
            </div>
            <div className="chain-info-item">
              <dt>{t('blockchain.certTime')}</dt>
              <dd>{chain.notarizedAt}</dd>
            </div>
            <div className="chain-info-item">
              <dt>{t('blockchain.confirmations')}</dt>
              <dd>{chain.confirmations}</dd>
            </div>
            <div className="chain-info-item chain-info-item-full">
              <dt>{t('blockchain.contract')}</dt>
              <dd><code title={chain.contractAddress}>{chain.contractAddress}</code></dd>
            </div>
            <div className="chain-info-item chain-info-item-full">
              <dt>{t('blockchain.node')}</dt>
              <dd>{chain.verifier}</dd>
            </div>
          </dl>

          <div className="chain-verify-note">
            {t('aggregation.certDesc')}
          </div>
        </div>
      </div>
    </div>
  )
}

function AggregationTimelineItem({ message }: { message: AggregationMessage }) {
  const { t } = useLanguage()
  const [rawExpanded, setRawExpanded] = useState(false)
  const [chainModalOpen, setChainModalOpen] = useState(false)
  const { label, year, time } = formatTimelineDate(message.receivedAt)

  return (
    <div className={`agg-timeline-item ${message.blockchainRequired ? 'agg-timeline-item-key' : ''}`}>
      <div className="timeline-axis">
        <div className="timeline-date-block">
          <span className="timeline-date">{label}</span>
          <span className="timeline-year">{year}</span>
          <span className="timeline-time">{time}</span>
        </div>
        <div className="timeline-dot agg-timeline-dot" />
        <div className="timeline-line" />
      </div>

      <div className="agg-timeline-body">
        <div className="agg-card-header">
          <span className="agg-station-badge">{message.station}</span>
          <span className="agg-source">{message.sourceSystem}</span>
          <span className="agg-event-type">{message.structured.eventType}</span>
          {message.blockchainRequired && (
            <span className="agg-key-event-badge">{t('aggregation.keyEvent')}</span>
          )}
          {message.blockchainRequired && (
            <BlockchainStatusBadge status={message.blockchainStatus} />
          )}
        </div>

        <div className="agg-section">
          <h4 className="agg-section-title">{t('aggregation.structuredData')}</h4>
          <StructuredFields data={message.structured} />
        </div>

        {message.blockchainRequired && (
          <div className="agg-section agg-blockchain-section">
            <h4 className="agg-section-title">{t('aggregation.blockchainCert')}</h4>
            <div className="agg-blockchain-panel">
              <div className="agg-blockchain-summary">
                <span className="agg-blockchain-label">{t('aggregation.certStatus')}</span>
                <BlockchainStatusBadge status={message.blockchainStatus} />
              </div>
              {message.blockchain && (
                <div className="agg-blockchain-summary">
                  <span className="agg-blockchain-label">{t('blockchain.txHash')}</span>
                  <code className="agg-blockchain-hash" title={message.blockchain.txHash}>
                    {truncateAggHash(message.blockchain.txHash)}
                  </code>
                </div>
              )}
              {message.blockchainStatus === 'notarized' && message.blockchain && (
                <button
                  type="button"
                  className="file-action-btn"
                  onClick={() => setChainModalOpen(true)}
                >
                  {t('aggregation.viewChain')}
                </button>
              )}
              {message.blockchainStatus === 'pending' && (
                <p className="agg-blockchain-pending">{t('aggregation.certPending')}</p>
              )}
            </div>
          </div>
        )}

        <div className="agg-section">
          <button
            type="button"
            className="agg-raw-toggle"
            onClick={() => setRawExpanded((prev) => !prev)}
            aria-expanded={rawExpanded}
          >
            <svg
              className={`agg-raw-chevron ${rawExpanded ? 'open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {t('aggregation.rawData')}
          </button>
          {rawExpanded && (
            <pre className="agg-raw-content">{message.rawData}</pre>
          )}
        </div>
      </div>

      {chainModalOpen && message.blockchain && (
        <AggregationBlockchainModal message={message} onClose={() => setChainModalOpen(false)} />
      )}
    </div>
  )
}

export function DataAggregationPage() {
  const { t } = useLanguage()
  const [station, setStation] = useState('all')
  const [keyEventOnly, setKeyEventOnly] = useState(false)
  const [dateStart, setDateStart] = useState('2026-05-15')
  const [dateEnd, setDateEnd] = useState('2026-05-26')

  const messages = useMemo(() => {
    return aggregationMockData
      .filter((msg) => {
        if (station !== 'all' && msg.station !== station) return false
        if (keyEventOnly && !msg.blockchainRequired) return false
        const date = msg.receivedAt.slice(0, 10)
        if (date < dateStart || date > dateEnd) return false
        return true
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  }, [station, keyEventOnly, dateStart, dateEnd])

  const keyEventCount = useMemo(
    () => aggregationMockData.filter((msg) => msg.blockchainRequired).length,
    [],
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('aggregation.title')}</h1>
        <p className="export-page-desc">
          {t('aggregation.desc', { count: keyEventCount })}
        </p>
      </div>

      <div className="filter-bar">
        <div className="filter-field">
          <label className="filter-label" htmlFor="agg-station">{t('aggregation.station')}</label>
          <div className="filter-select">
            <select
              id="agg-station"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            >
              <option value="all">{t('aggregation.allStations')}</option>
              {AGGREGATION_STATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className="filter-field">
          <span className="filter-label">{t('aggregation.event')}</span>
          <select
            className="sys-filter-select"
            value={keyEventOnly ? 'key' : 'all'}
            onChange={(e) => setKeyEventOnly(e.target.value === 'key')}
          >
            <option value="all">{t('aggregation.allMessages')}</option>
            <option value="key">{t('aggregation.keyEventsOnly')}</option>
          </select>
        </div>

        <div className="filter-field">
          <span className="filter-label">{t('common.time')}</span>
          <div className="date-range">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              className="date-input"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
            <span className="date-separator">~</span>
            <input
              type="date"
              className="date-input"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>

        <span className="agg-result-count">{t('common.totalMessages', { count: messages.length })}</span>
      </div>

      <div className="agg-timeline-section">
        <div className="agg-timeline-wrapper">
          {messages.length === 0 ? (
            <div className="agg-empty">{t('aggregation.empty')}</div>
          ) : (
            <div className="agg-timeline">
              {messages.map((msg) => (
                <AggregationTimelineItem key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
