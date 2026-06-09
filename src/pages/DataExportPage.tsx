import { useMemo, useState } from 'react'
import { TablePagination } from '../components/TablePagination'
import { useLanguage } from '../i18n/LanguageContext'
import {
  EXPORT_COUNTRY_OPTIONS,
  EXPORT_DATA_TYPE_OPTIONS,
  EXPORT_STATUS_OPTIONS,
  TITR_PLATFORM,
  dataExportMockData,
  formatSyncDataSummary,
  loadDataExportEnabled,
  payloadFieldLabel,
  recordSortTime,
  storeDataExportEnabled,
  type DataExportRecord,
  type SyncData,
  type SyncStatus,
} from '../types/dataExport'

const PAGE_SIZE = 20

const SYNC_STATUS_KEY: Record<SyncStatus, 'success' | 'syncing' | 'failed'> = {
  success: 'success',
  pending: 'syncing',
  failed: 'failed',
}

interface DataExportPageProps {
  canControlExport?: boolean
}

function ExportMasterSwitch({
  enabled,
  canControl,
  onChange,
}: {
  enabled: boolean
  canControl: boolean
  onChange: (enabled: boolean) => void
}) {
  const { t } = useLanguage()
  return (
    <div className={`export-master-switch ${enabled ? 'enabled' : 'disabled'}`}>
      <div className="export-master-switch-info">
        <span className="export-master-switch-label">{t('dataExport.masterSwitch')}</span>
        <span className="export-master-switch-hint">
          {enabled ? t('dataExport.allowSync') : t('dataExport.pausedHint')}
        </span>
      </div>
      <button
        type="button"
        className={`export-switch ${enabled ? 'on' : 'off'}`}
        role="switch"
        aria-checked={enabled}
        aria-label={t('dataExport.masterSwitch')}
        disabled={!canControl}
        onClick={() => onChange(!enabled)}
      >
        <span className="export-switch-thumb" />
      </button>
      {!canControl && (
        <span className="export-master-switch-readonly">{t('common.readonly')}</span>
      )}
    </div>
  )
}

function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const { t } = useLanguage()
  return (
    <span className={`export-status export-status-${status}`}>
      {t(`dataExport.sync.${SYNC_STATUS_KEY[status]}`)}
    </span>
  )
}

function ForeignEntityCell({ record }: { record: DataExportRecord }) {
  return (
    <div className="export-entity-cell">
      <span className="export-entity-flag">{record.countryFlag}</span>
      <div className="export-entity-info">
        <span className="export-entity-name">{record.foreignEntity}</span>
        <span className="export-entity-en">{record.foreignEntityEn}</span>
      </div>
    </div>
  )
}

function SyncDataPreview({ data }: { data: SyncData }) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
  return (
    <div className="export-payload-card export-payload-card-inline">
      {entries.map(([key, value]) => (
        <div key={key} className="export-payload-row">
          <span className="export-payload-label">{payloadFieldLabel(key)}</span>
          <span className="export-payload-value">{value}</span>
        </div>
      ))}
    </div>
  )
}

