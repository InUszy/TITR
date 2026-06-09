import { useMemo, useState } from 'react'
import { TablePagination } from '../components/TablePagination'
import { useLanguage } from '../i18n/LanguageContext'
import {
  userManagementMockData,
  type AuditStatus,
  type ManagedUser,
} from '../types/userManagement'

const PAGE_SIZE = 20

function StatusBadge({ status }: { status: AuditStatus }) {
  const { t } = useLanguage()
  return (
    <span className={`audit-status audit-status-${status}`}>
      <span className="audit-status-dot" />
      {t(`users.audit.${status}`)}
    </span>
  )
}

function CompanyCell({ user }: { user: ManagedUser }) {
  const initial = user.companyName.charAt(0).toUpperCase()
  return (
    <div className="company-cell">
      <span className="company-avatar" style={{ background: user.avatarColor }}>
        {initial}
      </span>
      <span className="company-name">{user.companyName}</span>
    </div>
  )
}

export function UserManagementPage() {
  const { t } = useLanguage()
  const [companyKeyword, setCompanyKeyword] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return userManagementMockData.filter((row) => {
      if (companyKeyword && !row.companyName.toLowerCase().includes(companyKeyword.toLowerCase())) {
        return false
      }
      if (dateStart && row.createdAt && row.createdAt < dateStart) {
        return false
      }
      if (dateEnd && row.createdAt && row.createdAt > dateEnd) {
        return false
      }
      return true
    })
  }, [companyKeyword, dateStart, dateEnd])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = () => {
    setPage(1)
  }

  return (
    <>
      <div className="page-header user-mgmt-header">
        <h1 className="page-title">{t('users.title')}</h1>
      </div>

      <div className="user-mgmt-toolbar">
        <div className="user-mgmt-search">
          <input
            type="text"
            className="user-mgmt-search-input"
            placeholder={t('users.companyPlaceholder')}
            value={companyKeyword}
            onChange={(e) => setCompanyKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button type="button" className="user-mgmt-search-btn" aria-label={t('common.search')} onClick={handleSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="filter-field user-mgmt-date-filter">
          <span className="filter-label">{t('users.createdAt')}</span>
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

      <div className="user-mgmt-table-section">
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table">
            <thead>
              <tr>
                <th>ID Number</th>
                <th>{t('users.companyName')}</th>
                <th>{t('users.companyNameEn')}</th>
                <th>BIN</th>
                <th>{t('users.createdAt')}</th>
                <th>{t('users.userStatus')}</th>
                <th>{t('users.fileStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id}>
                  <td className="cell-id">{row.id}</td>
                  <td><CompanyCell user={row} /></td>
                  <td className="cell-muted">{row.companyNameEn}</td>
                  <td>{row.bin}</td>
                  <td>{row.createdAt ?? '—'}</td>
                  <td><StatusBadge status={row.userStatus} /></td>
                  <td><StatusBadge status={row.fileStatus} /></td>
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
