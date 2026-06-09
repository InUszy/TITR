export type LogLevel = 'info' | 'warn' | 'error'

export interface SystemLog {
  id: string
  timestamp: string
  level: LogLevel
  module: string
  operator: string
  action: string
  ip: string
  message: string
  durationMs: number | null
}

export const LOG_LEVEL_OPTIONS = [
  { value: '', label: '全部级别' },
  { value: 'info', label: '信息' },
  { value: 'warn', label: '警告' },
  { value: 'error', label: '错误' },
] as const

export const LOG_MODULE_OPTIONS = [
  { value: '', label: '全部模块' },
  { value: '用户管理', label: '用户管理' },
  { value: '字典管理', label: '字典管理' },
  { value: '货运追踪', label: '货运追踪' },
  { value: '数据汇聚', label: '数据汇聚' },
  { value: '系统登录', label: '系统登录' },
] as const

export const logManagementMockData: SystemLog[] = [
  { id: 'LOG-20250608-001', timestamp: '2025-06-08 09:12:34', level: 'info', module: '系统登录', operator: 'admin', action: '用户登录', ip: '192.168.1.105', message: '管理员 admin 登录成功', durationMs: 128 },
  { id: 'LOG-20250608-002', timestamp: '2025-06-08 09:15:02', level: 'info', module: '货运追踪', operator: 'admin', action: '创建跟踪单', ip: '192.168.1.105', message: '创建跟踪单 TRK-20250608001，集装箱号 TBJU1234567', durationMs: 342 },
  { id: 'LOG-20250608-003', timestamp: '2025-06-08 09:22:18', level: 'info', module: '数据汇聚', operator: 'system', action: '接收消息', ip: '10.0.2.15', message: '霍尔果斯节点推送到达事件，消息 ID MSG-HRG-88421 已清洗入库', durationMs: 56 },
  { id: 'LOG-20250608-004', timestamp: '2025-06-08 09:35:47', level: 'warn', module: '数据汇聚', operator: 'system', action: '数据校验', ip: '10.0.2.18', message: '阿腾科里节点原始报文缺少 wagonNo 字段，已使用默认值填充', durationMs: 89 },
  { id: 'LOG-20250608-005', timestamp: '2025-06-08 10:01:03', level: 'info', module: '用户管理', operator: 'admin', action: '审核用户', ip: '192.168.1.105', message: '审核通过用户 南京智捷物流科技有限公司（ID: 3026614378390）', durationMs: 215 },
  { id: 'LOG-20250608-006', timestamp: '2025-06-08 10:18:29', level: 'error', module: '数据汇聚', operator: 'system', action: '消息处理', ip: '10.0.2.22', message: '阿克套节点消息解析失败：JSON 格式错误，原始报文已存入异常队列', durationMs: 12 },
  { id: 'LOG-20250608-007', timestamp: '2025-06-08 10:45:11', level: 'info', module: '字典管理', operator: 'admin', action: '更新字典', ip: '192.168.1.105', message: '更新字典项 event_type/UNLOAD 状态为停用', durationMs: 178 },
  { id: 'LOG-20250608-008', timestamp: '2025-06-08 11:02:56', level: 'info', module: '系统登录', operator: 'user', action: '用户登录', ip: '192.168.1.208', message: '普通用户 user 登录成功', durationMs: 95 },
  { id: 'LOG-20250608-009', timestamp: '2025-06-08 11:20:33', level: 'info', module: '货运追踪', operator: 'user', action: '查看详情', ip: '192.168.1.208', message: '查看跟踪单 TRK-20250512003 详情及路线地图', durationMs: 412 },
  { id: 'LOG-20250608-010', timestamp: '2025-06-08 11:38:07', level: 'warn', module: '货运追踪', operator: 'system', action: '延迟预警', ip: '10.0.1.5', message: '跟踪单 TRK-20250528007 预计延迟 3 天，风险等级：中', durationMs: null },
  { id: 'LOG-20250608-011', timestamp: '2025-06-08 13:05:44', level: 'info', module: '数据汇聚', operator: 'system', action: '接收消息', ip: '10.0.2.31', message: '巴库节点推送装船事件，集装箱号 MSCU9876543', durationMs: 67 },
  { id: 'LOG-20250608-012', timestamp: '2025-06-08 13:22:19', level: 'error', module: '系统登录', operator: 'unknown', action: '登录失败', ip: '203.45.67.89', message: '账号 test 登录失败：密码错误（第 3 次尝试）', durationMs: 45 },
  { id: 'LOG-20250608-013', timestamp: '2025-06-08 14:10:55', level: 'info', module: '字典管理', operator: 'admin', action: '新增字典', ip: '192.168.1.105', message: '新增字典项 customs_status/INSPECTION（查验中）', durationMs: 203 },
  { id: 'LOG-20250608-014', timestamp: '2025-06-08 14:28:30', level: 'info', module: '货运追踪', operator: 'admin', action: '删除跟踪单', ip: '192.168.1.105', message: '删除跟踪单 TRK-20250401002', durationMs: 156 },
  { id: 'LOG-20250608-015', timestamp: '2025-06-08 15:00:12', level: 'warn', module: '数据汇聚', operator: 'system', action: '连接超时', ip: '10.0.2.44', message: '波季节点 15 分钟内未推送心跳，已标记为离线', durationMs: null },
  { id: 'LOG-20250608-016', timestamp: '2025-06-08 15:33:48', level: 'info', module: '用户管理', operator: 'admin', action: '导出数据', ip: '192.168.1.105', message: '导出用户列表，共 19 条记录', durationMs: 892 },
  { id: 'LOG-20250608-017', timestamp: '2025-06-08 16:05:21', level: 'info', module: '数据汇聚', operator: 'system', action: '接收消息', ip: '10.0.2.12', message: '西安节点推送发车事件，车次 X8001，共 42 个集装箱', durationMs: 73 },
  { id: 'LOG-20250608-018', timestamp: '2025-06-08 16:42:07', level: 'error', module: '货运追踪', operator: 'user', action: '上传附件', ip: '192.168.1.208', message: '上传 SMGS 文件失败：文件大小超过 10MB 限制', durationMs: 2340 },
  { id: 'LOG-20250608-019', timestamp: '2025-06-08 17:15:33', level: 'info', module: '系统登录', operator: 'admin', action: '用户登出', ip: '192.168.1.105', message: '管理员 admin 退出登录', durationMs: 18 },
  { id: 'LOG-20250608-020', timestamp: '2025-06-08 17:30:00', level: 'info', module: '数据汇聚', operator: 'system', action: '接收消息', ip: '10.0.2.55', message: '卡尔斯节点推送过境事件，运单号 SMGS-2025-88421', durationMs: 61 },
  { id: 'LOG-20250607-001', timestamp: '2025-06-07 08:30:15', level: 'info', module: '系统登录', operator: 'admin', action: '用户登录', ip: '192.168.1.105', message: '管理员 admin 登录成功', durationMs: 112 },
  { id: 'LOG-20250607-002', timestamp: '2025-06-07 14:22:40', level: 'warn', module: '字典管理', operator: 'admin', action: '批量导入', ip: '192.168.1.105', message: '字典批量导入完成，3 条重复编码已跳过', durationMs: 1456 },
  { id: 'LOG-20250607-003', timestamp: '2025-06-07 18:05:22', level: 'error', module: '数据汇聚', operator: 'system', action: '消息处理', ip: '10.0.2.18', message: '霍尔果斯节点消息重复投递，消息 ID MSG-HRG-88390 已去重', durationMs: 8 },
]

export function logLevelLabel(level: LogLevel) {
  switch (level) {
    case 'info':
      return '信息'
    case 'warn':
      return '警告'
    case 'error':
      return '错误'
  }
}