function ExportDetailModal({
  record,
  onClose,
}: {
  record: DataExportRecord
  onClose: () => void
}) {
  const { t } = useLanguage()
  const titrSyncPayload = JSON.stringify(
    {
      platform: 'TITR',
      recordId: record.id,
      requestId: record.requestId,
      dataType: record.dataType,
      foreignEntity: record.foreignEntity,
      syncedAt: record.syncedAt,
      payload: record.syncData,
    },
    null,
    2,
  )

  return (
    <div className="file-modal-overlay" onClick={onClose}>
      <div className="export-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-modal-header">
          <div>
            <h2 className="file-modal-title">{t('dataExport.detailTitle')}</h2>
            <p className="file-modal-subtitle">
              {record.id} · {formatSyncDataSummary(record.syncData)}
            </p>
          </div>
          <button type="button" className="file-modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className="file-modal-body">
          <div className="export-detail-banner">
            <div className="export-detail-banner-main">
              <span className="export-detail-banner-platform">{TITR_PLATFORM}</span>
              <span className="export-detail-banner-time">{recordSortTime(record)}</span>
            </div>
            <SyncStatusBadge status={record.syncStatus} />
          </div>

          <div className="export-detail-summary">
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.foreignEntity')}</span>
              <ForeignEntityCell record={record} />
            </div>
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.homeCountry')}</span>
              <span>{record.countryFlag} {record.country}</span>
            </div>
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.dataType')}</span>
              <span className="export-type-badge">{record.dataType}</span>
            </div>
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.requestNo')}</span>
              <code className="export-request-id">{record.requestId}</code>
            </div>
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.requestTime')}</span>
              <span>{record.requestedAt}</span>
            </div>
            <div className="export-detail-summary-item">
              <span className="export-detail-label">{t('dataExport.syncTime')}</span>
              <span>{record.syncedAt ?? '—'}</span>
            </div>
          </div>

          <div className="export-detail-section">
            <h3 className="export-detail-section-title">{t('dataExport.syncData')}</h3>
            <SyncDataPreview data={record.syncData} />
          </div>

          <div className="export-detail-section">
            <h3 className="export-detail-section-title">{t('dataExport.requestPayload')}</h3>
            <pre className="export-request-payload">{record.requestPayload}</pre>
          </div>

          <div className="export-detail-section">
            <h3 className="export-detail-section-title">{t('dataExport.syncPayload')}</h3>
            <pre className="export-request-payload export-titr-payload">{titrSyncPayload}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DataExportPage({ canControlExport = false }: DataExportPageProps) {
  const { t } = useLanguage()
  const [exportEnabled, setExportEnabled] = useState(() => loadDataExportEnabled())
  const [keyword, setKeyword] = useState('')
  const [country, setCountry] = useState('')
  const [dataType, setDataType] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [dateStart, setDateStart] = useState('2025-06-01')
  const [dateEnd, setDateEnd] = useState('2025-06-08')
  const [page, setPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<DataExportRecord | null>(null)

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase()
    return dataExportMockData
      .filter((row) => {
        if (country && row.country !== country) return false
        if (dataType && row.dataType !== dataType) return false
        if (syncStatus && row.syncStatus !== syncStatus) return false
        const datePart = recordSortTime(row).slice(0, 10)
        if (datePart < dateStart || datePart > dateEnd) return false
        if (!lower) return true
        const dataText = Object.values(row.syncData).join(' ').toLowerCase()
        return (
          row.foreignEntity.toLowerCase().includes(lower)
          || row.foreignEntityEn.toLowerCase().includes(lower)
          || row.requestId.toLowerCase().includes(lower)
          || row.id.toLowerCase().includes(lower)
          || dataText.includes(lower)
        )
      })
      .sort((a, b) => new Date(recordSortTime(b)).getTime() - new Date(recordSortTime(a)).getTime())
  }, [keyword, country, dataType, syncStatus, dateStart, dateEnd])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = () => setPage(1)

  const handleExportToggle = (enabled: boolean) => {
    setExportEnabled(enabled)
    storeDataExportEnabled(enabled)
  }

  return (
    <>
      <div className="page-header export-page-header">
        <div className="export-page-header-main">
          <h1 className="page-title">{t('dataExport.title')}</h1>
          <p className="export-page-desc">
            {t('dataExport.desc')}
          </p>
        </div>
        <ExportMasterSwitch
          enabled={exportEnabled}
          canControl={canControlExport}
          onChange={handleExportToggle}
        />
      </div>

      {!exportEnabled && (
        <div className="export-disabled-banner">
          {t('dataExport.disabledBanner')}
        </div>
      )}

      <div className="user-mgmt-toolbar export-toolbar">
        <div className="user-mgmt-search">
          <input
            type="text"
            className="user-mgmt-search-input"
            placeholder={t('dataExport.searchPlaceholder')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button type="button" className="user-mgmt-search-btn" aria-label={t('common.search')} onClick={handleSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="export-filters">
          <div className="filter-field">
            <span className="filter-label">{t('dataExport.country')}</span>
            <select
              className="sys-filter-select"
              value={country}
              onChange={(e) => { setCountry(e.target.value); setPage(1) }}
            >
              {EXPORT_COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.value === '' ? t('dataExport.allCountries') : opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-label">{t('dataExport.dataType')}</span>
            <select
              className="sys-filter-select"
              value={dataType}
              onChange={(e) => { setDataType(e.target.value); setPage(1) }}
            >
              {EXPORT_DATA_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.value === '' ? t('dataExport.allTypes') : opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-label">{t('dataExport.syncStatus')}</span>
            <select
              className="sys-filter-select"
              value={syncStatus}
              onChange={(e) => { setSyncStatus(e.target.value); setPage(1) }}
            >
              {EXPORT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.value === ''
                    ? t('dataExport.allStatus')
                    : t(`dataExport.sync.${SYNC_STATUS_KEY[opt.value as SyncStatus]}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-label">{t('dataExport.syncTime')}</span>
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
                onChange={(e) => { setDateStart(e.target.value); setPage(1) }}
              />
              <span className="date-separator">~</span>
              <input
                type="date"
                className="date-input"
                value={dateEnd}
                onChange={(e) => { setDateEnd(e.target.value); setPage(1) }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`user-mgmt-table-section ${!exportEnabled ? 'export-table-paused' : ''}`}>
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table export-table">
            <thead>
              <tr>
                <th>{t('dataExport.syncTime')}</th>
                <th>{t('dataExport.foreignEntity')}</th>
                <th>{t('dataExport.dataType')}</th>
                <th>{t('dataExport.syncData')}</th>
                <th>{t('dataExport.syncStatus')}</th>
                <th>{t('files.action')}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id}>
                  <td className="cell-muted cell-nowrap">{recordSortTime(row)}</td>
                  <td><ForeignEntityCell record={row} /></td>
                  <td><span className="export-type-badge">{row.dataType}</span></td>
                  <td className="export-sync-summary">{formatSyncDataSummary(row.syncData)}</td>
                  <td><SyncStatusBadge status={row.syncStatus} /></td>
                  <td>
                    <button
                      type="button"
                      className="file-action-btn"
                      onClick={() => setDetailRecord(row)}
                    >
                      {t('dataExport.viewDetail')}
                    </button>
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

      {detailRecord && (
        <ExportDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
      )}
    </>
  )
}
