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

export interface FreightRecord {
  id: number
  container: string
  waybillNo: string
  smgsNo: string
  customsStatus: CustomsStatus
  company: string
  carriageNo: string
  createdAt: string
  departure: { flag: string; city: string } | null
  arrival: { flag: string; city: string } | null
  currentStation: { flag: string; city: string } | null
  status: string
  updatedAt: string
  starred: boolean
  ciplFile: TrackingFile
  smgsFile: TrackingFile
  customsFile: TrackingFile
  delayRisk?: DelayRisk
  detail: FreightRecordDetail
}

export const mockData: FreightRecord[] = [
  {
    id: 1,
    container: 'CICU1018860',
    waybillNo: 'WB-2026-050801',
    smgsNo: 'SMGS-2026-00101',
    customsStatus: '已报关',
    company: '-',
    carriageNo: '55616056',
    createdAt: '2026-05-08 11:11:32',
    departure: { flag: '🇺🇿', city: '阿姆利里' },
    arrival: { flag: '🇺🇿', city: '阿姆利里' },
    currentStation: { flag: '🇺🇿', city: '阿姆利里' },
    status: '货车到站',
    updatedAt: '2026-05-08 17:17:31',
    starred: false,
    ciplFile: { name: 'CICU1018860-CIPL.pdf', size: 245760, uploadedAt: '2026-05-08 11:10' },
    smgsFile: { name: 'CICU1018860-SMGS.pdf', size: 189440, uploadedAt: '2026-05-08 11:10' },
    customsFile: { name: 'CICU1018860-报关单.pdf', size: 163840, uploadedAt: '2026-05-08 11:09' },
    delayRisk: {
      level: 'None',
      routeFrom: '阿腾科里',
      routeTo: '阿姆利里',
      statusMessage: '运输进度符合预期',
      expectedTransitTime: '5–7 天',
      etaToNextStation: '24 - 27 6月, 2026',
      actualTime: '6 天',
      expectedDelay: '无',
    },
    detail: {
      origin: { flag: '🇺🇿', name: "阿腾科里" },
      destination: { flag: '🇺🇿', name: '阿姆利里' },
      distancePassed: 1200,
      distanceToEnd: 800,
      progressPercent: 60,
      currentCountry: { flag: '🇺🇿', name: '哈萨克斯坦' },
      currentStationName: '阿姆利里',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '轻度拥堵',
        pendingContainers: 128,
        avgWaitHours: 4.5,
        availableTracks: 6,
      },
      mapRoute: {
        currentIndex: 2,
        waypoints: [
          { label: '阿腾科里', type: 'railway' },
          { label: '霍尔果斯', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '8 5月, 2026 17:17', location: '阿姆利里', status: '货车到站', type: 'arrival' },
        { time: '8 5月, 2026 11:11', location: '塔什干', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
  {
    id: 2,
    container: 'CICU1018867',
    waybillNo: 'WB-2026-050902',
    smgsNo: 'SMGS-2026-00108',
    customsStatus: '报关中',
    company: 'SZY',
    carriageNo: '55616056',
    createdAt: '2026-05-09 18:11:32',
    departure: { flag: '🇺🇿', city: '阿姆利里' },
    arrival: null,
    currentStation: null,
    status: '货车从车站出发',
    updatedAt: '2026-05-22 10:14:52',
    starred: false,
    ciplFile: { name: 'CICU1018867-CIPL.pdf', size: 312320, uploadedAt: '2026-05-09 18:08' },
    smgsFile: { name: 'CICU1018867-SMGS.xlsx', size: 98304, uploadedAt: '2026-05-09 18:08' },
    customsFile: { name: 'CICU1018867-报关单.pdf', size: 143360, uploadedAt: '2026-05-09 18:07' },
    delayRisk: {
      level: 'Low',
      routeFrom: '阿腾科里',
      routeTo: '乌鲁木齐',
      statusMessage: '运输略有放缓，仍在正常范围',
      expectedTransitTime: '8–10 天',
      etaToNextStation: '28 - 30 6月, 2026',
      actualTime: '9 天',
      expectedDelay: '约 1 天',
    },
    detail: {
      origin: { flag: '🇺🇿', name: "阿腾科里" },
      destination: { flag: '🇨🇳', name: '乌鲁木齐' },
      distancePassed: 890,
      distanceToEnd: 2100,
      progressPercent: 30,
      currentCountry: { flag: '🇺🇿', name: '哈萨克斯坦' },
      currentStationName: '阿姆利里',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '中度拥堵',
        pendingContainers: 215,
        avgWaitHours: 7.2,
        availableTracks: 4,
      },
      mapRoute: {
        currentIndex: 1,
        waypoints: [
          { label: '阿腾科里', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿拉木图', type: 'railway' },
          { label: '乌鲁木齐', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '22 5月, 2026 10:14', location: '阿姆利里', status: '货车从车站出发', type: 'departure' },
        { time: '9 5月, 2026 18:11', location: '阿姆利里', status: '货车到站', type: 'arrival' },
      ],
    },
  },
  {
    id: 3,
    container: 'TRAU9815540',
    waybillNo: 'WB-2026-052301',
    smgsNo: 'SMGS-2026-00215',
    customsStatus: '已报关',
    company: 'Gulim',
    carriageNo: '55616056',
    createdAt: '2026-05-23 09:45:10',
    departure: { flag: '🇺🇿', city: '塔什干' },
    arrival: { flag: '🇨🇳', city: '乌鲁木齐' },
    currentStation: null,
    status: '货车到站',
    updatedAt: '2026-05-22 10:14:52',
    starred: false,
    ciplFile: { name: 'TRAU9815540-CIPL.pdf', size: 428032, uploadedAt: '2026-05-23 09:42' },
    smgsFile: { name: 'TRAU9815540-SMGS.pdf', size: 156672, uploadedAt: '2026-05-23 09:42' },
    customsFile: { name: 'TRAU9815540-报关单.pdf', size: 198656, uploadedAt: '2026-05-23 09:41' },
    delayRisk: {
      level: 'None',
      routeFrom: '阿腾科里',
      routeTo: 'Aktau-port',
      statusMessage: '运输进度符合预期',
      expectedTransitTime: '12–14 天',
      etaToNextStation: '26 - 28 6月, 2026',
      actualTime: '13 天',
      expectedDelay: '无',
    },
    detail: {
      origin: { flag: '🇰🇿', name: "阿腾科里" },
      destination: { flag: '🇰🇿', name: 'Aktau-port (perev. exp.)' },
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
      ],
    },
  },
  {
    id: 4,
    container: 'CICU1023456',
    waybillNo: 'WB-2026-052402',
    smgsNo: 'SMGS-2026-00228',
    customsStatus: '待报关',
    company: 'SZY',
    carriageNo: '55616057',
    createdAt: '2026-05-24 08:30:00',
    departure: { flag: '🇺🇿', city: '塔什干' },
    arrival: { flag: 'kz', city: '阿拉木图' },
    currentStation: { flag: '🇺🇿', city: '塔什干' },
    status: '货车到站',
    updatedAt: '2026-05-24 14:20:00',
    starred: true,
    ciplFile: { name: 'CICU1023456-CIPL.pdf', size: 276480, uploadedAt: '2026-05-24 08:28' },
    smgsFile: { name: 'CICU1023456-SMGS.pdf', size: 204800, uploadedAt: '2026-05-24 08:28' },
    customsFile: { name: 'CICU1023456-报关单.pdf', size: 151552, uploadedAt: '2026-05-24 08:27' },
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
      origin: { flag: '🇰🇿', name: "阿腾科里" },
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
        { time: '24 5月, 2026 08:30', location: '塔什干', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
  {
    id: 5,
    container: 'MSCU7654321',
    waybillNo: 'WB-2026-052501',
    smgsNo: 'SMGS-2026-00301',
    customsStatus: '报关异常',
    company: '-',
    carriageNo: '55616058',
    createdAt: '2026-05-25 10:00:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇺🇿', city: '塔什干' },
    currentStation: { flag: '🇨🇳', city: '乌鲁木齐' },
    status: '货车从车站出发',
    updatedAt: '2026-05-25 16:45:00',
    starred: false,
    ciplFile: { name: 'MSCU7654321-CIPL.pdf', size: 358400, uploadedAt: '2026-05-25 09:58' },
    smgsFile: { name: 'MSCU7654321-SMGS.pdf', size: 172032, uploadedAt: '2026-05-25 09:58' },
    customsFile: { name: 'MSCU7654321-报关单.pdf', size: 174080, uploadedAt: '2026-05-25 09:57' },
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
        { time: '25 5月, 2026 10:00', location: '乌鲁木齐', status: '货车到站', type: 'arrival' },
      ],
    },
  },
]

export const archivedMockData: FreightRecord[] = [
  {
    id: 101,
    container: 'TCLU2048193',
    waybillNo: 'WB-2025-011502',
    smgsNo: 'SMGS-2025-00042',
    customsStatus: '已报关',
    company: 'SZY',
    carriageNo: '55615801',
    createdAt: '2025-01-15 09:20:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇰🇿', city: '阿拉木图' },
    currentStation: { flag: '🇰🇿', city: '阿拉木图' },
    status: '运输完成',
    updatedAt: '2025-01-28 16:30:00',
    starred: false,
    ciplFile: { name: 'TCLU2048193-CIPL.pdf', size: 228352, uploadedAt: '2025-01-15 09:18' },
    smgsFile: { name: 'TCLU2048193-SMGS.pdf', size: 176128, uploadedAt: '2025-01-15 09:18' },
    customsFile: { name: 'TCLU2048193-报关单.pdf', size: 152576, uploadedAt: '2025-01-15 09:17' },
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
        { time: '15 1月, 2025 09:20', location: '乌鲁木齐', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
  {
    id: 102,
    container: 'GESU8876543',
    waybillNo: 'WB-2025-022003',
    smgsNo: 'SMGS-2025-00058',
    customsStatus: '已报关',
    company: 'Gulim',
    carriageNo: '55615812',
    createdAt: '2025-02-20 14:05:00',
    departure: { flag: '🇺🇿', city: '塔什干' },
    arrival: { flag: '🇨🇳', city: '乌鲁木齐' },
    currentStation: { flag: '🇨🇳', city: '乌鲁木齐' },
    status: '运输完成',
    updatedAt: '2025-03-05 11:42:00',
    starred: false,
    ciplFile: { name: 'GESU8876543-CIPL.pdf', size: 294912, uploadedAt: '2025-02-20 14:02' },
    smgsFile: { name: 'GESU8876543-SMGS.pdf', size: 167936, uploadedAt: '2025-02-20 14:02' },
    customsFile: { name: 'GESU8876543-报关单.pdf', size: 141312, uploadedAt: '2025-02-20 14:01' },
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
        { time: '20 2月, 2025 14:05', location: '塔什干', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
  {
    id: 103,
    container: 'HLXU5567890',
    waybillNo: 'WB-2025-031008',
    smgsNo: 'SMGS-2025-00071',
    customsStatus: '已报关',
    company: '-',
    carriageNo: '55615825',
    createdAt: '2025-03-10 08:45:00',
    departure: { flag: '🇰🇿', city: '阿拉木图' },
    arrival: { flag: '🇺🇿', city: '塔什干' },
    currentStation: { flag: '🇺🇿', city: '塔什干' },
    status: '运输完成',
    updatedAt: '2025-03-22 09:15:00',
    starred: true,
    ciplFile: { name: 'HLXU5567890-CIPL.pdf', size: 256000, uploadedAt: '2025-03-10 08:43' },
    smgsFile: { name: 'HLXU5567890-SMGS.pdf', size: 184320, uploadedAt: '2025-03-10 08:43' },
    customsFile: { name: 'HLXU5567890-报关单.pdf', size: 159744, uploadedAt: '2025-03-10 08:42' },
    detail: {
      origin: { flag: '🇰🇿', name: '阿拉木图' },
      destination: { flag: '🇺🇿', name: '塔什干' },
      distancePassed: 920,
      distanceToEnd: 0,
      progressPercent: 100,
      currentCountry: { flag: '🇺🇿', name: 'Uzbekistan' },
      currentStationName: '塔什干',
      currentStationInfo: {
        type: 'railway',
        congestionStatus: '中度拥堵',
        pendingContainers: 167,
        avgWaitHours: 6.4,
        availableTracks: 5,
      },
      mapRoute: {
        currentIndex: 4,
        waypoints: [
          { label: '阿拉木图', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '阿姆利里', type: 'railway' },
          { label: '塔什干', type: 'railway' },
          { label: '塔什干', type: 'railway' },
        ],
      },
      trackingHistory: [
        { time: '22 3月, 2025 09:15', location: '塔什干', status: '运输完成', type: 'arrival' },
        { time: '10 3月, 2025 08:45', location: '阿拉木图', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
  {
    id: 104,
    container: 'FCIU3344556',
    waybillNo: 'WB-2025-041205',
    smgsNo: 'SMGS-2025-00089',
    customsStatus: '已报关',
    company: 'SZY',
    carriageNo: '55615833',
    createdAt: '2025-04-12 16:30:00',
    departure: { flag: '🇨🇳', city: '乌鲁木齐' },
    arrival: { flag: '🇺🇿', city: '阿姆利里' },
    currentStation: { flag: '🇺🇿', city: '阿姆利里' },
    status: '运输完成',
    updatedAt: '2025-04-25 18:00:00',
    starred: false,
    ciplFile: { name: 'FCIU3344556-CIPL.pdf', size: 301056, uploadedAt: '2025-04-12 16:28' },
    smgsFile: { name: 'FCIU3344556-SMGS.pdf', size: 192512, uploadedAt: '2025-04-12 16:28' },
    customsFile: { name: 'FCIU3344556-报关单.pdf', size: 168960, uploadedAt: '2025-04-12 16:27' },
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
        { time: '12 4月, 2025 16:30', location: '乌鲁木齐', status: '货车从车站出发', type: 'departure' },
      ],
    },
  },
]
