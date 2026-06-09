export interface TrackingEvent {
  time: string
  location: string
  status: string
  type: 'arrival' | 'departure'
}

export interface TrackingFile {
  name: string
  size: number
  uploadedAt: string
}

export type CustomsStatus = '已报关' | '报关中' | '待报关' | '报关异常'

export type DelayRiskLevel = 'None' | 'Low' | 'Medium' | 'High'

export interface DelayRisk {
  level: DelayRiskLevel
  routeFrom: string
  routeTo: string
  statusMessage: string
  expectedTransitTime: string
  etaToNextStation: string
  actualTime: string
  expectedDelay: string
}

export interface MapRouteWaypoint {
  label: string
  type: 'railway' | 'port'
}

export interface MapRoute {
  waypoints: MapRouteWaypoint[]
  currentIndex: number
}

export interface FreightRecordDetail {
  origin: { flag: string; name: string }
  destination: { flag: string; name: string }
  distancePassed: number
  distanceToEnd: number
  progressPercent: number
  currentCountry: { flag: string; name: string }
  currentStationName: string
  currentStationInfo: CurrentStationInfo
  mapRoute: MapRoute
  trackingHistory: TrackingEvent[]
}

export type CongestionLevel = '畅通' | '轻度拥堵' | '中度拥堵' | '严重拥堵'

export interface RailwayStationInfo {
  type: 'railway'
  congestionStatus: CongestionLevel
  pendingContainers: number
  avgWaitHours: number
  availableTracks: number
}

export interface PortStationInfo {
  type: 'port'
  congestionStatus: CongestionLevel
  pendingContainers: number
  containerOps: {
    loadUnloadStatus: string
    storageStatus: string
    yardLocation: string
    storageDays: number
    berth: string
    updatedAt: string
  }
  weather: {
    condition: string
    wind: string
    waveHeight: string
    visibility: string
    temperature: string
  }
}

export type CurrentStationInfo = RailwayStationInfo | PortStationInfo

export interface ContainerRecord {
  id: number
  container: string
  waybillNo: string
  smgsNo: string
  customsStatus: CustomsStatus
  hsCode: string
  company: string
  ciplFile: TrackingFile
  smgsFile: TrackingFile
  customsFile: TrackingFile
}

export interface TrainRecord {
  id: number
  trainNo: string
  carriageNo: string
  createdAt: string
  departure: { flag: string; city: string } | null
  arrival: { flag: string; city: string } | null
  currentStation: { flag: string; city: string } | null
  status: string
  updatedAt: string
  starred: boolean
  delayRisk?: DelayRisk
  detail: FreightRecordDetail
  containers: ContainerRecord[]
}

export function trainContainsContainer(train: TrainRecord, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return train.containers.some((c) => c.container.toLowerCase().includes(q))
}

function mockContainer(
  id: number,
  container: string,
  docNo: string,
  customsStatus: CustomsStatus,
  hsCode: string,
  company: string,
  uploadedAt: string,
): ContainerRecord {
  const sizeBase = 150000 + (id % 7) * 12000
  return {
    id,
    container,
    waybillNo: docNo,
    smgsNo: docNo,
    customsStatus,
    hsCode,
    company,
    ciplFile: { name: `${container}-CIPL.pdf`, size: sizeBase + 80000, uploadedAt },
    smgsFile: { name: `${container}-SMGS.pdf`, size: sizeBase + 20000, uploadedAt },
    customsFile: { name: `${container}-报关单.pdf`, size: sizeBase, uploadedAt },
  }
}

