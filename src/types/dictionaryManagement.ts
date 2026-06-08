export type DictStatus = 'enabled' | 'disabled'

export interface DictionaryEntry {
  id: string
  dictType: string
  dictTypeLabel: string
  dictCode: string
  dictLabel: string
  dictValue: string
  sortOrder: number
  status: DictStatus
  remark: string
  updatedAt: string
}

export const DICT_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'event_type', label: '事件类型' },
  { value: 'customs_status', label: '报关状态' },
  { value: 'station', label: '站点' },
  { value: 'transport_mode', label: '运输方式' },
  { value: 'risk_level', label: '风险等级' },
] as const

export const dictionaryMockData: DictionaryEntry[] = [
  { id: '1', dictType: 'event_type', dictTypeLabel: '事件类型', dictCode: 'DEPART', dictLabel: '发车', dictValue: 'DEPART', sortOrder: 1, status: 'enabled', remark: '列车/车辆从场站发出', updatedAt: '2025-11-02 10:30:00' },
  { id: '2', dictType: 'event_type', dictTypeLabel: '事件类型', dictCode: 'ARRIVE', dictLabel: '到达', dictValue: 'ARRIVE', sortOrder: 2, status: 'enabled', remark: '到达指定场站或节点', updatedAt: '2025-11-02 10:30:00' },
  { id: '3', dictType: 'event_type', dictTypeLabel: '事件类型', dictCode: 'CUSTOMS_CLEAR', dictLabel: '清关完成', dictValue: 'CUSTOMS_CLEAR', sortOrder: 3, status: 'enabled', remark: '海关放行', updatedAt: '2025-11-05 14:20:00' },
  { id: '4', dictType: 'event_type', dictTypeLabel: '事件类型', dictCode: 'LOAD', dictLabel: '装车', dictValue: 'LOAD', sortOrder: 4, status: 'enabled', remark: '集装箱装车作业', updatedAt: '2025-11-05 14:20:00' },
  { id: '5', dictType: 'event_type', dictTypeLabel: '事件类型', dictCode: 'UNLOAD', dictLabel: '卸车', dictValue: 'UNLOAD', sortOrder: 5, status: 'disabled', remark: '已废弃，请使用 UNLOAD_V2', updatedAt: '2025-12-01 09:00:00' },
  { id: '6', dictType: 'customs_status', dictTypeLabel: '报关状态', dictCode: 'PENDING', dictLabel: '待申报', dictValue: '0', sortOrder: 1, status: 'enabled', remark: '', updatedAt: '2025-10-18 16:45:00' },
  { id: '7', dictType: 'customs_status', dictTypeLabel: '报关状态', dictCode: 'SUBMITTED', dictLabel: '已申报', dictValue: '1', sortOrder: 2, status: 'enabled', remark: '', updatedAt: '2025-10-18 16:45:00' },
  { id: '8', dictType: 'customs_status', dictTypeLabel: '报关状态', dictCode: 'RELEASED', dictLabel: '已放行', dictValue: '2', sortOrder: 3, status: 'enabled', remark: '', updatedAt: '2025-10-18 16:45:00' },
  { id: '9', dictType: 'customs_status', dictTypeLabel: '报关状态', dictCode: 'INSPECTION', dictLabel: '查验中', dictValue: '3', sortOrder: 4, status: 'enabled', remark: '需人工查验', updatedAt: '2025-11-20 11:10:00' },
  { id: '10', dictType: 'station', dictTypeLabel: '站点', dictCode: 'XIAN', dictLabel: '西安', dictValue: 'XIAN', sortOrder: 1, status: 'enabled', remark: '国内始发节点', updatedAt: '2025-09-01 08:00:00' },
  { id: '11', dictType: 'station', dictTypeLabel: '站点', dictCode: 'KHORGOS', dictLabel: '霍尔果斯', dictValue: 'KHORGOS', sortOrder: 2, status: 'enabled', remark: '中哈边境口岸', updatedAt: '2025-09-01 08:00:00' },
  { id: '12', dictType: 'station', dictTypeLabel: '站点', dictCode: 'ATENKOLY', dictLabel: '阿腾科里', dictValue: 'ATENKOLY', sortOrder: 3, status: 'enabled', remark: '哈萨克斯坦换装站', updatedAt: '2025-09-01 08:00:00' },
  { id: '13', dictType: 'station', dictTypeLabel: '站点', dictCode: 'AKTAU', dictLabel: '阿克套', dictValue: 'AKTAU', sortOrder: 4, status: 'enabled', remark: '里海港口', updatedAt: '2025-09-01 08:00:00' },
  { id: '14', dictType: 'station', dictTypeLabel: '站点', dictCode: 'BAKU', dictLabel: '巴库', dictValue: 'BAKU', sortOrder: 5, status: 'enabled', remark: '阿塞拜疆港口', updatedAt: '2025-09-01 08:00:00' },
  { id: '15', dictType: 'station', dictTypeLabel: '站点', dictCode: 'POTI', dictLabel: '波季', dictValue: 'POTI', sortOrder: 6, status: 'enabled', remark: '格鲁吉亚港口', updatedAt: '2025-09-01 08:00:00' },
  { id: '16', dictType: 'station', dictTypeLabel: '站点', dictCode: 'KARS', dictLabel: '卡尔斯', dictValue: 'KARS', sortOrder: 7, status: 'enabled', remark: '土耳其边境站', updatedAt: '2025-09-01 08:00:00' },
  { id: '17', dictType: 'transport_mode', dictTypeLabel: '运输方式', dictCode: 'RAIL', dictLabel: '铁路', dictValue: 'RAIL', sortOrder: 1, status: 'enabled', remark: '', updatedAt: '2025-08-15 12:00:00' },
  { id: '18', dictType: 'transport_mode', dictTypeLabel: '运输方式', dictCode: 'SEA', dictLabel: '海运', dictValue: 'SEA', sortOrder: 2, status: 'enabled', remark: '', updatedAt: '2025-08-15 12:00:00' },
  { id: '19', dictType: 'transport_mode', dictTypeLabel: '运输方式', dictCode: 'ROAD', dictLabel: '公路', dictValue: 'ROAD', sortOrder: 3, status: 'enabled', remark: '', updatedAt: '2025-08-15 12:00:00' },
  { id: '20', dictType: 'risk_level', dictTypeLabel: '风险等级', dictCode: 'NONE', dictLabel: '无风险', dictValue: '0', sortOrder: 1, status: 'enabled', remark: '预计准点到达', updatedAt: '2025-10-10 09:30:00' },
  { id: '21', dictType: 'risk_level', dictTypeLabel: '风险等级', dictCode: 'LOW', dictLabel: '低风险', dictValue: '1', sortOrder: 2, status: 'enabled', remark: '延迟 1-2 天', updatedAt: '2025-10-10 09:30:00' },
  { id: '22', dictType: 'risk_level', dictTypeLabel: '风险等级', dictCode: 'MEDIUM', dictLabel: '中风险', dictValue: '2', sortOrder: 3, status: 'enabled', remark: '延迟 3-5 天', updatedAt: '2025-10-10 09:30:00' },
  { id: '23', dictType: 'risk_level', dictTypeLabel: '风险等级', dictCode: 'HIGH', dictLabel: '高风险', dictValue: '3', sortOrder: 4, status: 'enabled', remark: '延迟超过 5 天', updatedAt: '2025-10-10 09:30:00' },
]

export function dictStatusLabel(status: DictStatus) {
  return status === 'enabled' ? '启用' : '停用'
}
