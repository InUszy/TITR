export type NodeStatus = 'normal' | 'busy' | 'risk' | 'offline'
export type NodeType = 'railway' | 'port' | 'border'
export type RiskLevel = 'high' | 'medium' | 'low'
export type DashboardRegion = 'all' | 'china' | 'centralAsia' | 'caspian' | 'europe'

export interface CorridorNode {
  id: string
  name: string
  nameEn: string
  region: Exclude<DashboardRegion, 'all'>
  regionLabel: string
  type: NodeType
  x: number
  y: number
  status: NodeStatus
  containers: number
  pendingOps: number
  congestion: string
  avgWaitHours: number
  throughputToday: number
  remark: string
}

export interface CorridorRoute {
  id: string
  from: string
  to: string
  type: 'rail' | 'sea'
  path: string
  activeCount: number
}

export interface RiskAlert {
  id: string
  level: RiskLevel
  nodeId: string
  nodeName: string
  title: string
  message: string
  time: string
}

export interface ActiveTrajectory {
  id: string
  containerNo: string
  waybillNo: string
  currentNodeId: string
  routeNodeIds: string[]
  progress: number
  riskLevel: RiskLevel | 'none'
  updatedAt: string
}

export const REGION_OPTIONS: { value: DashboardRegion; label: string }[] = [
  { value: 'all', label: '全局' },
  { value: 'china', label: '中国段' },
  { value: 'centralAsia', label: '中亚段' },
  { value: 'caspian', label: '里海段' },
  { value: 'europe', label: '欧洲段' },
]

export const corridorNodes: CorridorNode[] = [
  // 中国段（东侧）— 东部城市更靠右
  { id: 'lianyungang', name: '连云港', nameEn: 'Lianyungang', region: 'china', regionLabel: '中国段', type: 'port', x: 402, y: 138, status: 'normal', containers: 124, pendingOps: 22, congestion: '畅通', avgWaitHours: 2.8, throughputToday: 198, remark: '海铁联运出海口' },
  { id: 'beijing', name: '北京', nameEn: 'Beijing', region: 'china', regionLabel: '中国段', type: 'railway', x: 385, y: 82, status: 'normal', containers: 86, pendingOps: 12, congestion: '畅通', avgWaitHours: 2.1, throughputToday: 142, remark: '华北集结枢纽' },
  { id: 'xian', name: '西安', nameEn: "Xi'an", region: 'china', regionLabel: '中国段', type: 'railway', x: 368, y: 172, status: 'busy', containers: 214, pendingOps: 38, congestion: '轻度拥堵', avgWaitHours: 4.5, throughputToday: 328, remark: '中欧班列主要始发站' },
  { id: 'urumqi', name: '乌鲁木齐', nameEn: 'Urumqi', region: 'china', regionLabel: '中国段', type: 'railway', x: 350, y: 108, status: 'normal', containers: 96, pendingOps: 15, congestion: '畅通', avgWaitHours: 3.2, throughputToday: 156, remark: '西向通道集结中心' },
  // 中亚段 — 阿斯塔纳偏北，阿腾科里偏南
  { id: 'alashankou', name: '阿拉山口', nameEn: 'Alashankou', region: 'centralAsia', regionLabel: '中亚段', type: 'border', x: 322, y: 132, status: 'normal', containers: 78, pendingOps: 14, congestion: '轻度拥堵', avgWaitHours: 4.1, throughputToday: 112, remark: '新疆西向铁路口岸' },
  { id: 'khorgos', name: '霍尔果斯', nameEn: 'Khorgos', region: 'centralAsia', regionLabel: '中亚段', type: 'border', x: 332, y: 158, status: 'busy', containers: 186, pendingOps: 42, congestion: '中度拥堵', avgWaitHours: 6.2, throughputToday: 276, remark: '中哈边境口岸' },
  { id: 'astana', name: '阿斯塔纳', nameEn: 'Astana', region: 'centralAsia', regionLabel: '中亚段', type: 'railway', x: 298, y: 50, status: 'normal', containers: 102, pendingOps: 18, congestion: '畅通', avgWaitHours: 3.5, throughputToday: 164, remark: '哈萨克斯坦铁路枢纽' },
  { id: 'altynkol', name: '阿腾科里', nameEn: 'Altynkol', region: 'centralAsia', regionLabel: '中亚段', type: 'railway', x: 306, y: 192, status: 'busy', containers: 156, pendingOps: 36, congestion: '中度拥堵', avgWaitHours: 5.8, throughputToday: 224, remark: '宽准轨换装站' },
  // 里海段 — 阿克套在东岸，巴库在西岸
  { id: 'aktau', name: '阿克套', nameEn: 'Aktau', region: 'caspian', regionLabel: '里海段', type: 'port', x: 270, y: 112, status: 'normal', containers: 88, pendingOps: 16, congestion: '畅通', avgWaitHours: 3.0, throughputToday: 98, remark: '里海东岸港口枢纽' },
  { id: 'baku', name: '巴库', nameEn: 'Baku', region: 'caspian', regionLabel: '里海段', type: 'port', x: 214, y: 162, status: 'normal', containers: 112, pendingOps: 20, congestion: '轻度拥堵', avgWaitHours: 4.2, throughputToday: 136, remark: '跨里海运输节点' },
  { id: 'tbilisi', name: '第比利斯', nameEn: 'Tbilisi', region: 'caspian', regionLabel: '里海段', type: 'railway', x: 192, y: 136, status: 'normal', containers: 64, pendingOps: 10, congestion: '畅通', avgWaitHours: 2.6, throughputToday: 88, remark: '高加索陆港' },
  { id: 'poti', name: '波季', nameEn: 'Poti', region: 'caspian', regionLabel: '里海段', type: 'port', x: 168, y: 102, status: 'risk', containers: 94, pendingOps: 28, congestion: '严重拥堵', avgWaitHours: 8.5, throughputToday: 72, remark: '黑海东岸港口，当前作业延迟' },
  // 欧洲段 — 卡尔斯在黑海南下方，伊斯坦布尔偏西
  { id: 'kars', name: '卡尔斯', nameEn: 'Kars', region: 'europe', regionLabel: '欧洲段', type: 'border', x: 162, y: 208, status: 'normal', containers: 58, pendingOps: 9, congestion: '畅通', avgWaitHours: 2.2, throughputToday: 74, remark: '土耳其边境站' },
  { id: 'istanbul', name: '伊斯坦布尔', nameEn: 'Istanbul', region: 'europe', regionLabel: '欧洲段', type: 'railway', x: 88, y: 150, status: 'normal', containers: 72, pendingOps: 11, congestion: '畅通', avgWaitHours: 2.4, throughputToday: 96, remark: '欧亚交汇枢纽' },
  { id: 'budapest', name: '布达佩斯', nameEn: 'Budapest', region: 'europe', regionLabel: '欧洲段', type: 'railway', x: 68, y: 98, status: 'normal', containers: 48, pendingOps: 7, congestion: '畅通', avgWaitHours: 1.8, throughputToday: 62, remark: '中东欧分拨中心' },
  { id: 'warsaw', name: '华沙', nameEn: 'Warsaw', region: 'europe', regionLabel: '欧洲段', type: 'railway', x: 42, y: 85, status: 'normal', containers: 52, pendingOps: 8, congestion: '畅通', avgWaitHours: 1.6, throughputToday: 68, remark: '欧洲内陆枢纽' },
  { id: 'duisburg', name: '杜伊斯堡', nameEn: 'Duisburg', region: 'europe', regionLabel: '欧洲段', type: 'railway', x: 22, y: 80, status: 'busy', containers: 118, pendingOps: 24, congestion: '轻度拥堵', avgWaitHours: 3.8, throughputToday: 142, remark: '欧洲终点枢纽' },
]

