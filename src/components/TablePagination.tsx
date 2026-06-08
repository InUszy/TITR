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
  return (
    <div className="user-mgmt-pagination">
      <div className="pagination-left">
        <span className="pagination-label">每页显示</span>
        <div className="pagination-size">
          <select value={pageSize} disabled aria-label="每页条数">
            <option value={pageSize}>{pageSize}</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <span className="pagination-total">共 {totalItems} 条</span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="上一页"
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
          aria-label="下一页"
        >
          ›
        </button>
        <span className="pagination-pages-label">共 {totalPages} 页</span>
      </div>
    </div>
  )
}