export const mockData: TrainRecord[] = [
  {
    id: 1,
    trainNo: 'XL20260508001',
    carriageNo: '55616056',
    createdAt: '2026-05-08 11:11:32',
    departure: { flag: '🇰🇿', city: '阿腾科里' },
    arrival: { flag: '🇰🇿', city: '阿克套港' },
    currentStation: { flag: '🇰🇿', city: '阿克套港' },
    status: '货车到站',
    updatedAt: '2026-05-23 09:45:10',
    starred: false,
    delayRisk: {
      level: 'None',
      routeFrom: '阿腾科里',
      routeTo: '阿克套港',
      statusMessage: '运输进度符合预期',
      expectedTransitTime: '12–14 天',
      etaToNextStation: '26 - 28 6月, 2026',
      actualTime: '13 天',
      expectedDelay: '无',
    },
    detail: {
      origin: { flag: '🇰🇿', name: '阿腾科里' },
      destination: { flag: '🇰🇿', name: '阿克套港' },
      distancePassed: 3115,
      distanceToEnd: 4,
      progressPercent: 92,
      currentCountry: { flag: '🇰🇿', name: '哈萨克斯坦' },
      currentStationName: '阿克套港',
      currentStationInfo: {
        type: 'port',
        congestionStatus: '轻度拥堵',
        pendingContainers: 342,
        containerOps: {
          loadUnloadStatus: '卸船中',
          storageStatus: '待堆存',
          yardLocation: '—',
          storageDays: 0,
          berth: '3 号泊位',
          updatedAt: '2026-05-10 14:28',
        },
        weather: {
          condition: '多云',
          wind: '东北风 5-6 级',
          waveHeight: '1.2 - 1.8 m',
          visibility: '> 10 km',
          temperature: '18°C',
        },
      },
      mapRoute: {
        currentIndex: 4,
        waypoints: [
          { label: '阿腾科里', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: 'Mangistau', type: 'railway' },
          { label: 'Shetpe', type: 'railway' },
          { label: '阿克套港', type: 'port' },
        ],
      },
      trackingHistory: [
        { time: '10 5月, 2026 14:32', location: 'Mangistau', status: '货车到站', type: 'arrival' },
        { time: '10 5月, 2026 12:00', location: 'Shetpe', status: '货车从车站出发', type: 'departure' },
        { time: '8 5月, 2026 17:17', location: '阿姆利里', status: '货车到站', type: 'arrival' },
        { time: '8 5月, 2026 11:11', location: '阿腾科里', status: '班列从车站出发', type: 'departure' },
      ],
    },
    containers: [
      {
        id: 101,
        container: 'CICU1018860',
        waybillNo: 'WB-2026-050801',
        smgsNo: 'SMGS-2026-00101',
        customsStatus: '已报关',
        hsCode: '8542.31.0000',
        company: '-',
        ciplFile: { name: 'CICU1018860-CIPL.pdf', size: 245760, uploadedAt: '2026-05-08 11:10' },
        smgsFile: { name: 'CICU1018860-SMGS.pdf', size: 189440, uploadedAt: '2026-05-08 11:10' },
        customsFile: { name: 'CICU1018860-报关单.pdf', size: 163840, uploadedAt: '2026-05-08 11:09' },
      },
      {
        id: 102,
        container: 'CICU1018867',
        waybillNo: 'WB-2026-050902',
        smgsNo: 'SMGS-2026-00108',
        customsStatus: '报关中',
        hsCode: '8471.30.0000',
        company: 'SZY',
        ciplFile: { name: 'CICU1018867-CIPL.pdf', size: 312320, uploadedAt: '2026-05-09 18:08' },
        smgsFile: { name: 'CICU1018867-SMGS.xlsx', size: 98304, uploadedAt: '2026-05-09 18:08' },
        customsFile: { name: 'CICU1018867-报关单.pdf', size: 143360, uploadedAt: '2026-05-09 18:07' },
      },
      {
        id: 103,
        container: 'TRAU9815540',
        waybillNo: 'WB-2026-052301',
        smgsNo: 'SMGS-2026-00215',
        customsStatus: '已报关',
        hsCode: '7308.90.0000',
        company: 'Gulim',
        ciplFile: { name: 'TRAU9815540-CIPL.pdf', size: 428032, uploadedAt: '2026-05-23 09:42' },
        smgsFile: { name: 'TRAU9815540-SMGS.pdf', size: 156672, uploadedAt: '2026-05-23 09:42' },
        customsFile: { name: 'TRAU9815540-报关单.pdf', size: 198656, uploadedAt: '2026-05-23 09:41' },
      },
      mockContainer(104, 'TCKU7723104', 'SMGS-2026-00112', '已报关', '8517.62.0000', 'SZY', '2026-05-08 11:12'),
      mockContainer(105, 'MSKU4458921', 'SMGS-2026-00119', '待报关', '8473.30.0000', 'Gulim', '2026-05-08 11:15'),
      mockContainer(106, 'HLBU9032145', 'SMGS-2026-00125', '已报关', '9401.61.0000', '-', '2026-05-09 09:30'),
      mockContainer(107, 'GESU5567123', 'SMGS-2026-00133', '报关中', '3923.50.0000', 'SZY', '2026-05-09 14:22'),
      mockContainer(108, 'FCIU8890234', 'SMGS-2026-00141', '已报关', '8708.40.0000', 'Gulim', '2026-05-10 08:45'),
      mockContainer(109, 'TCLU6678901', 'SMGS-2026-00148', '已报关', '8544.42.0000', '-', '2026-05-11 16:10'),
      mockContainer(110, 'CMAU3345678', 'SMGS-2026-00155', '报关异常', '7304.90.0000', 'SZY', '2026-05-12 10:33'),
      mockContainer(111, 'OOLU7789012', 'SMGS-2026-00162', '已报关', '6110.20.0000', 'Gulim', '2026-05-15 11:20'),
      mockContainer(112, 'NYKU2234567', 'SMGS-2026-00170', '报关中', '8471.41.0000', '-', '2026-05-18 09:05'),
    ],
  },
  {
    id: 2,
    trainNo: 'XL20260524002',
    carriageNo: '55616057',
    createdAt: '2026-05-24 08:30:00',
    departure: { flag: '🇺🇿', city: '塔什干' },
    arrival: { flag: '🇰🇿', city: '阿拉木图' },
    currentStation: { flag: '🇺🇿', city: '塔什干' },
    status: '货车到站',
    updatedAt: '2026-05-24 14:20:00',
    starred: true,
    delayRisk: {
      level: 'Medium',
      routeFrom: '阿腾科里',
      routeTo: '阿拉木图',
      statusMessage: '边境查验可能导致延误',
      expectedTransitTime: '7–9 天',
      etaToNextStation: '1 - 3 7月, 2026',
      actualTime: '8 天',
      expectedDelay: '约 2 天',
    },
    detail: {
      origin: { flag: '🇰🇿', name: '阿腾科里' },
      destination: { flag: '🇨🇳', name: '阿拉木图' },
      distancePassed: 1500,
      distanceToEnd: 600,
      progressPercent: 71,
      currentCountry: { flag: '🇺🇿', name: '哈萨克斯坦' },
      currentStationName: '塔什干',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '严重拥堵',
        pendingContainers: 386,
        avgWaitHours: 12.8,
        availableTracks: 2,
      },
      mapRoute: {
        currentIndex: 3,
        waypoints: [
          { label: '阿腾科里', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '24 5月, 2026 14:20', location: '塔什干', status: '货车到站', type: 'arrival' },
        { time: '24 5月, 2026 08:30', location: '塔什干', status: '班列从车站出发', type: 'departure' },
      ],
    },
    containers: [
      {
        id: 201,
        container: 'CICU1023456',
        waybillNo: 'WB-2026-052402',
        smgsNo: 'SMGS-2026-00228',
        customsStatus: '待报关',
        hsCode: '8517.12.0000',
        company: 'SZY',
        ciplFile: { name: 'CICU1023456-CIPL.pdf', size: 276480, uploadedAt: '2026-05-24 08:28' },
        smgsFile: { name: 'CICU1023456-SMGS.pdf', size: 204800, uploadedAt: '2026-05-24 08:28' },
        customsFile: { name: 'CICU1023456-报关单.pdf', size: 151552, uploadedAt: '2026-05-24 08:27' },
      },
      mockContainer(202, 'TGHU5567890', 'SMGS-2026-00235', '已报关', '8542.31.0000', 'Gulim', '2026-05-24 08:30'),
      mockContainer(203, 'BEAU6678123', 'SMGS-2026-00242', '报关中', '8471.30.0000', 'SZY', '2026-05-24 08:32'),
      mockContainer(204, 'CSNU8890456', 'SMGS-2026-00249', '已报关', '9403.60.0000', '-', '2026-05-24 08:35'),
      mockContainer(205, 'DRYU3345789', 'SMGS-2026-00256', '待报关', '8517.12.0000', 'SZY', '2026-05-24 08:38'),
      mockContainer(206, 'EMCU7789123', 'SMGS-2026-00263', '已报关', '3926.90.0000', 'Gulim', '2026-05-24 08:40'),
      mockContainer(207, 'FFAU2234567', 'SMGS-2026-00270', '报关中', '8708.99.0000', '-', '2026-05-24 08:42'),
      mockContainer(208, 'GAOU5567012', 'SMGS-2026-00277', '已报关', '6110.30.0000', 'SZY', '2026-05-24 08:45'),
    ],
  },
  {
    id: 3,
    trainNo: 'XL20260525003',
    carriageNo: '55616058',
    createdAt: '2026-05-25 10:00:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇺🇿', city: '塔什干' },
    currentStation: { flag: '🇨🇳', city: '乌鲁木齐' },
    status: '货车从车站出发',
    updatedAt: '2026-05-25 16:45:00',
    starred: false,
    delayRisk: {
      level: 'High',
      routeFrom: '乌鲁木齐',
      routeTo: '塔什干',
      statusMessage: '前方站点拥堵，延误风险较高',
      expectedTransitTime: '6–8 天',
      etaToNextStation: '3 - 6 7月, 2026',
      actualTime: '7 天',
      expectedDelay: '约 3–4 天',
    },
    detail: {
      origin: { flag: '🇨🇳', name: '乌鲁木齐' },
      destination: { flag: '🇺🇿', name: '塔什干' },
      distancePassed: 320,
      distanceToEnd: 1800,
      progressPercent: 15,
      currentCountry: { flag: '🇨🇳', name: 'China' },
      currentStationName: '乌鲁木齐',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '畅通',
        pendingContainers: 56,
        avgWaitHours: 2.1,
        availableTracks: 9,
      },
      mapRoute: {
        currentIndex: 0,
        waypoints: [
          { label: '乌鲁木齐', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: '塔什干', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '25 5月, 2026 16:45', location: '乌鲁木齐', status: '货车从车站出发', type: 'departure' },
        { time: '25 5月, 2026 10:00', location: '乌鲁木齐', status: '班列到站', type: 'arrival' },
      ],
    },
    containers: [
      {
        id: 301,
        container: 'MSCU7654321',
        waybillNo: 'WB-2026-052501',
        smgsNo: 'SMGS-2026-00301',
        customsStatus: '报关异常',
        hsCode: '9403.60.0000',
        company: '-',
        ciplFile: { name: 'MSCU7654321-CIPL.pdf', size: 358400, uploadedAt: '2026-05-25 09:58' },
        smgsFile: { name: 'MSCU7654321-SMGS.pdf', size: 172032, uploadedAt: '2026-05-25 09:58' },
        customsFile: { name: 'MSCU7654321-报关单.pdf', size: 174080, uploadedAt: '2026-05-25 09:57' },
      },
      mockContainer(302, 'HLCU8890123', 'SMGS-2026-00308', '已报关', '8473.30.0000', 'SZY', '2026-05-25 10:02'),
      mockContainer(303, 'IRNU3345678', 'SMGS-2026-00315', '报关中', '8544.42.0000', 'Gulim', '2026-05-25 10:05'),
      mockContainer(304, 'JKTU6678901', 'SMGS-2026-00322', '待报关', '7308.90.0000', '-', '2026-05-25 10:08'),
      mockContainer(305, 'KOCU7789234', 'SMGS-2026-00329', '已报关', '9401.61.0000', 'SZY', '2026-05-25 10:10'),
      mockContainer(306, 'LMCU2234567', 'SMGS-2026-00336', '报关异常', '8517.62.0000', 'Gulim', '2026-05-25 10:12'),
      mockContainer(307, 'MOCU5567890', 'SMGS-2026-00343', '已报关', '3923.50.0000', '-', '2026-05-25 10:15'),
      mockContainer(308, 'NOLU8890123', 'SMGS-2026-00350', '报关中', '8708.40.0000', 'SZY', '2026-05-25 10:18'),
    ],
  },
]