export const corridorRoutes: CorridorRoute[] = [
  { id: 'r1', from: 'xian', to: 'khorgos', type: 'rail', path: 'M 368 172 L 332 158', activeCount: 42 },
  { id: 'r2', from: 'urumqi', to: 'alashankou', type: 'rail', path: 'M 350 108 L 322 132', activeCount: 18 },
  { id: 'r3', from: 'khorgos', to: 'altynkol', type: 'rail', path: 'M 332 158 L 306 192', activeCount: 36 },
  { id: 'r4', from: 'altynkol', to: 'aktau', type: 'rail', path: 'M 306 192 Q 290 155 270 112', activeCount: 22 },
  { id: 'r5', from: 'aktau', to: 'baku', type: 'sea', path: 'M 270 112 Q 248 138 214 162', activeCount: 16 },
  { id: 'r6', from: 'baku', to: 'tbilisi', type: 'rail', path: 'M 214 162 L 192 136', activeCount: 14 },
  { id: 'r7', from: 'tbilisi', to: 'poti', type: 'rail', path: 'M 192 136 L 168 102', activeCount: 12 },
  { id: 'r8', from: 'tbilisi', to: 'kars', type: 'rail', path: 'M 192 136 L 162 208', activeCount: 10 },
  { id: 'r9', from: 'kars', to: 'istanbul', type: 'rail', path: 'M 162 208 Q 125 185 88 150', activeCount: 8 },
  { id: 'r10', from: 'poti', to: 'istanbul', type: 'sea', path: 'M 168 102 Q 128 125 88 150', activeCount: 6 },
  { id: 'r11', from: 'istanbul', to: 'budapest', type: 'rail', path: 'M 88 150 Q 78 125 68 98', activeCount: 14 },
  { id: 'r12', from: 'budapest', to: 'warsaw', type: 'rail', path: 'M 68 98 L 42 85', activeCount: 11 },
  { id: 'r13', from: 'warsaw', to: 'duisburg', type: 'rail', path: 'M 42 85 L 22 80', activeCount: 16 },
  { id: 'r14', from: 'beijing', to: 'xian', type: 'rail', path: 'M 385 82 L 368 172', activeCount: 24 },
  { id: 'r15', from: 'lianyungang', to: 'xian', type: 'rail', path: 'M 402 138 L 368 172', activeCount: 20 },
  { id: 'r16', from: 'astana', to: 'aktau', type: 'rail', path: 'M 298 50 L 270 112', activeCount: 15 },
  { id: 'r17', from: 'alashankou', to: 'khorgos', type: 'rail', path: 'M 322 132 L 332 158', activeCount: 12 },
]

