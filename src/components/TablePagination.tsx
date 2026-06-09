import { useLanguage } from '../i18n/LanguageContext'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const { t } = useLanguage()

  return (
    <div className="user-mgmt-pagination">
      <div className="pagination-left">
        <span className="pagination-label">{t('pagination.pageSize')}</span>
        <div className="pagination-size">
          <select value={pageSize} disabled aria-label={t('pagination.pageSizeAria')}>
            <option value={pageSize}>{pageSize}</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <span className="pagination-total">{t('common.totalItems', { count: totalItems })}</span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={t('pagination.prev')}
        >
          ‹
        </button>
        <span className="pagination-page-info">
          <span className="pagination-current">{currentPage}</span>
          <span className="pagination-page-separator">/</span>
          <span className="pagination-total-pages">{totalPages}</span>
        </span>
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={t('pagination.next')}
        >
          ›
        </button>
        <span className="pagination-pages-label">{t('common.totalPages', { count: totalPages })}</span>
      </div>
    </div>
  )
}