export const archivedMockData: TrainRecord[] = [
  {
    id: 101,
    trainNo: 'XL20250115001',
    carriageNo: '55615801',
    createdAt: '2025-01-15 09:20:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇰🇿', city: '阿拉木图' },
    currentStation: { flag: '🇰🇿', city: '阿拉木图' },
    status: '运输完成',
    updatedAt: '2025-01-28 16:30:00',
    starred: false,
    detail: {
      origin: { flag: '🇨🇳', name: '乌鲁木齐' },
      destination: { flag: '🇰🇿', name: '阿拉木图' },
      distancePassed: 2100,
      distanceToEnd: 0,
      progressPercent: 100,
      currentCountry: { flag: '🇰🇿', name: 'Kazakhstan' },
      currentStationName: '阿拉木图',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '畅通',
        pendingContainers: 42,
        avgWaitHours: 1.8,
        availableTracks: 8,
      },
      mapRoute: {
        currentIndex: 4,
        waypoints: [
          { label: '乌鲁木齐', type: 'railway' },
          { label: '霍尔果斯', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '28 1月, 2025 16:30', location: '阿拉木图', status: '运输完成', type: 'arrival' },
        { time: '15 1月, 2025 09:20', location: '乌鲁木齐', status: '班列从车站出发', type: 'departure' },
      ],
    },
    containers: [
      {
        id: 1001,
        container: 'TCLU2048193',
        waybillNo: 'WB-2025-011502',
        smgsNo: 'SMGS-2025-00042',
        customsStatus: '已报关',
        hsCode: '3926.90.0000',
        company: 'SZY',
        ciplFile: { name: 'TCLU2048193-CIPL.pdf', size: 228352, uploadedAt: '2025-01-15 09:18' },
        smgsFile: { name: 'TCLU2048193-SMGS.pdf', size: 176128, uploadedAt: '2025-01-15 09:18' },
        customsFile: { name: 'TCLU2048193-报关单.pdf', size: 152576, uploadedAt: '2025-01-15 09:17' },
      },
      mockContainer(1005, 'PQRU1122334', 'SMGS-2025-00049', '已报关', '8471.41.0000', 'Gulim', '2025-01-15 09:19'),
      mockContainer(1006, 'QRST2233445', 'SMGS-2025-00051', '已报关', '8542.31.0000', '-', '2025-01-15 09:20'),
      mockContainer(1007, 'RSTU3344556', 'SMGS-2025-00053', '报关中', '9403.60.0000', 'SZY', '2025-01-15 09:21'),
      mockContainer(1008, 'STUV4455667', 'SMGS-2025-00055', '已报关', '6110.20.0000', 'Gulim', '2025-01-15 09:22'),
      mockContainer(1009, 'TUVW5566778', 'SMGS-2025-00057', '已报关', '7304.90.0000', '-', '2025-01-15 09:23'),
    ],
  },
  {
    id: 102,
    trainNo: 'XL20250220002',
    carriageNo: '55615812',
    createdAt: '2025-02-20 14:05:00',
    departure: { flag: '🇺🇿', city: '塔什干' },
    arrival: { flag: '🇨🇳', city: '乌鲁木齐' },
    currentStation: { flag: '🇨🇳', city: '乌鲁木齐' },
    status: '运输完成',
    updatedAt: '2025-03-05 11:42:00',
    starred: false,
    detail: {
      origin: { flag: '🇺🇿', name: '塔什干' },
      destination: { flag: '🇨🇳', name: '乌鲁木齐' },
      distancePassed: 1850,
      distanceToEnd: 0,
      progressPercent: 100,
      currentCountry: { flag: '🇨🇳', name: 'China' },
      currentStationName: '乌鲁木齐',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '轻度拥堵',
        pendingContainers: 98,
        avgWaitHours: 3.6,
        availableTracks: 7,
      },
      mapRoute: {
        currentIndex: 4,
        waypoints: [
          { label: '塔什干', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '霍尔果斯', type: 'railway' },
          { label: '乌鲁木齐', type: 'railway' },
          { label: '乌鲁木齐', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '5 3月, 2025 11:42', location: '乌鲁木齐', status: '运输完成', type: 'arrival' },
        { time: '20 2月, 2025 14:05', location: '塔什干', status: '班列从车站出发', type: 'departure' },
      ],
    },
    containers: [
      {
        id: 1002,
        container: 'GESU8876543',
        waybillNo: 'WB-2025-022003',
        smgsNo: 'SMGS-2025-00058',
        customsStatus: '已报关',
        hsCode: '8708.99.0000',
        company: 'Gulim',
        ciplFile: { name: 'GESU8876543-CIPL.pdf', size: 294912, uploadedAt: '2025-02-20 14:02' },
        smgsFile: { name: 'GESU8876543-SMGS.pdf', size: 167936, uploadedAt: '2025-02-20 14:02' },
        customsFile: { name: 'GESU8876543-报关单.pdf', size: 141312, uploadedAt: '2025-02-20 14:01' },
      },
      {
        id: 1003,
        container: 'HLXU5567890',
        waybillNo: 'WB-2025-031008',
        smgsNo: 'SMGS-2025-00071',
        customsStatus: '已报关',
        hsCode: '6110.30.0000',
        company: '-',
        ciplFile: { name: 'HLXU5567890-CIPL.pdf', size: 256000, uploadedAt: '2025-03-10 08:43' },
        smgsFile: { name: 'HLXU5567890-SMGS.pdf', size: 184320, uploadedAt: '2025-03-10 08:43' },
        customsFile: { name: 'HLXU5567890-报关单.pdf', size: 159744, uploadedAt: '2025-03-10 08:42' },
      },
      mockContainer(1010, 'UVWX6677889', 'SMGS-2025-00078', '已报关', '8517.12.0000', 'SZY', '2025-02-20 14:04'),
      mockContainer(1011, 'VWXY7788990', 'SMGS-2025-00080', '已报关', '3926.90.0000', 'Gulim', '2025-02-20 14:05'),
      mockContainer(1012, 'WXYZ8899001', 'SMGS-2025-00082', '报关中', '8708.99.0000', '-', '2025-02-20 14:06'),
      mockContainer(1013, 'XYZA9900112', 'SMGS-2025-00084', '已报关', '8473.30.0000', 'SZY', '2025-02-20 14:07'),
    ],
  },
  {
    id: 103,
    trainNo: 'XL20250412003',
    carriageNo: '55615833',
    createdAt: '2025-04-12 16:30:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇺🇿', city: '阿姆利里' },
    currentStation: { flag: '🇺🇿', city: '阿姆利里' },
    status: '运输完成',
    updatedAt: '2025-04-25 18:00:00',
    starred: false,
    detail: {
      origin: { flag: '🇨🇳', name: '乌鲁木齐' },
      destination: { flag: '🇺🇿', name: '阿姆利里' },
      distancePassed: 2400,
      distanceToEnd: 0,
      progressPercent: 100,
      currentCountry: { flag: '🇺🇿', name: 'Uzbekistan' },
      currentStationName: '阿姆利里',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '畅通',
        pendingContainers: 31,
        avgWaitHours: 1.5,
        availableTracks: 7,
      },
      mapRoute: {
        currentIndex: 4,
        waypoints: [
          { label: '乌鲁木齐', type: 'railway' },
          { label: '霍尔果斯', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '25 4月, 2025 18:00', location: '阿姆利里', status: '运输完成', type: 'arrival' },
        { time: '12 4月, 2025 16:30', location: '乌鲁木齐', status: '班列从车站出发', type: 'departure' },
      ],
    },
    containers: [
      {
        id: 1004,
        container: 'FCIU3344556',
        waybillNo: 'WB-2025-041205',
        smgsNo: 'SMGS-2025-00089',
        customsStatus: '已报关',
        hsCode: '2106.90.0000',
        company: 'SZY',
        ciplFile: { name: 'FCIU3344556-CIPL.pdf', size: 301056, uploadedAt: '2025-04-12 16:28' },
        smgsFile: { name: 'FCIU3344556-SMGS.pdf', size: 192512, uploadedAt: '2025-04-12 16:28' },
        customsFile: { name: 'FCIU3344556-报关单.pdf', size: 168960, uploadedAt: '2025-04-12 16:27' },
      },
      mockContainer(1014, 'YZAB0011223', 'SMGS-2025-00096', '已报关', '2106.90.0000', 'Gulim', '2025-04-12 16:29'),
      mockContainer(1015, 'ZABC1122334', 'SMGS-2025-00098', '已报关', '8544.42.0000', '-', '2025-04-12 16:30'),
      mockContainer(1016, 'ABCD2233445', 'SMGS-2025-00100', '报关中', '9401.61.0000', 'SZY', '2025-04-12 16:31'),
      mockContainer(1017, 'BCDE3344556', 'SMGS-2025-00102', '已报关', '7308.90.0000', 'Gulim', '2025-04-12 16:32'),
      mockContainer(1018, 'CDEF4455667', 'SMGS-2025-00104', '已报关', '3923.50.0000', 'SZY', '2025-04-12 16:33'),
    ],
  },
]
