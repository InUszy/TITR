import { useMemo, useState } from 'react'
import {
  AGGREGATION_STATIONS,
  aggregationMockData,
  type AggregationMessage,
  type AggregationStructuredData,
} from '../types/dataAggregation'

function formatTimelineDate(dateStr: string) {
  const [datePart, timePart] = dateStr.split(' ')
  const [, month, day] = datePart.split('-')
  return {
    label: `${Number(day)} ${Number(month)}月`,
    year: datePart.slice(0, 4),
    time: timePart?.slice(0, 8) ?? '',
  }
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

function AggregationTimelineItem({ message }: { message: AggregationMessage }) {
  const [rawExpanded, setRawExpanded] = useState(false)
  const { label, year, time } = formatTimelineDate(message.receivedAt)

  return (
    <div className="agg-timeline-item">
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
        </div>

        <div className="agg-section">
          <h4 className="agg-section-title">结构化数据</h4>
          <StructuredFields data={message.structured} />
        </div>

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
            原始数据
          </button>
          {rawExpanded && (
            <pre className="agg-raw-content">{message.rawData}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export function DataAggregationPage() {
  const [station, setStation] = useState('all')
  const [dateStart, setDateStart] = useState('2026-05-15')
  const [dateEnd, setDateEnd] = useState('2026-05-26')

  const messages = useMemo(() => {
    return aggregationMockData
      .filter((msg) => {
        if (station !== 'all' && msg.station !== station) return false
        const date = msg.receivedAt.slice(0, 10)
        if (date < dateStart || date > dateEnd) return false
        return true
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  }, [station, dateStart, dateEnd])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">数据汇聚</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-field">
          <label className="filter-label" htmlFor="agg-station">站点</label>
          <div className="filter-select">
            <select
              id="agg-station"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            >
              <option value="all">全部站点</option>
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
          <span className="filter-label">时间</span>
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

        <span className="agg-result-count">共 {messages.length} 条消息</span>
      </div>

      <div className="agg-timeline-section">
        <div className="agg-timeline-wrapper">
          {messages.length === 0 ? (
            <div className="agg-empty">当前筛选条件下暂无消息</div>
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
