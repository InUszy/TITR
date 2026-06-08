import { Fragment, useMemo, useState } from 'react'
import { TablePagination } from '../components/TablePagination'
import {
  LOG_LEVEL_OPTIONS,
  LOG_MODULE_OPTIONS,
  logLevelLabel,
  logManagementMockData,
  type LogLevel,
  type SystemLog,
} from '../types/logManagement'

const PAGE_SIZE = 20

function LogLevelBadge({ level }: { level: LogLevel }) {
  return (
    <span className={`log-level log-level-${level}`}>
      {logLevelLabel(level)}
    </span>
  )
}

export function LogManagementPage() {
  const [keyword, setKeyword] = useState('')
  const [level, setLevel] = useState('')
  const [module, setModule] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase()
    return logManagementMockData.filter((row) => {
      if (level && row.level !== level) return false
      if (module && row.module !== module) return false
      const datePart = row.timestamp.slice(0, 10)
      if (dateStart && datePart < dateStart) return false
      if (dateEnd && datePart > dateEnd) return false
      if (!lower) return true
      return (
        row.operator.toLowerCase().includes(lower)
        || row.action.toLowerCase().includes(lower)
        || row.message.toLowerCase().includes(lower)
        || row.ip.includes(lower)
        || row.id.toLowerCase().includes(lower)
      )
    })
  }, [keyword, level, module, dateStart, dateEnd])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = () => setPage(1)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <>
      <div className="page-header user-mgmt-header">
        <h1 className="page-title">日志管理</h1>
      </div>

      <div className="user-mgmt-toolbar log-mgmt-toolbar">
        <div className="user-mgmt-search">
          <input
            type="text"
            className="user-mgmt-search-input"
            placeholder="搜索操作人、操作、IP 或日志内容"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button type="button" className="user-mgmt-search-btn" aria-label="搜索" onClick={handleSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="log-mgmt-filters">
          <div className="filter-field">
            <span className="filter-label">级别</span>
            <select
              className="sys-filter-select"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value)
                setPage(1)
              }}
            >
              {LOG_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-label">模块</span>
            <select
              className="sys-filter-select"
              value={module}
              onChange={(e) => {
                setModule(e.target.value)
                setPage(1)
              }}
            >
              {LOG_MODULE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-field user-mgmt-date-filter">
            <span className="filter-label">时间范围</span>
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
                onChange={(e) => {
                  setDateStart(e.target.value)
                  setPage(1)
                }}
              />
              <span className="date-separator">~</span>
              <input
                type="date"
                className="date-input"
                value={dateEnd}
                onChange={(e) => {
                  setDateEnd(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="user-mgmt-table-section">
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table log-mgmt-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>级别</th>
                <th>模块</th>
                <th>操作人</th>
                <th>操作</th>
                <th>IP 地址</th>
                <th>耗时</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row: SystemLog) => (
                <Fragment key={row.id}>
                  <tr className={expandedId === row.id ? 'log-row-expanded' : ''}>
                    <td className="cell-muted cell-nowrap">{row.timestamp}</td>
                    <td><LogLevelBadge level={row.level} /></td>
                    <td>{row.module}</td>
                    <td>{row.operator}</td>
                    <td>{row.action}</td>
                    <td><code className="cell-code">{row.ip}</code></td>
                    <td className="cell-muted cell-center">
                      {row.durationMs !== null ? `${row.durationMs} ms` : '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="log-detail-btn"
                        onClick={() => toggleExpand(row.id)}
                      >
                        {expandedId === row.id ? '收起' : '查看'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="log-detail-row">
                      <td colSpan={8}>
                        <div className="log-detail-panel">
                          <span className="log-detail-id">日志 ID：{row.id}</span>
                          <p className="log-detail-message">{row.message}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </>
  )
}
