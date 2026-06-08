export type SyncStatus = 'success' | 'failed' | 'pending'

export interface SyncData {
  containerNo?: string
  waybillNo?: string
  smgsNo?: string
  eventType?: string
  location?: string
  status?: string
  customsStatus?: string
  trainNo?: string
}

export interface DataExportRecord {
  id: string
  requestId: string
  requestedAt: string
  syncedAt: string | null
  foreignEntity: string
  foreignEntityEn: string
  country: string
  countryFlag: string
  dataType: string
  syncStatus: SyncStatus
  syncData: SyncData
  requestPayload: string
}

export const TITR_PLATFORM = 'TITR 境外平台'

export const DATA_EXPORT_ENABLED_KEY = 'dtc-data-export-enabled'

export function loadDataExportEnabled(): boolean {
  const stored = localStorage.getItem(DATA_EXPORT_ENABLED_KEY)
  if (stored === null) return true
  return stored === 'true'
}

export function storeDataExportEnabled(enabled: boolean) {
  localStorage.setItem(DATA_EXPORT_ENABLED_KEY, String(enabled))
}

export const EXPORT_COUNTRY_OPTIONS = [
  { value: '', label: '全部国家' },
  { value: '哈萨克斯坦', label: '哈萨克斯坦' },
  { value: '乌兹别克斯坦', label: '乌兹别克斯坦' },
  { value: '阿塞拜疆', label: '阿塞拜疆' },
  { value: '格鲁吉亚', label: '格鲁吉亚' },
  { value: '土耳其', label: '土耳其' },
  { value: '俄罗斯', label: '俄罗斯' },
] as const

export const EXPORT_DATA_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: '运踪信息', label: '运踪信息' },
  { value: '报关数据', label: '报关数据' },
  { value: '集装箱状态', label: '集装箱状态' },
  { value: '单证信息', label: '单证信息' },
  { value: '场站作业', label: '场站作业' },
] as const

export const EXPORT_STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'success', label: '同步成功' },
  { value: 'pending', label: '同步中' },
  { value: 'failed', label: '同步失败' },
] as const

