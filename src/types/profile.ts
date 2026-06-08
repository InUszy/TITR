import type { AuthUser } from './auth'

export type ProfileTab = 'company' | 'documents' | 'apiHistory' | 'switchHistory'

export interface UserProfile {
  companyNameCn: string
  companyNameEn: string
  verified: boolean
  location: string
  email: string
  firstName: string
  lastName: string
  patronymic: string
  workPhone: string
  workEmail: string
  bin: string
  actualRegion: string
  actualPostalCode: string
  actualAddress: string
  sameAsRegistered: boolean
  bankName: string
  swiftCode: string
}

export interface CompanyDocument {
  id: string
  name: string
  status: '已上传' | '待上传'
  uploadedAt: string | null
}

export interface ApiHistoryRecord {
  id: string
  time: string
  endpoint: string
  method: string
  status: number
}

export interface SwitchQueryRecord {
  id: string
  time: string
  queryType: string
  result: string
}

const PROFILE_BY_USER: Record<string, UserProfile> = {
  admin: {
    companyNameCn: '南京智捷物流科技有限公司',
    companyNameEn: 'Nanjing Smart Logistics Technology Co., Ltd.',
    verified: true,
    location: '中国 · 南京',
    email: 'contact@smartchain-logistics.com',
    firstName: '明',
    lastName: '张',
    patronymic: '',
    workPhone: '+86 025 8888 6666',
    workEmail: 'zhang.ming@smartchain-logistics.com',
    bin: '91320100MA1XXXXXX1',
    actualRegion: '中国',
    actualPostalCode: '210000',
    actualAddress: '江苏省南京市建邺区江东中路888号',
    sameAsRegistered: true,
    bankName: '中国工商银行南京分行',
    swiftCode: 'ICBKCNBJNJG',
  },
  user: {
    companyNameCn: '乌鲁木齐国际物流',
    companyNameEn: 'Urumqi International Logistics',
    verified: true,
    location: '中国 · 乌鲁木齐',
    email: 'info@urumqi-logistics.com',
    firstName: '伟',
    lastName: '李',
    patronymic: '',
    workPhone: '+86 991 1234 5678',
    workEmail: 'li.wei@urumqi-logistics.com',
    bin: '91650100MA1XXXXXX3',
    actualRegion: '中国',
    actualPostalCode: '830000',
    actualAddress: '新疆乌鲁木齐市高新区物流大道100号',
    sameAsRegistered: true,
    bankName: '中国银行乌鲁木齐分行',
    swiftCode: 'BKCHCNBJ650',
  },
}

const DOCUMENTS_BY_USER: Record<string, CompanyDocument[]> = {
  admin: [
    { id: '1', name: '营业执照', status: '已上传', uploadedAt: '2024-06-18 10:30:00' },
    { id: '2', name: '道路运输经营许可证', status: '已上传', uploadedAt: '2024-06-18 10:32:00' },
    { id: '3', name: '企业开户许可证', status: '已上传', uploadedAt: '2024-06-19 09:15:00' },
    { id: '4', name: '海关备案登记证书', status: '待上传', uploadedAt: null },
  ],
  user: [
    { id: '1', name: '营业执照', status: '已上传', uploadedAt: '2023-06-22 14:20:00' },
    { id: '2', name: '道路运输经营许可证', status: '已上传', uploadedAt: '2023-06-22 14:25:00' },
  ],
}

const API_HISTORY: ApiHistoryRecord[] = [
  { id: 'API-001', time: '2025-06-08 09:12:34', endpoint: '/api/v1/tracking/query', method: 'GET', status: 200 },
  { id: 'API-002', time: '2025-06-08 08:45:11', endpoint: '/api/v1/containers/status', method: 'POST', status: 200 },
  { id: 'API-003', time: '2025-06-07 16:30:22', endpoint: '/api/v1/customs/release', method: 'GET', status: 200 },
  { id: 'API-004', time: '2025-06-07 11:05:08', endpoint: '/api/v1/documents/upload', method: 'POST', status: 201 },
  { id: 'API-005', time: '2025-06-06 14:18:55', endpoint: '/api/v1/tracking/history', method: 'GET', status: 500 },
]

const SWITCH_HISTORY: SwitchQueryRecord[] = [
  { id: 'SW-001', time: '2025-06-08 10:22:15', queryType: '集装箱状态查询', result: '成功' },
  { id: 'SW-002', time: '2025-06-07 15:40:33', queryType: '运单路由查询', result: '成功' },
  { id: 'SW-003', time: '2025-06-06 09:55:47', queryType: '报关状态查询', result: '成功' },
  { id: 'SW-004', time: '2025-06-05 13:12:08', queryType: '场站作业查询', result: '超时' },
]

export function getProfileForUser(user: AuthUser): UserProfile {
  return PROFILE_BY_USER[user.username] ?? PROFILE_BY_USER.admin
}

export function getDocumentsForUser(user: AuthUser): CompanyDocument[] {
  return DOCUMENTS_BY_USER[user.username] ?? DOCUMENTS_BY_USER.admin
}

export function getApiHistory(): ApiHistoryRecord[] {
  return API_HISTORY
}

export function getSwitchQueryHistory(): SwitchQueryRecord[] {
  return SWITCH_HISTORY
}

export const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'company', label: '公司信息' },
  { id: 'documents', label: '公司文档' },
  { id: 'apiHistory', label: 'API 通讯历史记录' },
  { id: 'switchHistory', label: '交换机查询历史记录' },
]
