import { useMemo, useState } from 'react'
import { TablePagination } from '../components/TablePagination'
import {
  BLOCKCHAIN_STATUS_OPTIONS,
  FILE_CATEGORY_OPTIONS,
  blockchainStatusLabel,
  formatFileSize,
  systemFileRecords,
  truncateHash,
  type BlockchainRecord,
  type BlockchainStatus,
  type SystemFileRecord,
} from '../types/fileManagement'

const PAGE_SIZE = 20

function FileTypeBadge({ record }: { record: SystemFileRecord }) {
  return (
    <span className={`file-type-badge file-type-${record.category}`}>
      {record.categoryLabel}
    </span>
  )
}

function BlockchainStatusBadge({ status }: { status: BlockchainStatus }) {
  if (status === 'none') {
    return <span className="chain-status chain-status-none">—</span>
  }
  return (
    <span className={`chain-status chain-status-${status}`}>
      {blockchainStatusLabel(status)}
    </span>
  )
}

function FilePreviewCell({ record }: { record: SystemFileRecord }) {
  if (record.category === 'avatar') {
    return (
      <div className="file-preview-cell">
        <span
          className="file-avatar-preview"
          style={{ background: record.avatarColor ?? '#5aad4a' }}
        >
          {record.avatarInitial ?? '?'}
        </span>
        <span className="file-name-text" title={record.name}>{record.name}</span>
      </div>
    )
  }

  const icon = record.category === 'company_qualification' ? '🏢'
    : record.category === 'cipl' ? '📄'
      : record.category === 'smgs' ? '📋'
        : record.category === 'customs' ? '🛃'
          : '📎'

  return (
    <div className="file-preview-cell">
      <span className="file-doc-icon">{icon}</span>
      <span className="file-name-text" title={record.name}>{record.name}</span>
    </div>
  )
}

function BlockchainDetailModal({
  file,
  onClose,
}: {
  file: SystemFileRecord
  onClose: () => void
}) {
  const chain = file.blockchain as BlockchainRecord

  return (
    <div className="file-modal-overlay" onClick={onClose}>
      <div className="file-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-modal-header">
          <div>
            <h2 className="file-modal-title">区块链存证信息</h2>
            <p className="file-modal-subtitle">{file.name}</p>
          </div>
          <button type="button" className="file-modal-close" onClick={onClose} aria-label="关闭">
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
            <BlockchainStatusBadge status={file.blockchainStatus} />
          </div>

          <dl className="chain-info-grid">
            <div className="chain-info-item">
              <dt>交易哈希</dt>
              <dd><code title={chain.txHash}>{chain.txHash}</code></dd>
            </div>
            <div className="chain-info-item">
              <dt>数据哈希</dt>
              <dd><code title={chain.dataHash}>{chain.dataHash}</code></dd>
            </div>
            <div className="chain-info-item">
              <dt>区块高度</dt>
              <dd>{chain.blockHeight.toLocaleString()}</dd>
            </div>
            <div className="chain-info-item">
              <dt>区块时间</dt>
              <dd>{chain.blockTime}</dd>
            </div>
            <div className="chain-info-item">
              <dt>存证时间</dt>
              <dd>{chain.notarizedAt}</dd>
            </div>
            <div className="chain-info-item">
              <dt>确认数</dt>
              <dd>{chain.confirmations}</dd>
            </div>
            <div className="chain-info-item chain-info-item-full">
              <dt>智能合约地址</dt>
              <dd><code title={chain.contractAddress}>{chain.contractAddress}</code></dd>
            </div>
            <div className="chain-info-item chain-info-item-full">
              <dt>存证节点</dt>
              <dd>{chain.verifier}</dd>
            </div>
          </dl>

          <div className="chain-verify-note">
            文件哈希已上链存证，可通过交易哈希在 DTC 区块链浏览器中核验文件完整性与存证时间。
          </div>
        </div>
      </div>
    </div>
  )
}

