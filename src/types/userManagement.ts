export type AuditStatus = 'approved' | 'unregistered' | 'submitted'

export interface ManagedUser {
  id: string
  companyName: string
  companyNameEn: string
  bin: string
  createdAt: string | null
  userStatus: AuditStatus
  fileStatus: AuditStatus
  avatarColor: string
}

export const userManagementMockData: ManagedUser[] = [
  { id: '3026614378388', companyName: '中世003', companyNameEn: 'Zhongshi003', bin: '3026614378388', createdAt: '2023-02-24', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#5aad4a' },
  { id: '3026614378389', companyName: 'test433551@qq.com', companyNameEn: 'test433551@qq.com', bin: '3026614378389', createdAt: null, userStatus: 'unregistered', fileStatus: 'unregistered', avatarColor: '#7eb8da' },
  { id: '3026614378390', companyName: '南京智捷物流科技有限公司', companyNameEn: 'Nanjing Zhide Logistics Technology Co., Ltd.', bin: '91320100MA1XXXXXX1', createdAt: '2023-03-15', userStatus: 'approved', fileStatus: 'submitted', avatarColor: '#e8913a' },
  { id: '3026614378391', companyName: 'Global DTC', companyNameEn: 'Global DTC Ltd.', bin: '91320100MA1XXXXXX2', createdAt: '2023-04-02', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#5aad4a' },
  { id: '3026614378392', companyName: '阿拉木图贸易公司', companyNameEn: 'Almaty Trading Co.', bin: 'KZ123456789012', createdAt: '2023-05-18', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#6b8cce' },
  { id: '3026614378393', companyName: '乌鲁木齐国际物流', companyNameEn: 'Urumqi International Logistics', bin: '91650100MA1XXXXXX3', createdAt: '2023-06-22', userStatus: 'approved', fileStatus: 'submitted', avatarColor: '#c77dff' },
  { id: '3026614378394', companyName: '塔什干货运代理', companyNameEn: 'Tashkent Freight Agency', bin: 'UZ987654321098', createdAt: '2023-07-10', userStatus: 'unregistered', fileStatus: 'unregistered', avatarColor: '#999' },
  { id: '3026614378395', companyName: '霍尔果斯口岸物流', companyNameEn: 'Khorgos Port Logistics', bin: '91654000MA1XXXXXX4', createdAt: '2023-08-05', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#48bfe3' },
  { id: '3026614378396', companyName: 'SZY Trading', companyNameEn: 'SZY Trading LLC', bin: '91320100MA1XXXXXX5', createdAt: '2023-09-12', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#5aad4a' },
  { id: '3026614378397', companyName: 'Gulim Transport', companyNameEn: 'Gulim Transport KZ', bin: 'KZ555666777888', createdAt: '2023-10-01', userStatus: 'approved', fileStatus: 'submitted', avatarColor: '#f4a261' },
  { id: '3026614378398', companyName: '阿克套港务公司', companyNameEn: 'Aktau Port Services', bin: 'KZ111222333444', createdAt: '2023-11-20', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#2a9d8f' },
  { id: '3026614378399', companyName: 'test_user_demo', companyNameEn: 'test_user_demo', bin: '3026614378399', createdAt: null, userStatus: 'unregistered', fileStatus: 'unregistered', avatarColor: '#bbb' },
  { id: '3026614378400', companyName: '中欧班列运营中心', companyNameEn: 'China-Europe Railway Express Center', bin: '91110000MA1XXXXXX6', createdAt: '2024-01-08', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#e63946' },
  { id: '3026614378401', companyName: '哈萨克斯坦铁路物流', companyNameEn: 'Kazakhstan Railway Logistics', bin: 'KZ777888999000', createdAt: '2024-02-14', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#457b9d' },
  { id: '3026614378402', companyName: '乌兹别克斯坦货运', companyNameEn: 'Uzbekistan Cargo Ltd.', bin: 'UZ444555666777', createdAt: '2024-03-25', userStatus: 'approved', fileStatus: 'submitted', avatarColor: '#8338ec' },
  { id: '3026614378403', companyName: 'demo_company_01', companyNameEn: 'demo_company_01', bin: '3026614378403', createdAt: '2024-04-30', userStatus: 'unregistered', fileStatus: 'unregistered', avatarColor: '#aaa' },
  { id: '3026614378404', companyName: '西安自贸港物流', companyNameEn: 'Xi\'an Free Trade Port Logistics', bin: '91610100MA1XXXXXX7', createdAt: '2024-06-18', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#06d6a0' },
  { id: '3026614378405', companyName: '兰州新区国际陆港', companyNameEn: 'Lanzhou New Area International Land Port', bin: '91620100MA1XXXXXX8', createdAt: '2024-08-02', userStatus: 'approved', fileStatus: 'approved', avatarColor: '#118ab2' },
  { id: '3026614378406', companyName: '青岛港多式联运', companyNameEn: 'Qingdao Port Multimodal Transport', bin: '91370200MA1XXXXXX9', createdAt: '2024-09-15', userStatus: 'approved', fileStatus: 'submitted', avatarColor: '#ff6b6b' },
]

export function auditStatusLabel(status: AuditStatus) {
  switch (status) {
    case 'approved':
      return '已审核'
    case 'unregistered':
      return '未注册'
    case 'submitted':
      return '已提交'
  }
}