export const dataExportMockData: DataExportRecord[] = ([
  {
    id: 'EXP-20250608-001',
    requestId: 'KZ-RQ-88421',
    requestedAt: '2025-06-08 08:15:22',
    syncedAt: '2025-06-08 08:16:05',
    foreignEntity: '哈萨克斯坦国家铁路公司',
    foreignEntityEn: 'KTZ Express',
    country: '哈萨克斯坦',
    countryFlag: '🇰🇿',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018860', waybillNo: 'WB-2026-050801', eventType: '到达', location: '阿姆利里', status: '货车到站' },
    requestPayload: JSON.stringify({ requestId: 'KZ-RQ-88421', platform: 'TITR', containerNo: 'CICU1018860', eventType: 'ARRIVE' }, null, 2),
  },
  {
    id: 'EXP-20250608-002',
    requestId: 'KZ-RQ-88421',
    requestedAt: '2025-06-08 08:15:22',
    syncedAt: '2025-06-08 08:16:08',
    foreignEntity: '哈萨克斯坦国家铁路公司',
    foreignEntityEn: 'KTZ Express',
    country: '哈萨克斯坦',
    countryFlag: '🇰🇿',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018867', waybillNo: 'WB-2026-050902', eventType: '出发', location: '塔什干', status: '货车从车站出发' },
    requestPayload: JSON.stringify({ requestId: 'KZ-RQ-88421', platform: 'TITR', containerNo: 'CICU1018867', eventType: 'DEPART' }, null, 2),
  },
  {
    id: 'EXP-20250608-003',
    requestId: 'UZ-CUS-12033',
    requestedAt: '2025-06-08 09:42:18',
    syncedAt: '2025-06-08 09:43:01',
    foreignEntity: '乌兹别克斯坦海关',
    foreignEntityEn: 'Uzbekistan Customs Authority',
    country: '乌兹别克斯坦',
    countryFlag: '🇺🇿',
    dataType: '报关数据',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018860', waybillNo: 'WB-2026-050801', customsStatus: '已报关', status: '已放行' },
    requestPayload: JSON.stringify({ requestId: 'UZ-CUS-12033', platform: 'TITR', containerNo: 'CICU1018860' }, null, 2),
  },
  {
    id: 'EXP-20250608-004',
    requestId: 'UZ-CUS-12033',
    requestedAt: '2025-06-08 09:42:18',
    syncedAt: '2025-06-08 09:43:04',
    foreignEntity: '乌兹别克斯坦海关',
    foreignEntityEn: 'Uzbekistan Customs Authority',
    country: '乌兹别克斯坦',
    countryFlag: '🇺🇿',
    dataType: '报关数据',
    syncStatus: 'success',
    syncData: { containerNo: 'TBJU1234567', waybillNo: 'WB-2026-051201', customsStatus: '报关中', status: '查验中' },
    requestPayload: JSON.stringify({ requestId: 'UZ-CUS-12033', platform: 'TITR', containerNo: 'TBJU1234567' }, null, 2),
  },
  {
    id: 'EXP-20250608-005',
    requestId: 'AZ-PORT-5567',
    requestedAt: '2025-06-08 10:20:44',
    syncedAt: '2025-06-08 10:21:30',
    foreignEntity: '巴库港务局',
    foreignEntityEn: 'Baku Port Authority',
    country: '阿塞拜疆',
    countryFlag: '🇦🇿',
    dataType: '集装箱状态',
    syncStatus: 'success',
    syncData: { containerNo: 'MSCU9876543', location: '巴库港', status: '装船完成', eventType: '装船' },
    requestPayload: JSON.stringify({ requestId: 'AZ-PORT-5567', platform: 'TITR', containerNo: 'MSCU9876543' }, null, 2),
  },
  {
    id: 'EXP-20250608-006',
    requestId: 'AZ-PORT-5567',
    requestedAt: '2025-06-08 10:20:44',
    syncedAt: '2025-06-08 10:21:33',
    foreignEntity: '巴库港务局',
    foreignEntityEn: 'Baku Port Authority',
    country: '阿塞拜疆',
    countryFlag: '🇦🇿',
    dataType: '集装箱状态',
    syncStatus: 'success',
    syncData: { containerNo: 'HLBU5566778', location: '巴库港', status: '堆场待装', eventType: '进场' },
    requestPayload: JSON.stringify({ requestId: 'AZ-PORT-5567', platform: 'TITR', containerNo: 'HLBU5566778' }, null, 2),
  },
  {
    id: 'EXP-20250608-007',
    requestId: 'GE-POTI-3390',
    requestedAt: '2025-06-08 11:05:12',
    syncedAt: '2025-06-08 11:06:48',
    foreignEntity: '格鲁吉亚波季港',
    foreignEntityEn: 'Poti Sea Port LLC',
    country: '格鲁吉亚',
    countryFlag: '🇬🇪',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'TCLU8899001', waybillNo: 'WB-2026-042801', location: '波季', status: '卸船', eventType: '卸船' },
    requestPayload: JSON.stringify({ requestId: 'GE-POTI-3390', platform: 'TITR', containerNo: 'TCLU8899001' }, null, 2),
  },
  {
    id: 'EXP-20250608-008',
    requestId: 'TR-KARS-7712',
    requestedAt: '2025-06-08 13:18:56',
    syncedAt: null,
    foreignEntity: '土耳其卡尔斯边境管理署',
    foreignEntityEn: 'Kars Border Management Directorate',
    country: '土耳其',
    countryFlag: '🇹🇷',
    dataType: '单证信息',
    syncStatus: 'pending',
    syncData: { containerNo: 'CICU1018860', smgsNo: 'SMGS-2026-00101', eventType: '单证同步', status: '排队中' },
    requestPayload: JSON.stringify({ requestId: 'TR-KARS-7712', platform: 'TITR', docTypes: ['CIPL', 'SMGS'], containerNo: 'CICU1018860' }, null, 2),
  },
  {
    id: 'EXP-20250608-009',
    requestId: 'KZ-ATK-2245',
    requestedAt: '2025-06-08 14:32:07',
    syncedAt: '2025-06-08 14:32:09',
    foreignEntity: '阿克套港管理局',
    foreignEntityEn: 'Aktau Port Administration',
    country: '哈萨克斯坦',
    countryFlag: '🇰🇿',
    dataType: '场站作业',
    syncStatus: 'failed',
    syncData: { containerNo: 'RZDU4455667', location: '阿克套', status: '同步失败', eventType: '装卸' },
    requestPayload: JSON.stringify({ requestId: 'KZ-ATK-2245', platform: 'TITR', station: 'AKTAU' }, null, 2),
  },
  {
    id: 'EXP-20250607-001',
    requestId: 'RU-RZD-99801',
    requestedAt: '2025-06-07 16:45:33',
    syncedAt: '2025-06-07 16:46:12',
    foreignEntity: '俄罗斯铁路物流',
    foreignEntityEn: 'RZD Logistics',
    country: '俄罗斯',
    countryFlag: '🇷🇺',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'RZDU4455667', waybillNo: 'WB-2026-040112', trainNo: 'X8001', location: '莫斯科', status: '在途' },
    requestPayload: JSON.stringify({ requestId: 'RU-RZD-99801', platform: 'TITR', containerNo: 'RZDU4455667' }, null, 2),
  },
  {
    id: 'EXP-20250607-002',
    requestId: 'UZ-TAS-4418',
    requestedAt: '2025-06-07 10:12:44',
    syncedAt: '2025-06-07 10:13:28',
    foreignEntity: '塔什干货运中心',
    foreignEntityEn: 'Tashkent Freight Terminal',
    country: '乌兹别克斯坦',
    countryFlag: '🇺🇿',
    dataType: '集装箱状态',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018867', location: '塔什干', status: '换装中', eventType: '换装' },
    requestPayload: JSON.stringify({ requestId: 'UZ-TAS-4418', platform: 'TITR', containerNo: 'CICU1018867' }, null, 2),
  },
  {
    id: 'EXP-20250606-001',
    requestId: 'KZ-HRG-6620',
    requestedAt: '2025-06-06 09:30:15',
    syncedAt: '2025-06-06 09:31:02',
    foreignEntity: '霍尔果斯口岸（哈方）',
    foreignEntityEn: 'Khorgos Port (KZ Side)',
    country: '哈萨克斯坦',
    countryFlag: '🇰🇿',
    dataType: '报关数据',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018860', customsStatus: '已报关', status: '已过境', location: '霍尔果斯' },
    requestPayload: JSON.stringify({ requestId: 'KZ-HRG-6620', platform: 'TITR', containerNo: 'CICU1018860' }, null, 2),
  },
  {
    id: 'EXP-20250606-002',
    requestId: 'AZ-BAKU-8834',
    requestedAt: '2025-06-06 15:22:40',
    syncedAt: '2025-06-06 15:23:55',
    foreignEntity: 'SOCAR 物流',
    foreignEntityEn: 'SOCAR Logistics',
    country: '阿塞拜疆',
    countryFlag: '🇦🇿',
    dataType: '单证信息',
    syncStatus: 'success',
    syncData: { containerNo: 'MSCU9876543', smgsNo: 'SMGS-2025-88421', eventType: '单证同步', status: '已推送' },
    requestPayload: JSON.stringify({ requestId: 'AZ-BAKU-8834', platform: 'TITR', documents: ['CIPL', 'SMGS'] }, null, 2),
  },
  {
    id: 'EXP-20250605-001',
    requestId: 'GE-TBL-1102',
    requestedAt: '2025-06-05 11:08:19',
    syncedAt: '2025-06-05 11:09:44',
    foreignEntity: '第比利斯陆港',
    foreignEntityEn: 'Tbilisi Dry Port',
    country: '格鲁吉亚',
    countryFlag: '🇬🇪',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'TCLU8899001', location: '第比利斯', status: '到达', eventType: '到达' },
    requestPayload: JSON.stringify({ requestId: 'GE-TBL-1102', platform: 'TITR', containerNo: 'TCLU8899001' }, null, 2),
  },
  {
    id: 'EXP-20250605-002',
    requestId: 'TR-MAR-5521',
    requestedAt: '2025-06-05 08:55:07',
    syncedAt: '2025-06-05 08:56:33',
    foreignEntity: '马尔马拉物流联盟',
    foreignEntityEn: 'Marmara Logistics Alliance',
    country: '土耳其',
    countryFlag: '🇹🇷',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'HLCU3344556', waybillNo: 'WB-2026-038901', location: '卡尔斯', status: '过境', eventType: '过境' },
    requestPayload: JSON.stringify({ requestId: 'TR-MAR-5521', platform: 'TITR', containerNo: 'HLCU3344556' }, null, 2),
  },
  {
    id: 'EXP-20250604-001',
    requestId: 'KZ-ATN-7733',
    requestedAt: '2025-06-04 14:40:22',
    syncedAt: '2025-06-04 14:41:08',
    foreignEntity: '阿腾科里换装站',
    foreignEntityEn: 'Altynkol Transshipment Station',
    country: '哈萨克斯坦',
    countryFlag: '🇰🇿',
    dataType: '场站作业',
    syncStatus: 'success',
    syncData: { containerNo: 'CICU1018860', location: '阿腾科里', status: '换装完成', trainNo: 'KZ8802', eventType: '换装' },
    requestPayload: JSON.stringify({ requestId: 'KZ-ATN-7733', platform: 'TITR', containerNo: 'CICU1018860' }, null, 2),
  },
  {
    id: 'EXP-20250604-002',
    requestId: 'UZ-NAV-2290',
    requestedAt: '2025-06-04 09:15:44',
    syncedAt: '2025-06-04 09:16:21',
    foreignEntity: '纳沃伊物流枢纽',
    foreignEntityEn: 'Navoi Logistics Hub',
    country: '乌兹别克斯坦',
    countryFlag: '🇺🇿',
    dataType: '集装箱状态',
    syncStatus: 'success',
    syncData: { containerNo: 'TBJU1234567', location: '纳沃伊', status: '在场', eventType: '进场' },
    requestPayload: JSON.stringify({ requestId: 'UZ-NAV-2290', platform: 'TITR', containerNo: 'TBJU1234567' }, null, 2),
  },
  {
    id: 'EXP-20250603-001',
    requestId: 'AZ-SUM-4455',
    requestedAt: '2025-06-03 17:28:11',
    syncedAt: '2025-06-03 17:29:45',
    foreignEntity: '苏姆盖特港',
    foreignEntityEn: 'Sumgayit Port',
    country: '阿塞拜疆',
    countryFlag: '🇦🇿',
    dataType: '运踪信息',
    syncStatus: 'success',
    syncData: { containerNo: 'MSCU9876543', location: '苏姆盖特', status: '在港', eventType: '到港' },
    requestPayload: JSON.stringify({ requestId: 'AZ-SUM-4455', platform: 'TITR', containerNo: 'MSCU9876543' }, null, 2),
  },
] as DataExportRecord[]).sort((a, b) => {
  const timeA = a.syncedAt ?? a.requestedAt
  const timeB = b.syncedAt ?? b.requestedAt
  return new Date(timeB).getTime() - new Date(timeA).getTime()
})

export function syncStatusLabel(status: SyncStatus) {
  switch (status) {
    case 'success':
      return '同步成功'
    case 'pending':
      return '同步中'
    case 'failed':
      return '同步失败'
  }
}

export function payloadFieldLabel(key: string) {
  const labels: Record<string, string> = {
    containerNo: '集装箱号',
    waybillNo: '运单号',
    smgsNo: 'SMGS号',
    eventType: '事件类型',
    location: '位置',
    status: '状态',
    customsStatus: '报关状态',
    trainNo: '车次',
  }
  return labels[key] ?? key
}

export function formatSyncDataSummary(data: SyncData) {
  const parts: string[] = []
  if (data.containerNo) parts.push(data.containerNo)
  if (data.location) parts.push(data.location)
  if (data.status) parts.push(data.status)
  return parts.join(' · ') || '—'
}

export function recordSortTime(record: DataExportRecord) {
  return record.syncedAt ?? record.requestedAt
}
