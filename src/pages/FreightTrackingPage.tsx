import { useMemo, useState } from 'react'
import { CreateTrackingDrawer } from '../components/CreateTrackingDrawer'
import { DelayRiskPopover } from '../components/DelayRiskPopover'
import { DocumentFilesModal } from '../components/DocumentFilesModal'
import { FreightDetailPanel } from '../components/FreightDetailPanel'
import { useLanguage, type Locale } from '../i18n/LanguageContext'
import type { CustomsStatus, FreightRecord } from '../types/freight'
import { downloadFreightRecords } from '../utils/downloadFreightRecords'

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function mapCustomsStatus(status: CustomsStatus, t: (key: string) => string) {
  switch (status) {
    case '已报关':
      return t('freight.customs.done')
    case '报关中':
      return t('freight.customs.progress')
    case '待报关':
      return t('freight.customs.pending')
    case '报关异常':
      return t('freight.customs.error')
  }
}

function LocationCell({ location }: { location: { flag: string; city: string } | null }) {
  if (!location) return <span className="empty-cell">-</span>
  return (
    <span className="location-cell">
      <span className="flag">{location.flag}</span>
      {location.city}
    </span>
  )
}

function formatTimelineDate(dateStr: string, locale: Locale, monthSuffix: string) {
  const [datePart, timePart] = dateStr.split(' ')
  const [year, month, day] = datePart.split('-')
  const label = locale === 'en'
    ? `${MONTH_NAMES_EN[Number(month) - 1]} ${Number(day)}`
    : `${Number(day)} ${Number(month)}${monthSuffix}`
  return {
    label,
    year,
    time: timePart?.slice(0, 5) ?? '',
  }
}

function customsStatusClass(status: CustomsStatus) {
  switch (status) {
    case '已报关':
      return 'customs-status-done'
    case '报关中':
      return 'customs-status-progress'
    case '待报关':
      return 'customs-status-pending'
    case '报关异常':
      return 'customs-status-error'
  }
}

interface FreightTrackingPageProps {
  data: FreightRecord[]
  showDelayRisk?: boolean
}

