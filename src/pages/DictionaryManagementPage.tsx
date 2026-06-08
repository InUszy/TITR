import { useMemo, useState } from 'react'
import { TablePagination } from '../components/TablePagination'
import {
  DICT_TYPE_OPTIONS,
  dictStatusLabel,
  dictionaryMockData,
  type DictStatus,
  type DictionaryEntry,
} from '../types/dictionaryManagement'

const PAGE_SIZE = 20

function DictStatusBadge({ status }: { status: DictStatus }) {
  return (
    <span className={`dict-status dict-status-${status}`}>
      <span className="dict-status-dot" />
      {dictStatusLabel(status)}
    </span>
  )
}

export function DictionaryManagementPage() {
  const [keyword, setKeyword] = useState('')
  const [dictType, setDictType] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase()
    return dictionaryMockData.filter((row) => {
      if (dictType && row.dictType !== dictType) return false
      if (!lower) return true
      return (
        row.dictCode.toLowerCase().includes(lower)
        || row.dictLabel.toLowerCase().includes(lower)
        || row.dictValue.toLowerCase().includes(lower)
        || row.remark.toLowerCase().includes(lower)
      )
    })
  }, [keyword, dictType])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = () => setPage(1)

  return (
    <>
      <div className="page-header user-mgmt-header">
        <h1 className="page-title">字典管理</h1>
      </div>

      <div className="user-mgmt-toolbar">
        <div className="user-mgmt-search">
          <input
            type="text"
            className="user-mgmt-search-input"
            placeholder="搜索编码、名称、字典值或备注"
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

        <div className="filter-field">
          <span className="filter-label">字典类型</span>
          <select
            className="sys-filter-select"
            value={dictType}
            onChange={(e) => {
              setDictType(e.target.value)
              setPage(1)
            }}
          >
            {DICT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="user-mgmt-table-section">
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table">
            <thead>
              <tr>
                <th>字典类型</th>
                <th>编码</th>
                <th>名称</th>
                <th>字典值</th>
                <th>排序</th>
                <th>状态</th>
                <th>备注</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row: DictionaryEntry) => (
                <tr key={row.id}>
                  <td>{row.dictTypeLabel}</td>
                  <td><code className="cell-code">{row.dictCode}</code></td>
                  <td>{row.dictLabel}</td>
                  <td><code className="cell-code">{row.dictValue}</code></td>
                  <td className="cell-center">{row.sortOrder}</td>
                  <td><DictStatusBadge status={row.status} /></td>
                  <td className="cell-muted cell-remark">{row.remark || '—'}</td>
                  <td className="cell-muted">{row.updatedAt}</td>
                </tr>
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