export const riskAlerts: RiskAlert[] = [
  { id: 'R1', level: 'high', nodeId: 'poti', nodeName: '波季', title: '港口严重拥堵', message: '波季港待作业箱量积压，预计平均等待时长超过 8 小时', time: '2026-06-08 14:20' },
  { id: 'R2', level: 'medium', nodeId: 'khorgos', nodeName: '霍尔果斯', title: '口岸通关延迟', message: '海关查验比例上升，出境集装箱平均等待 6.2 小时', time: '2026-06-08 13:05' },
  { id: 'R3', level: 'medium', nodeId: 'altynkol', nodeName: '阿腾科里', title: '换装作业紧张', message: '宽准轨换装线利用率 92%，部分班列排队', time: '2026-06-08 11:40' },
  { id: 'R4', level: 'low', nodeId: 'xian', nodeName: '西安', title: '发运高峰', message: '今日计划发运 42 列，场站作业负荷偏高', time: '2026-06-08 09:15' },
  { id: 'R5', level: 'low', nodeId: 'duisburg', nodeName: '杜伊斯堡', title: '到站箱量增多', message: '欧洲端堆场利用率 78%，建议加快提箱', time: '2026-06-08 08:30' },
]

export const activeTrajectories: ActiveTrajectory[] = [
  { id: 'T1', containerNo: 'CICU1018860', waybillNo: 'WB-2026-050801', currentNodeId: 'altynkol', routeNodeIds: ['xian', 'khorgos', 'altynkol', 'aktau', 'baku', 'poti', 'duisburg'], progress: 38, riskLevel: 'none', updatedAt: '2026-06-08 14:28' },
  { id: 'T2', containerNo: 'CICU1018867', waybillNo: 'WB-2026-050902', currentNodeId: 'khorgos', routeNodeIds: ['xian', 'khorgos', 'altynkol', 'baku', 'istanbul', 'budapest'], progress: 22, riskLevel: 'low', updatedAt: '2026-06-08 14:15' },
  { id: 'T3', containerNo: 'MSCU9876543', waybillNo: 'WB-2026-052501', currentNodeId: 'baku', routeNodeIds: ['lianyungang', 'xian', 'khorgos', 'aktau', 'baku', 'poti', 'warsaw'], progress: 56, riskLevel: 'none', updatedAt: '2026-06-08 13:52' },
  { id: 'T4', containerNo: 'TCLU8899001', waybillNo: 'WB-2026-042801', currentNodeId: 'poti', routeNodeIds: ['xian', 'khorgos', 'altynkol', 'baku', 'poti', 'tbilisi', 'duisburg'], progress: 62, riskLevel: 'high', updatedAt: '2026-06-08 13:40' },
  { id: 'T5', containerNo: 'TBJU1234567', waybillNo: 'WB-2026-051201', currentNodeId: 'xian', routeNodeIds: ['xian', 'khorgos', 'astana', 'altynkol'], progress: 8, riskLevel: 'none', updatedAt: '2026-06-08 12:18' },
  { id: 'T6', containerNo: 'HLXU3344556', waybillNo: 'WB-2026-038901', currentNodeId: 'kars', routeNodeIds: ['urumqi', 'khorgos', 'baku', 'poti', 'kars', 'istanbul', 'budapest'], progress: 71, riskLevel: 'medium', updatedAt: '2026-06-08 11:55' },
]

export function getNodeById(id: string) {
  return corridorNodes.find((n) => n.id === id)
}

export function nodeStatusLabel(status: NodeStatus) {
  switch (status) {
    case 'normal': return '正常'
    case 'busy': return '繁忙'
    case 'risk': return '风险'
    case 'offline': return '离线'
  }
}

export function riskLevelLabel(level: RiskLevel | 'none') {
  switch (level) {
    case 'high': return '高'
    case 'medium': return '中'
    case 'low': return '低'
    case 'none': return '无'
  }
}

export function globalStats(region: DashboardRegion) {
  const nodes = region === 'all'
    ? corridorNodes
    : corridorNodes.filter((n) => n.region === region)
  const nodeIds = new Set(nodes.map((n) => n.id))
  const trajectories = activeTrajectories.filter((t) =>
    region === 'all' || nodeIds.has(t.currentNodeId) || t.routeNodeIds.some((id) => nodeIds.has(id)),
  )
  const risks = riskAlerts.filter((r) => region === 'all' || nodeIds.has(r.nodeId))

  return {
    inTransit: trajectories.length,
    activeNodes: nodes.filter((n) => n.status !== 'offline').length,
    totalContainers: nodes.reduce((sum, n) => sum + n.containers, 0),
    riskCount: risks.length,
    highRiskCount: risks.filter((r) => r.level === 'high').length,
  }
}
