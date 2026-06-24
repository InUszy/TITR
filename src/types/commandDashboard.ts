import type { CorridorCountryId } from './corridorCountries'

export type NodeStatus = 'normal' | 'busy' | 'risk' | 'offline'
export type NodeType = 'railway' | 'port' | 'border'
export type RiskLevel = 'high' | 'medium' | 'low'
export type DashboardRegion = 'all' | 'china' | 'centralAsia' | 'caspian' | 'europe'

export interface CorridorNode {
  id: string
  name: string
  nameEn: string
  country: CorridorCountryId
  region: Exclude<DashboardRegion, 'all'>
  regionLabel: string
  type: NodeType
  lat: number
  lng: number
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

export interface TrajectoryContainer {
  containerNo: string
  waybillNo: string
}

export interface ActiveTrajectory {
  id: string
  trainNo: string
  containers: TrajectoryContainer[]
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
  { id: 'lianyungang', name: '连云港', nameEn: 'Lianyungang', country: 'china', region: 'china', regionLabel: '中国段', type: 'port', lat: 34.596, lng: 119.221, status: 'normal', containers: 124, pendingOps: 22, congestion: '畅通', avgWaitHours: 2.8, throughputToday: 198, remark: '海铁联运出海口' },
  { id: 'beijing', name: '北京', nameEn: 'Beijing', country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 39.904, lng: 116.407, status: 'normal', containers: 86, pendingOps: 12, congestion: '畅通', avgWaitHours: 2.1, throughputToday: 142, remark: '华北集结枢纽' },
  { id: 'xian', name: '西安', nameEn: "Xi'an", country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 34.341, lng: 108.940, status: 'busy', containers: 214, pendingOps: 38, congestion: '轻度拥堵', avgWaitHours: 4.5, throughputToday: 328, remark: '中欧班列主要始发站' },
  { id: 'zhengzhou', name: '郑州', nameEn: 'Zhengzhou', country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 34.747, lng: 113.625, status: 'busy', containers: 178, pendingOps: 32, congestion: '轻度拥堵', avgWaitHours: 3.9, throughputToday: 286, remark: '中部铁路枢纽，中欧班列集结中心' },
  { id: 'nanjing', name: '南京', nameEn: 'Nanjing', country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 32.060, lng: 118.797, status: 'normal', containers: 92, pendingOps: 14, congestion: '畅通', avgWaitHours: 2.5, throughputToday: 148, remark: '华东重要铁路口岸城市' },
  { id: 'chengdu', name: '成都', nameEn: 'Chengdu', country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 30.573, lng: 104.067, status: 'normal', containers: 118, pendingOps: 20, congestion: '畅通', avgWaitHours: 3.1, throughputToday: 172, remark: '西南班列始发枢纽' },
  { id: 'urumqi', name: '乌鲁木齐', nameEn: 'Urumqi', country: 'china', region: 'china', regionLabel: '中国段', type: 'railway', lat: 43.826, lng: 87.617, status: 'normal', containers: 96, pendingOps: 15, congestion: '畅通', avgWaitHours: 3.2, throughputToday: 156, remark: '西向通道集结中心' },
  { id: 'alashankou', name: '阿拉山口', nameEn: 'Alashankou', country: 'kazakhstan', region: 'centralAsia', regionLabel: '中亚段', type: 'border', lat: 45.172, lng: 82.575, status: 'normal', containers: 78, pendingOps: 14, congestion: '轻度拥堵', avgWaitHours: 4.1, throughputToday: 112, remark: '新疆西向铁路口岸' },
  { id: 'khorgos', name: '霍尔果斯', nameEn: 'Khorgos', country: 'kazakhstan', region: 'centralAsia', regionLabel: '中亚段', type: 'border', lat: 44.213, lng: 80.414, status: 'busy', containers: 186, pendingOps: 42, congestion: '中度拥堵', avgWaitHours: 6.2, throughputToday: 276, remark: '中哈边境口岸' },
  { id: 'astana', name: '阿斯塔纳', nameEn: 'Astana', country: 'kazakhstan', region: 'centralAsia', regionLabel: '中亚段', type: 'railway', lat: 51.169, lng: 71.449, status: 'normal', containers: 102, pendingOps: 18, congestion: '畅通', avgWaitHours: 3.5, throughputToday: 164, remark: '哈萨克斯坦铁路枢纽' },
  { id: 'almaty', name: '阿拉木图', nameEn: 'Almaty', country: 'kazakhstan', region: 'centralAsia', regionLabel: '中亚段', type: 'railway', lat: 43.238, lng: 76.946, status: 'normal', containers: 134, pendingOps: 22, congestion: '轻度拥堵', avgWaitHours: 3.8, throughputToday: 198, remark: '哈萨克斯坦最大铁路枢纽' },
  { id: 'altynkol', name: '阿腾科里', nameEn: 'Altynkol', country: 'kazakhstan', region: 'centralAsia', regionLabel: '中亚段', type: 'railway', lat: 44.165, lng: 80.295, status: 'busy', containers: 156, pendingOps: 36, congestion: '中度拥堵', avgWaitHours: 5.8, throughputToday: 224, remark: '宽准轨换装站' },
  { id: 'aktau', name: '阿克套港', nameEn: 'Aktau Port', country: 'kazakhstan', region: 'caspian', regionLabel: '里海段', type: 'port', lat: 43.650, lng: 51.158, status: 'normal', containers: 88, pendingOps: 16, congestion: '畅通', avgWaitHours: 3.0, throughputToday: 98, remark: '里海东岸港口枢纽' },
  { id: 'baku', name: '巴库港', nameEn: 'Baku Port', country: 'azerbaijan', region: 'caspian', regionLabel: '里海段', type: 'port', lat: 40.409, lng: 49.867, status: 'normal', containers: 112, pendingOps: 20, congestion: '轻度拥堵', avgWaitHours: 4.2, throughputToday: 136, remark: '跨里海运输节点' },
  { id: 'tbilisi', name: '第比利斯', nameEn: 'Tbilisi', country: 'georgia', region: 'caspian', regionLabel: '里海段', type: 'railway', lat: 41.715, lng: 44.827, status: 'normal', containers: 64, pendingOps: 10, congestion: '畅通', avgWaitHours: 2.6, throughputToday: 88, remark: '高加索陆港' },
  { id: 'poti', name: '波季', nameEn: 'Poti', country: 'georgia', region: 'caspian', regionLabel: '里海段', type: 'port', lat: 42.152, lng: 41.671, status: 'risk', containers: 94, pendingOps: 28, congestion: '严重拥堵', avgWaitHours: 8.5, throughputToday: 72, remark: '黑海东岸港口，当前作业延迟' },
  { id: 'kars', name: '卡尔斯', nameEn: 'Kars', country: 'turkey', region: 'europe', regionLabel: '欧洲段', type: 'border', lat: 40.601, lng: 43.097, status: 'normal', containers: 58, pendingOps: 9, congestion: '畅通', avgWaitHours: 2.2, throughputToday: 74, remark: '土耳其边境站' },
  { id: 'istanbul', name: '伊斯坦布尔', nameEn: 'Istanbul', country: 'turkey', region: 'europe', regionLabel: '欧洲段', type: 'railway', lat: 41.008, lng: 28.978, status: 'normal', containers: 72, pendingOps: 11, congestion: '畅通', avgWaitHours: 2.4, throughputToday: 96, remark: '欧亚交汇枢纽' },
  { id: 'budapest', name: '布达佩斯', nameEn: 'Budapest', country: 'hungary', region: 'europe', regionLabel: '欧洲段', type: 'railway', lat: 47.497, lng: 19.040, status: 'normal', containers: 48, pendingOps: 7, congestion: '畅通', avgWaitHours: 1.8, throughputToday: 62, remark: '中东欧分拨中心' },
  { id: 'warsaw', name: '华沙', nameEn: 'Warsaw', country: 'poland', region: 'europe', regionLabel: '欧洲段', type: 'railway', lat: 52.229, lng: 21.012, status: 'normal', containers: 52, pendingOps: 8, congestion: '畅通', avgWaitHours: 1.6, throughputToday: 68, remark: '欧洲内陆枢纽' },
  { id: 'bucharest', name: '布加勒斯特', nameEn: 'Bucharest', country: 'romania', region: 'europe', regionLabel: '欧洲段', type: 'railway', lat: 44.427, lng: 26.103, status: 'normal', containers: 76, pendingOps: 14, congestion: '畅通', avgWaitHours: 2.3, throughputToday: 94, remark: '罗马尼亚铁路枢纽' },
  { id: 'duisburg', name: '杜伊斯堡', nameEn: 'Duisburg', country: 'germany', region: 'europe', regionLabel: '欧洲段', type: 'railway', lat: 51.434, lng: 6.762, status: 'busy', containers: 118, pendingOps: 24, congestion: '轻度拥堵', avgWaitHours: 3.8, throughputToday: 142, remark: '欧洲终点枢纽' },
]

export const corridorRoutes: CorridorRoute[] = [
  { id: 'r1', from: 'xian', to: 'khorgos', type: 'rail', activeCount: 42 },
  { id: 'r2', from: 'urumqi', to: 'alashankou', type: 'rail', activeCount: 18 },
  { id: 'r3', from: 'khorgos', to: 'altynkol', type: 'rail', activeCount: 36 },
  { id: 'r4', from: 'altynkol', to: 'aktau', type: 'rail', activeCount: 22 },
  { id: 'r5', from: 'aktau', to: 'baku', type: 'sea', activeCount: 16 },
  { id: 'r6', from: 'baku', to: 'tbilisi', type: 'rail', activeCount: 14 },
  { id: 'r7', from: 'tbilisi', to: 'poti', type: 'rail', activeCount: 12 },
  { id: 'r8', from: 'tbilisi', to: 'kars', type: 'rail', activeCount: 10 },
  { id: 'r9', from: 'kars', to: 'istanbul', type: 'rail', activeCount: 8 },
  { id: 'r10', from: 'poti', to: 'istanbul', type: 'sea', activeCount: 6 },
  { id: 'r11', from: 'istanbul', to: 'budapest', type: 'rail', activeCount: 14 },
  { id: 'r12', from: 'budapest', to: 'warsaw', type: 'rail', activeCount: 11 },
  { id: 'r13', from: 'warsaw', to: 'duisburg', type: 'rail', activeCount: 16 },
  { id: 'r18', from: 'budapest', to: 'bucharest', type: 'rail', activeCount: 9 },
  { id: 'r14', from: 'beijing', to: 'xian', type: 'rail', activeCount: 24 },
  { id: 'r15', from: 'lianyungang', to: 'xian', type: 'rail', activeCount: 20 },
  { id: 'r16', from: 'astana', to: 'aktau', type: 'rail', activeCount: 15 },
  { id: 'r17', from: 'alashankou', to: 'khorgos', type: 'rail', activeCount: 12 },
]

export const riskAlerts: RiskAlert[] = [
  { id: 'R1', level: 'high', nodeId: 'poti', nodeName: '波季', title: '港口严重拥堵', message: '波季港待作业箱量积压，预计平均等待时长超过 8 小时', time: '2026-06-08 14:20' },
  { id: 'R2', level: 'medium', nodeId: 'khorgos', nodeName: '霍尔果斯', title: '口岸通关延迟', message: '海关查验比例上升，出境集装箱平均等待 6.2 小时', time: '2026-06-08 13:05' },
  { id: 'R3', level: 'medium', nodeId: 'altynkol', nodeName: '阿腾科里', title: '换装作业紧张', message: '宽准轨换装线利用率 92%，部分班列排队', time: '2026-06-08 11:40' },
  { id: 'R4', level: 'low', nodeId: 'xian', nodeName: '西安', title: '发运高峰', message: '今日计划发运 42 列，场站作业负荷偏高', time: '2026-06-08 09:15' },
  { id: 'R5', level: 'low', nodeId: 'duisburg', nodeName: '杜伊斯堡', title: '到站箱量增多', message: '欧洲端堆场利用率 78%，建议加快提箱', time: '2026-06-08 08:30' },
]

export const activeTrajectories: ActiveTrajectory[] = [
  {
    id: 'TR1',
    trainNo: 'XL20260508001',
    containers: [
      { containerNo: 'CICU1018860', waybillNo: 'SMGS-2026-00101' },
      { containerNo: 'CICU1018867', waybillNo: 'SMGS-2026-00108' },
      { containerNo: 'TRAU9815540', waybillNo: 'SMGS-2026-00215' },
      { containerNo: 'TCKU7723104', waybillNo: 'SMGS-2026-00112' },
      { containerNo: 'MSKU4458921', waybillNo: 'SMGS-2026-00119' },
      { containerNo: 'HLBU9032145', waybillNo: 'SMGS-2026-00125' },
    ],
    currentNodeId: 'poti',
    routeNodeIds: ['xian', 'khorgos', 'altynkol', 'aktau', 'baku', 'poti', 'istanbul', 'budapest', 'bucharest'],
    progress: 58,
    riskLevel: 'none',
    updatedAt: '2026-06-08 14:28',
  },
  {
    id: 'TR2',
    trainNo: 'XL20260524002',
    containers: [
      { containerNo: 'CICU1023456', waybillNo: 'SMGS-2026-00228' },
      { containerNo: 'TGHU5567890', waybillNo: 'SMGS-2026-00235' },
      { containerNo: 'BEAU6678123', waybillNo: 'SMGS-2026-00242' },
      { containerNo: 'CSNU8890456', waybillNo: 'SMGS-2026-00249' },
    ],
    currentNodeId: 'khorgos',
    routeNodeIds: ['xian', 'khorgos', 'altynkol', 'baku', 'istanbul', 'budapest'],
    progress: 22,
    riskLevel: 'low',
    updatedAt: '2026-06-08 14:15',
  },
  {
    id: 'TR3',
    trainNo: 'XL20260525003',
    containers: [
      { containerNo: 'MSCU7654321', waybillNo: 'SMGS-2026-00301' },
      { containerNo: 'HLCU8890123', waybillNo: 'SMGS-2026-00308' },
      { containerNo: 'IRNU3345678', waybillNo: 'SMGS-2026-00315' },
      { containerNo: 'JKTU6678901', waybillNo: 'SMGS-2026-00322' },
      { containerNo: 'KOCU7789234', waybillNo: 'SMGS-2026-00329' },
    ],
    currentNodeId: 'baku',
    routeNodeIds: ['lianyungang', 'xian', 'khorgos', 'aktau', 'baku', 'poti', 'warsaw'],
    progress: 56,
    riskLevel: 'none',
    updatedAt: '2026-06-08 13:52',
  },
  {
    id: 'TR4',
    trainNo: 'XL20260428004',
    containers: [
      { containerNo: 'TCLU8899001', waybillNo: 'SMGS-2026-042801' },
      { containerNo: 'FCIU8890234', waybillNo: 'SMGS-2026-04141' },
      { containerNo: 'GESU5567123', waybillNo: 'SMGS-2026-04133' },
    ],
    currentNodeId: 'poti',
    routeNodeIds: ['xian', 'khorgos', 'altynkol', 'baku', 'poti', 'tbilisi', 'duisburg'],
    progress: 62,
    riskLevel: 'high',
    updatedAt: '2026-06-08 13:40',
  },
  {
    id: 'TR5',
    trainNo: 'XL20260512005',
    containers: [
      { containerNo: 'TBJU1234567', waybillNo: 'SMGS-2026-051201' },
      { containerNo: 'OOLU7789012', waybillNo: 'SMGS-2026-05162' },
      { containerNo: 'NYKU2234567', waybillNo: 'SMGS-2026-05170' },
    ],
    currentNodeId: 'xian',
    routeNodeIds: ['xian', 'khorgos', 'astana', 'altynkol'],
    progress: 8,
    riskLevel: 'none',
    updatedAt: '2026-06-08 12:18',
  },
  {
    id: 'TR6',
    trainNo: 'XL20260315006',
    containers: [
      { containerNo: 'HLXU3344556', waybillNo: 'SMGS-2026-038901' },
      { containerNo: 'CMAU3345678', waybillNo: 'SMGS-2026-03855' },
      { containerNo: 'TCLU6678901', waybillNo: 'SMGS-2026-03848' },
      { containerNo: 'FFAU2234567', waybillNo: 'SMGS-2026-03870' },
    ],
    currentNodeId: 'kars',
    routeNodeIds: ['urumqi', 'khorgos', 'baku', 'poti', 'kars', 'istanbul', 'budapest'],
    progress: 71,
    riskLevel: 'medium',
    updatedAt: '2026-06-08 11:55',
  },
]

export function getNodeById(id: string) {
  return corridorNodes.find((n) => n.id === id)
}

export function getNodesForRegion(region: DashboardRegion) {
  return region === 'all' ? corridorNodes : corridorNodes.filter((n) => n.region === region)
}

export function nodeLatLng(node: CorridorNode): [number, number] {
  return [node.lat, node.lng]
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
