import type { MapRoute, MapRouteWaypoint } from '../types/freight'

const ROUTE_PATH = 'M 40 220 Q 80 180 120 200 T 200 120 T 280 80 T 360 40'

const MAP_POSITIONS = [
  { x: 40, y: 220 },
  { x: 120, y: 200 },
  { x: 200, y: 120 },
  { x: 280, y: 80 },
  { x: 360, y: 40 },
]

interface DetailRouteMapProps {
  mapRoute: MapRoute
  progressPercent: number
}

function StationIcon({ type, size }: { type: MapRouteWaypoint['type']; size: number }) {
  const fontSize = size * 0.85
  return (
    <text y={fontSize * 0.35} textAnchor="middle" fontSize={fontSize}>
      {type === 'railway' ? '🚂' : '⚓'}
    </text>
  )
}

export function DetailRouteMap({ mapRoute, progressPercent }: DetailRouteMapProps) {
  const { waypoints, currentIndex } = mapRoute

  return (
    <svg className="map-route" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="map-marker-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#5aad4a" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* 未经过路段 */}
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="#c5cdd3"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />

      {/* 已经过路段 */}
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="#5aad4a"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
      />

      {waypoints.map((waypoint, index) => {
        const pos = MAP_POSITIONS[index]
        if (!pos) return null

        const isPassed = index < currentIndex
        const isCurrent = index === currentIndex
        const isUpcoming = index > currentIndex
        const radius = isCurrent ? 13 : 7

        return (
          <g key={`${waypoint.label}-${index}`} className="map-waypoint">
            {isCurrent && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={18}
                fill="none"
                stroke="#5aad4a"
                strokeWidth="2"
                opacity="0.35"
                className="map-waypoint-pulse"
              />
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={radius}
              fill={isPassed || isCurrent ? '#5aad4a' : '#fff'}
              stroke={isUpcoming ? '#c5cdd3' : '#5aad4a'}
              strokeWidth={isCurrent ? 2.5 : 2}
              filter={isCurrent ? 'url(#map-marker-glow)' : undefined}
            />
            <g transform={`translate(${pos.x}, ${pos.y})`}>
              <StationIcon type={waypoint.type} size={isCurrent ? 14 : 10} />
            </g>
            <title>{waypoint.label}</title>
          </g>
        )
      })}
    </svg>
  )
}
