export const AGGREGATION_STATIONS = [
  '西安',
  '霍尔果斯',
  '阿腾科里',
  '阿克套',
  '巴库',
  '波季',
  '卡尔斯',
] as const

export type AggregationStation = (typeof AGGREGATION_STATIONS)[number]

export interface AggregationStructuredData {
  containerNo?: string
  waybillNo?: string
  eventType: string
  location: string
  status: string
  trainNo?: string
  wagonNo?: string
  customsStatus?: string
  remark?: string
}

export interface AggregationMessage {
  id: number
  station: AggregationStation
  receivedAt: string
  sourceSystem: string
  structured: AggregationStructuredData
  rawData: string
}

export const aggregationMockData: AggregationMessage[] = [
  {
    id: 1,
    station: '西安',
    receivedAt: '2026-05-25 16:42:18',
    sourceSystem: 'XIAN-RAIL-EDI',
    structured: {
      containerNo: 'MSCU7654321',
      waybillNo: 'WB-2026-052501',
      eventType: '货车从车站出发',
      location: '西安国际港',
      status: '已发出',
      trainNo: 'X8001',
      wagonNo: '55616058',
    },
    rawData: JSON.stringify({
      msgId: 'XIAN-20260525-164218-001',
      sender: 'XIAN-RAIL-EDI',
      timestamp: '2026-05-25T16:42:18+08:00',
      payload: {
        container_id: 'MSCU7654321',
        bill_no: 'WB-2026-052501',
        event_code: 'DEPARTURE',
        station_code: 'CNXAG',
        train_no: 'X8001',
      },
    }, null, 2),
  },
  {
    id: 2,
    station: '霍尔果斯',
    receivedAt: '2026-05-24 09:15:33',
    sourceSystem: 'KHORGOS-CUSTOMS',
    structured: {
      containerNo: 'CICU1023456',
      waybillNo: 'WB-2026-052402',
      eventType: '海关查验',
      location: '霍尔果斯口岸',
      status: '查验中',
      customsStatus: '待放行',
      remark: '单证审核中',
    },
    rawData: JSON.stringify({
      header: { version: '2.1', node: 'KHORGOS' },
      body: {
        CONTAINER: 'CICU1023456',
        SMGS: 'SMGS-2026-00228',
        CUSTOMS_EVENT: 'INSPECTION',
        STATUS: 'PENDING',
        GATE: 'EAST-02',
      },
    }, null, 2),
  },
  {
    id: 3,
    station: '阿腾科里',
    receivedAt: '2026-05-23 14:28:05',
    sourceSystem: 'ALTYNKOL-TOS',
    structured: {
      containerNo: 'TRAU9815540',
      waybillNo: 'WB-2026-052301',
      eventType: '货车到站',
      location: '阿腾科里（出口）',
      status: '已到站',
      trainNo: 'KZ4402',
      wagonNo: '55616056',
    },
    rawData: `<?xml version="1.0" encoding="UTF-8"?>
<RailMessage xmlns="kz.rail.edi.v3">
  <MessageId>ATK-20260523-142805</MessageId>
  <Station>Altynkol(exp.)</Station>
  <Event>ARRIVAL</Event>
  <Container>TRAU9815540</Container>
  <Wagon>55616056</Wagon>
  <Train>KZ4402</Train>
</RailMessage>`,
  },
  {
    id: 4,
    station: '阿克套',
    receivedAt: '2026-05-23 11:05:47',
    sourceSystem: 'AKTAU-PORT-API',
    structured: {
      containerNo: 'TRAU9815540',
      waybillNo: 'WB-2026-052301',
      eventType: '卸船作业',
      location: '阿克套港 3号泊位',
      status: '作业中',
      remark: '海铁联运中转',
    },
    rawData: JSON.stringify({
      portCode: 'KZAKT',
      berth: 'BERTH-03',
      operation: 'DISCHARGE',
      container: 'TRAU9815540',
      vessel: 'MV CASPIAN STAR',
      eta: '2026-05-23T10:30:00Z',
    }, null, 2),
  },
  {
    id: 5,
    station: '巴库',
    receivedAt: '2026-05-22 08:33:12',
    sourceSystem: 'BAKU-TERMINAL',
    structured: {
      containerNo: 'GESU8876543',
      waybillNo: 'WB-2025-022003',
      eventType: '堆场入库',
      location: '巴库港集装箱堆场 A-12',
      status: '堆存中',
    },
    rawData: JSON.stringify({
      terminal: 'BAKU-CT',
      yardBlock: 'A-12',
      container: 'GESU8876543',
      action: 'YARD_IN',
      timestamp: '2026-05-22T08:33:12+04:00',
    }, null, 2),
  },
  {
    id: 6,
    station: '波季',
    receivedAt: '2026-05-21 19:48:56',
    sourceSystem: 'POTI-GATE',
    structured: {
      containerNo: 'HLXU5567890',
      waybillNo: 'WB-2025-031008',
      eventType: '口岸放行',
      location: '波季港',
      status: '已放行',
      customsStatus: '已清关',
    },
    rawData: `CONTAINER=HLXU5567890|EVENT=GATE_OUT|PORT=POTI|STATUS=CLEARED|TIME=20260521194856`,
  },
  {
    id: 7,
    station: '卡尔斯',
    receivedAt: '2026-05-21 06:12:40',
    sourceSystem: 'KARS-RAIL-KT',
    structured: {
      containerNo: 'TCLU2048193',
      waybillNo: 'WB-2025-011502',
      eventType: '跨境接入',
      location: '卡尔斯铁路枢纽',
      status: '已接入',
      trainNo: 'TR-KARS-118',
    },
    rawData: JSON.stringify({
      node: 'KARS',
      direction: 'EASTBOUND',
      containerNo: 'TCLU2048193',
      smgsNo: 'SMGS-2025-00042',
      event: 'CROSS_BORDER_HANDOVER',
    }, null, 2),
  },
  {
    id: 8,
    station: '霍尔果斯',
    receivedAt: '2026-05-20 22:17:09',
    sourceSystem: 'KHORGOS-RAIL',
    structured: {
      containerNo: 'CICU1018867',
      waybillNo: 'WB-2026-050902',
      eventType: '货车到站',
      location: '霍尔果斯站',
      status: '已到站',
      trainNo: 'X9003',
      wagonNo: '55616056',
    },
    rawData: JSON.stringify({
      msgType: 'STATION_ARRIVAL',
      station: '霍尔果斯',
      container: 'CICU1018867',
      arrivalTime: '2026-05-20 22:17:09',
    }, null, 2),
  },
  {
    id: 9,
    station: '西安',
    receivedAt: '2026-05-20 07:55:22',
    sourceSystem: 'XIAN-RAIL-EDI',
    structured: {
      containerNo: 'FCIU3344556',
      waybillNo: 'WB-2025-041205',
      eventType: '进站预约',
      location: '西安国际港',
      status: '已预约',
      remark: '次日装车',
    },
    rawData: JSON.stringify({
      bookingId: 'XA-BOOK-8821',
      container: 'FCIU3344556',
      slot: '2026-05-21T08:00:00+08:00',
    }, null, 2),
  },
  {
    id: 10,
    station: '阿腾科里',
    receivedAt: '2026-05-19 13:40:18',
    sourceSystem: 'ALTYNKOL-TOS',
    structured: {
      containerNo: 'CICU1018860',
      waybillNo: 'WB-2026-050801',
      eventType: '编组完成',
      location: '阿腾科里编组场',
      status: '待发出',
      trainNo: 'KZ3308',
    },
    rawData: JSON.stringify({
      event: 'MARSHALLING_DONE',
      containers: ['CICU1018860'],
      consist_id: 'KZ3308-20260519',
    }, null, 2),
  },
  {
    id: 11,
    station: '阿克套',
    receivedAt: '2026-05-18 17:22:44',
    sourceSystem: 'AKTAU-PORT-API',
    structured: {
      containerNo: 'MSCU7654321',
      waybillNo: 'WB-2026-052501',
      eventType: '装船计划',
      location: '阿克套港',
      status: '计划中',
      remark: '等待泊位分配',
    },
    rawData: JSON.stringify({
      port: 'AKTAU',
      planId: 'LOAD-PLAN-445',
      container: 'MSCU7654321',
      plannedBerth: 'BERTH-05',
    }, null, 2),
  },
  {
    id: 12,
    station: '巴库',
    receivedAt: '2026-05-17 10:08:31',
    sourceSystem: 'BAKU-TERMINAL',
    structured: {
      containerNo: 'CICU1023456',
      eventType: '到港预报',
      location: '巴库港',
      status: '预报已接收',
      remark: '里海段运输',
    },
    rawData: `{"vessel":"MV CASPIAN EXPRESS","containers":["CICU1023456"],"eta":"2026-05-18T06:00:00Z"}`,
  },
]
