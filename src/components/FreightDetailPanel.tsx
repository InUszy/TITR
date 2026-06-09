import { useLanguage } from '../i18n/LanguageContext'
import type { TrainRecord } from '../types/freight'
import { downloadTrackingHistory } from '../utils/downloadTrackingHistory'
import { DetailRouteMap } from './DetailRouteMap'
import { MapStationTooltip } from './MapStationTooltip'

interface FreightDetailPanelProps {
  train: TrainRecord
}

export function FreightDetailPanel({ train }: FreightDetailPanelProps) {
  const { t } = useLanguage()
  const detail = train.detail

  return (
    <div className="detail-panel">
      <div className="detail-map">
        <div className="map-bg">
          <DetailRouteMap
            mapRoute={detail.mapRoute}
            progressPercent={detail.progressPercent}
          />
        </div>

        <div className="map-top-right">
          <div className="map-legend">
            <span className="map-legend-item">
              <span className="map-legend-line passed" />
              {t('freightDetail.passed')}
            </span>
            <span className="map-legend-item">
              <span className="map-legend-line upcoming" />
              {t('freightDetail.notPassed')}
            </span>
            <span className="map-legend-item">{t('freightDetail.railStation')}</span>
            <span className="map-legend-item">{t('freightDetail.port')}</span>
          </div>

          <div className="map-zoom">
            <button type="button" aria-label={t('freightDetail.zoomIn')}>+</button>
            <button type="button" aria-label={t('freightDetail.zoomOut')}>−</button>
          </div>
        </div>

        <div className="map-container-label">
          {t('freight.trainNo')} - {train.trainNo}
        </div>

        <MapStationTooltip
          container={train.trainNo}
          stationName={detail.currentStationName}
          distanceToEnd={detail.distanceToEnd}
          stationInfo={detail.currentStationInfo}
        />
      </div>

      <div className="detail-cards">
        <div className="detail-card status-card">
          <button type="button" className="card-collapse" aria-label={t('freightDetail.fold')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className="route-summary">
            <div className="route-point">
              <span className="flag">{detail.origin.flag}</span>
              <span>{detail.origin.name}</span>
            </div>
            <div className="route-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${detail.progressPercent}%` }} />
                <span className="progress-icon progress-start">🚂</span>
                <span className="progress-icon progress-current" style={{ left: `${detail.progressPercent}%` }}>🚂</span>
                <span className="progress-icon progress-end">🏁</span>
              </div>
              <span className="progress-label">{t('freightDetail.passedKm', { km: detail.distancePassed })}</span>
            </div>
            <div className="route-point">
              <span className="flag">{detail.destination.flag}</span>
              <span>{detail.destination.name}</span>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">{t('freightDetail.currentCountry')}</span>
              <span className="status-value">
                <span className="flag">{detail.currentCountry.flag}</span>
                {detail.currentCountry.name}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">{t('freightDetail.currentStation')}</span>
              <span className="status-value">{detail.currentStationName}</span>
            </div>
            <div className="status-item">
              <span className="status-label">{t('freight.status')}</span>
              <span className="status-value status-highlight">{train.status}</span>
            </div>
            <div className="status-item">
              <span className="status-label">{t('freightDetail.wagonNo')}</span>
              <span className="status-value">{train.carriageNo}</span>
            </div>
          </div>
        </div>

        <div className="detail-card history-card">
          <button type="button" className="card-collapse card-collapse-bottom" aria-label={t('freightDetail.fold')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className="history-header">
            <h3 className="history-title">{t('freightDetail.trackHistory')}</h3>
            <button
              type="button"
              className="history-download-btn"
              onClick={() => downloadTrackingHistory(train)}
              disabled={detail.trackingHistory.length === 0}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t('common.download')}
            </button>
          </div>

          <div className="history-list">
            {detail.trackingHistory.map((event, index) => (
              <div key={index} className="history-item">
                <div className="history-icon-col">
                  <span className={`history-icon ${event.type}`}>
                    {event.type === 'arrival' ? '📍' : '▲'}
                  </span>
                  {index < detail.trackingHistory.length - 1 && <span className="history-line" />}
                </div>
                <div className="history-content">
                  <span className="history-time">{event.time}</span>
                  <span className="history-location">{event.location}</span>
                  <span className="history-status">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
