import {
  corridorNodes,
  corridorRoutes,
  type CorridorNode,
  type DashboardRegion,
  type NodeStatus,
} from '../types/commandDashboard'
import { useLanguage } from '../i18n/LanguageContext'

const STATUS_COLORS: Record<NodeStatus, string> = {
  normal: '#5aad4a',
  busy: '#f5a623',
  risk: '#e74c3c',
  offline: '#999',
}

interface CommandCorridorMapProps {
  region: DashboardRegion
  selectedNodeId: string | null
  onSelectNode: (node: CorridorNode | null) => void
}

export function CommandCorridorMap({ region, selectedNodeId, onSelectNode }: CommandCorridorMapProps) {
  const { t, locale } = useLanguage()
  const visibleNodes = region === 'all'
    ? corridorNodes
    : corridorNodes.filter((n) => n.region === region)

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id))

  const visibleRoutes = corridorRoutes.filter(
    (r) => visibleNodeIds.has(r.from) && visibleNodeIds.has(r.to),
  )

  return (
    <svg className="cmd-map-svg" viewBox="0 0 420 280" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cmd-node-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#5aad4a" floodOpacity="0.6" />
        </filter>
      </defs>

      <rect x="0" y="0" width="420" height="280" fill="#eef1f4" rx="8" />

      {/* 高加索陆桥 */}
      <path
        d="M 178 88 L 228 88 L 228 200 L 178 200 Z"
        fill="#e4e9ee"
        opacity="0.5"
      />

      {/* 黑海（横向，偏西北） */}
      <ellipse cx="148" cy="112" rx="30" ry="14" fill="#7ec8e3" opacity="0.85" />
      <text x="148" y="115" textAnchor="middle" fontSize="7" fill="#4a90a4" opacity="0.8">BLACK SEA</text>

      {/* 里海（纵向，居中，与黑海留出陆桥间距） */}
      <ellipse cx="248" cy="145" rx="16" ry="52" fill="#7ec8e3" opacity="0.85" />
      <text x="248" y="148" textAnchor="middle" fontSize="7" fill="#4a90a4" opacity="0.8">CASPIAN</text>

      {visibleRoutes.map((route) => (
        <path
          key={route.id}
          d={route.path}
          fill="none"
          stroke="#5aad4a"
          strokeWidth={route.type === 'sea' ? 2.5 : 2}
          strokeLinecap="round"
          strokeDasharray={route.type === 'rail' ? '4 3' : undefined}
          opacity={0.75}
        />
      ))}

      {visibleNodes.map((node) => {
        const isSelected = selectedNodeId === node.id
        const r = isSelected ? 7 : node.status === 'risk' ? 6 : 5
        return (
          <g
            key={node.id}
            className="cmd-map-node"
            onClick={(e) => {
              e.stopPropagation()
              onSelectNode(isSelected ? null : node)
            }}
            style={{ cursor: 'pointer' }}
          >
            {isSelected && (
              <circle cx={node.x} cy={node.y} r={12} fill="none" stroke="#5aad4a" strokeWidth="1.5" opacity="0.5" />
            )}
            {node.status === 'risk' && (
              <circle cx={node.x} cy={node.y} r={9} fill="#e74c3c" opacity="0.2" className="cmd-node-pulse" />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={r}
              fill={STATUS_COLORS[node.status]}
              filter={isSelected ? 'url(#cmd-node-glow)' : undefined}
            />
            <text
              x={node.x}
              y={node.y - r - 4}
              textAnchor="middle"
              fontSize="7"
              fill="#333"
              fontWeight={isSelected ? '600' : '400'}
            >
              {locale === 'en' ? node.nameEn : node.name}
            </text>
          </g>
        )
      })}

      <g transform="translate(8, 8)">
        <rect width="108" height="52" rx="4" fill="rgba(255,255,255,0.92)" stroke="#ddd" />
        <text x="8" y="14" fontSize="7" fontWeight="600" fill="#333">{t('command.mapLegend.title')}</text>
        <line x1="8" y1="22" x2="28" y2="22" stroke="#5aad4a" strokeWidth="2" strokeDasharray="4 3" />
        <text x="32" y="25" fontSize="6.5" fill="#666">{t('command.mapLegend.rail')}</text>
        <line x1="8" y1="34" x2="28" y2="34" stroke="#5aad4a" strokeWidth="2.5" />
        <text x="32" y="37" fontSize="6.5" fill="#666">{t('command.mapLegend.sea')}</text>
        <circle cx="14" cy="44" r="3" fill="#e74c3c" />
        <text x="32" y="47" fontSize="6.5" fill="#666">{t('command.mapLegend.riskNode')}</text>
      </g>
    </svg>
  )
}

export function NodeStatusDot({ status }: { status: NodeStatus }) {
  const { t } = useLanguage()
  return (
    <span
      className="cmd-status-dot"
      style={{ background: STATUS_COLORS[status] }}
      title={t(`command.nodeStatusLabel.${status}`)}
    />
  )
}
