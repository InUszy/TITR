import type { CongestionLevel, CurrentStationInfo } from '../types/freight'

interface MapStationTooltipProps {
  container: string
  stationName: string
  distanceToEnd: number
  stationInfo: CurrentStationInfo
}

function congestionClass(status: CongestionLevel) {
  switch (status) {
    case '畅通':
      return 'congestion-smooth'
    case '轻度拥堵':
      return 'congestion-light'
    case '中度拥堵':
      return 'congestion-medium'
    case '严重拥堵':
      return 'congestion-heavy'
  }
}

export function MapStationTooltip({ container, stationName, distanceToEnd, stationInfo }: MapStationTooltipProps) {
  const isRailway = stationInfo.type === 'railway'

  return (
    <div className="map-tooltip">
      <div className="map-tooltip-header">
        <span className={`map-tooltip-type ${isRailway ? 'type-railway' : 'type-port'}`}>
          {isRailway ? '🚂 铁路场站' : '⚓ 港口'}
        </span>
        <strong>{stationName}</strong>
      </div>

      <div className="map-tooltip-row">
        <span className="map-tooltip-label">距离终点站</span>
        <span className="map-tooltip-value">{distanceToEnd} 千米</span>
      </div>

      <div className="map-tooltip-divider" />

      <div className="map-tooltip-row">
        <span className="map-tooltip-label">{isRailway ? '车站拥堵状态' : '港口拥堵状态'}</span>
        <span className={`map-tooltip-badge ${congestionClass(stationInfo.congestionStatus)}`}>
          {stationInfo.congestionStatus}
        </span>
      </div>

      <div className="map-tooltip-row">
        <span className="map-tooltip-label">待作业集装箱</span>
        <span className="map-tooltip-value">{stationInfo.pendingContainers} 箱</span>
      </div>

      {isRailway ? (
        <>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">平均等待时长</span>
            <span className="map-tooltip-value">{stationInfo.avgWaitHours} 小时</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">可用作业线</span>
            <span className="map-tooltip-value">{stationInfo.availableTracks} 条</span>
          </div>
        </>
      ) : (
        <>
          <div className="map-tooltip-section-title">集装箱作业状态</div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">集装箱号</span>
            <span className="map-tooltip-value map-tooltip-mono">{container}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">装卸状态</span>
            <span className="map-tooltip-value map-tooltip-live">{stationInfo.containerOps.loadUnloadStatus}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">堆存状态</span>
            <span className="map-tooltip-value map-tooltip-live">{stationInfo.containerOps.storageStatus}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">堆场位置</span>
            <span className="map-tooltip-value">{stationInfo.containerOps.yardLocation}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">堆存天数</span>
            <span className="map-tooltip-value">{stationInfo.containerOps.storageDays} 天</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">作业泊位</span>
            <span className="map-tooltip-value">{stationInfo.containerOps.berth}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">更新时间</span>
            <span className="map-tooltip-value map-tooltip-muted">{stationInfo.containerOps.updatedAt}</span>
          </div>

          <div className="map-tooltip-divider" />
          <div className="map-tooltip-section-title">海域气象</div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">天气状况</span>
            <span className="map-tooltip-value">{stationInfo.weather.condition}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">风向风力</span>
            <span className="map-tooltip-value">{stationInfo.weather.wind}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">浪高</span>
            <span className="map-tooltip-value">{stationInfo.weather.waveHeight}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">能见度</span>
            <span className="map-tooltip-value">{stationInfo.weather.visibility}</span>
          </div>
          <div className="map-tooltip-row">
            <span className="map-tooltip-label">气温</span>
            <span className="map-tooltip-value">{stationInfo.weather.temperature}</span>
          </div>
        </>
      )}
    </div>
  )
}