export function FreightTrackingPage({ data, showDelayRisk = false }: FreightTrackingPageProps) {
  const { t, locale } = useLanguage()

  const allRecords = useMemo(
    () => [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    [data],
  )

  const departureOptions = useMemo(
    () => [...new Set(allRecords.map((r) => r.departure?.city).filter(Boolean))] as string[],
    [allRecords],
  )
  const arrivalOptions = useMemo(
    () => [...new Set(allRecords.map((r) => r.arrival?.city).filter(Boolean))] as string[],
    [allRecords],
  )
  const stationOptions = useMemo(
    () => [...new Set([...departureOptions, ...arrivalOptions])],
    [departureOptions, arrivalOptions],
  )

  const [containerNo, setContainerNo] = useState('')
  const [departure, setDeparture] = useState('all')
  const [arrival, setArrival] = useState('all')
  const [dateStart, setDateStart] = useState('2025-01-01')
  const [dateEnd, setDateEnd] = useState('2026-06-05')
  const [activeId, setActiveId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filesModalRecord, setFilesModalRecord] = useState<FreightRecord | null>(null)

  const records = useMemo(() => {
    return allRecords.filter((row) => {
      if (containerNo && !row.container.toLowerCase().includes(containerNo.toLowerCase())) {
        return false
      }
      if (departure !== 'all' && row.departure?.city !== departure) {
        return false
      }
      if (arrival !== 'all' && row.arrival?.city !== arrival) {
        return false
      }
      const createdDate = row.createdAt.slice(0, 10)
      if (createdDate < dateStart || createdDate > dateEnd) {
        return false
      }
      return true
    })
  }, [allRecords, containerNo, departure, arrival, dateStart, dateEnd])

  const resolvedActiveId = activeId ?? records[0]?.id ?? null
  const activeRecord = records.find((r) => r.id === resolvedActiveId) ?? records[0]

  const selectRow = (record: FreightRecord) => {
    setActiveId(record.id)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('freight.title')}</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-field">
          <label className="filter-label" htmlFor="container-no">{t('freight.containerNo')}</label>
          <input
            id="container-no"
            type="text"
            className="filter-input"
            placeholder={t('freight.containerNoPlaceholder')}
            value={containerNo}
            onChange={(e) => setContainerNo(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label className="filter-label" htmlFor="departure">{t('freight.departure')}</label>
          <div className="filter-select">
            <select
              id="departure"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
              <option value="all">{t('common.all')}</option>
              {departureOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className="filter-field">
          <label className="filter-label" htmlFor="arrival">{t('freight.arrival')}</label>
          <div className="filter-select">
            <select
              id="arrival"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            >
              <option value="all">{t('common.all')}</option>
              {arrivalOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
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

        <button
          type="button"
          className="freight-list-download-btn"
          onClick={() => downloadFreightRecords(records)}
          disabled={records.length === 0}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('freight.downloadRecords')}
        </button>
      </div>

      <div className="content-split">
        <div className="table-section">
          <div className="table-wrapper">
            <div className="freight-timeline">
              {records.map((row, index) => {
                const { label, year, time } = formatTimelineDate(row.createdAt, locale, t('freight.monthSuffix'))
                return (
                  <div
                    key={row.id}
                    className={`timeline-item ${resolvedActiveId === row.id ? 'active' : ''}`}
                    onClick={() => selectRow(row)}
                  >
                    <div className="timeline-axis">
                      <div className="timeline-date-block">
                        <span className="timeline-date">{label}</span>
                        <span className="timeline-year">{year}</span>
                        <span className="timeline-time">{time}</span>
                      </div>
                      <div className="timeline-dot" />
                      {index < records.length - 1 && <div className="timeline-line" />}
                    </div>

                    <div className={`timeline-body${showDelayRisk && row.delayRisk ? ' has-delay-risk' : ''}`}>
                      {showDelayRisk && row.delayRisk && (
                        <DelayRiskPopover risk={row.delayRisk} />
                      )}
                      <div className="timeline-grid">
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.container')}</span>
                          <span className="timeline-value cell-container">{row.container}</span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.waybillNo')}</span>
                          <span className="timeline-value">{row.waybillNo}</span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.departure')}</span>
                          <span className="timeline-value"><LocationCell location={row.departure} /></span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.arrival')}</span>
                          <span className="timeline-value"><LocationCell location={row.arrival} /></span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.currentStation')}</span>
                          <span className="timeline-value"><LocationCell location={row.currentStation} /></span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.status')}</span>
                          <span className="timeline-value status-text">{row.status}</span>
                        </div>
                        <div className="timeline-row">
                          <span className="timeline-label">{t('freight.customsStatus')}</span>
                          <span className={`timeline-value customs-status ${customsStatusClass(row.customsStatus)}`}>
                            {mapCustomsStatus(row.customsStatus, t)}
                          </span>
                        </div>
                        <div className="timeline-row timeline-row-full">
                          <span className="timeline-label">{t('freight.attachments')}</span>
                          <span className="timeline-value timeline-files">
                            <span className="file-chip" title={row.ciplFile.name}>CIPL</span>
                            <span className="file-chip" title={row.smgsFile.name}>SMGS</span>
                            <span className="file-chip" title={row.customsFile.name}>{t('freight.customsDoc')}</span>
                            <button
                              type="button"
                              className="btn-view-files"
                              onClick={(e) => {
                                e.stopPropagation()
                                setFilesModalRecord(row)
                              }}
                            >
                              {t('freight.show')}
                            </button>
                          </span>
                        </div>
                      </div>
                      <div className="timeline-actions">
                        <button type="button" className="action-btn" aria-label={t('common.delete')} onClick={(e) => e.stopPropagation()}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="add-row">
            <button type="button" className="add-btn" aria-label={t('common.add')} onClick={() => setDrawerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {activeRecord && (
          <FreightDetailPanel record={activeRecord} />
        )}
      </div>

      <CreateTrackingDrawer
        open={drawerOpen}
        stationOptions={stationOptions}
        onClose={() => setDrawerOpen(false)}
      />

      {filesModalRecord && (
        <DocumentFilesModal
          open={Boolean(filesModalRecord)}
          container={filesModalRecord.container}
          waybillNo={filesModalRecord.waybillNo}
          smgsNo={filesModalRecord.smgsNo}
          customsStatus={filesModalRecord.customsStatus}
          ciplFile={filesModalRecord.ciplFile}
          smgsFile={filesModalRecord.smgsFile}
          customsFile={filesModalRecord.customsFile}
          onClose={() => setFilesModalRecord(null)}
        />
      )}
    </>
  )
}