export function FileManagementPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [chainStatus, setChainStatus] = useState('')
  const [page, setPage] = useState(1)
  const [detailFile, setDetailFile] = useState<SystemFileRecord | null>(null)
  const [notifyingId, setNotifyingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase()
    return systemFileRecords.filter((row) => {
      if (category && row.category !== category) return false
      if (chainStatus && row.blockchainStatus !== chainStatus) return false
      if (!lower) return true
      return (
        row.name.toLowerCase().includes(lower)
        || row.ownerName.toLowerCase().includes(lower)
        || row.relatedContainer?.toLowerCase().includes(lower)
        || row.relatedWaybill?.toLowerCase().includes(lower)
      )
    })
  }, [keyword, category, chainStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = () => setPage(1)

  const handleNotarize = (file: SystemFileRecord) => {
    setNotifyingId(file.id)
    window.setTimeout(() => setNotifyingId(null), 2000)
  }

  return (
    <>
      <div className="page-header user-mgmt-header">
        <h1 className="page-title">文件管理</h1>
      </div>

      <div className="user-mgmt-toolbar file-mgmt-toolbar">
        <div className="user-mgmt-search">
          <input
            type="text"
            className="user-mgmt-search-input"
            placeholder="搜索文件名、所属主体、集装箱号或运单号"
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

        <div className="file-mgmt-filters">
          <div className="filter-field">
            <span className="filter-label">文件类型</span>
            <select
              className="sys-filter-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
            >
              {FILE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-label">存证状态</span>
            <select
              className="sys-filter-select"
              value={chainStatus}
              onChange={(e) => {
                setChainStatus(e.target.value)
                setPage(1)
              }}
            >
              {BLOCKCHAIN_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <span className="file-mgmt-count">共 {filtered.length} 个文件</span>
        </div>
      </div>

      <div className="user-mgmt-table-section">
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table file-mgmt-table">
            <thead>
              <tr>
                <th>文件</th>
                <th>类型</th>
                <th>所属主体</th>
                <th>关联信息</th>
                <th>大小</th>
                <th>上传时间</th>
                <th>区块链存证</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id}>
                  <td><FilePreviewCell record={row} /></td>
                  <td><FileTypeBadge record={row} /></td>
                  <td>{row.ownerName}</td>
                  <td className="cell-muted">
                    {row.relatedContainer ? (
                      <div className="file-related-info">
                        <span>集装箱：{row.relatedContainer}</span>
                        {row.relatedWaybill && <span>运单：{row.relatedWaybill}</span>}
                      </div>
                    ) : '—'}
                  </td>
                  <td className="cell-muted">{formatFileSize(row.size)}</td>
                  <td className="cell-muted cell-nowrap">{row.uploadedAt}</td>
                  <td>
                    {row.blockchainRequired ? (
                      <div className="chain-cell">
                        <BlockchainStatusBadge status={row.blockchainStatus} />
                        {row.blockchain && (
                          <span className="chain-hash" title={row.blockchain.txHash}>
                            {truncateHash(row.blockchain.txHash)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="cell-muted">不适用</span>
                    )}
                  </td>
                  <td>
                    <div className="file-action-group">
                      {row.blockchainRequired && row.blockchainStatus === 'notarized' && (
                        <button
                          type="button"
                          className="file-action-btn"
                          onClick={() => setDetailFile(row)}
                        >
                          链上信息
                        </button>
                      )}
                      {row.blockchainRequired && row.blockchainStatus === 'pending' && (
                        <button
                          type="button"
                          className="file-action-btn"
                          onClick={() => setDetailFile(row)}
                        >
                          查看进度
                        </button>
                      )}
                      {row.blockchainRequired && row.blockchainStatus === 'none' && (
                        <button
                          type="button"
                          className="file-action-btn file-action-primary"
                          disabled={notifyingId === row.id}
                          onClick={() => handleNotarize(row)}
                        >
                          {notifyingId === row.id ? '存证中...' : '发起存证'}
                        </button>
                      )}
                    </div>
                  </td>
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

      {detailFile?.blockchain && (
        <BlockchainDetailModal file={detailFile} onClose={() => setDetailFile(null)} />
      )}
    </>
  )
}
