import { archivedMockData, mockData, type ContainerRecord, type TrainRecord, type TrackingFile } from './freight'
import { userManagementMockData } from './userManagement'

export type FileCategory =
  | 'avatar'
  | 'company_qualification'
  | 'cipl'
  | 'smgs'
  | 'customs'

export type BlockchainStatus = 'notarized' | 'pending' | 'none'

export interface BlockchainRecord {
  chainName: string
  network: string
  txHash: string
  blockHeight: number
  blockTime: string
  dataHash: string
  contractAddress: string
  notarizedAt: string
  verifier: string
  confirmations: number
}

export interface SystemFileRecord {
  id: string
  name: string
  category: FileCategory
  categoryLabel: string
  size: number
  uploadedAt: string
  ownerName: string
  ownerId: string
  relatedContainer?: string
  relatedWaybill?: string
  avatarColor?: string
  avatarInitial?: string
  blockchainRequired: boolean
  blockchainStatus: BlockchainStatus
  blockchain?: BlockchainRecord
}

export const FILE_CATEGORY_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'avatar', label: '头像' },
  { value: 'company_qualification', label: '公司资质' },
  { value: 'cipl', label: 'CIPL' },
  { value: 'smgs', label: 'SMGS' },
  { value: 'customs', label: '报关单' },
] as const

export const BLOCKCHAIN_STATUS_OPTIONS = [
  { value: '', label: '全部存证状态' },
  { value: 'notarized', label: '已存证' },
  { value: 'pending', label: '存证中' },
  { value: 'none', label: '未存证' },
] as const

const QUALIFICATION_NAMES = [
  '营业执照.pdf',
  '道路运输经营许可证.pdf',
  '企业开户许可证.pdf',
  '海关备案登记证书.pdf',
]

function hashSeed(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function mockDataHash(seed: string) {
  const base = hashSeed(seed).toString(16).padStart(8, '0')
  return `0x${base.repeat(8).slice(0, 64)}`
}

function mockTxHash(seed: string) {
  const base = hashSeed(`${seed}-tx`).toString(16).padStart(8, '0')
  return `0x${base.repeat(8).slice(0, 64)}`
}

function buildBlockchainRecord(fileId: string, uploadedAt: string): BlockchainRecord {
  const blockHeight = 18_420_000 + (hashSeed(fileId) % 50_000)
  return {
    chainName: '长安链 DTC 存证链',
    network: 'DTC-Mainnet',
    txHash: mockTxHash(fileId),
    blockHeight,
    blockTime: uploadedAt,
    dataHash: mockDataHash(fileId),
    contractAddress: '0xDTC7a3f8e2b1c9045d6e7f8091a2b3c4d5e6f7089',
    notarizedAt: uploadedAt,
    verifier: 'DTC 区块链存证节点-01',
    confirmations: 12 + (hashSeed(fileId) % 48),
  }
}

function freightDocRecord(
  train: TrainRecord,
  container: ContainerRecord,
  file: TrackingFile,
  category: 'cipl' | 'smgs' | 'customs',
  categoryLabel: string,
  notarized: boolean,
  pending = false,
): SystemFileRecord {
  const id = `${category}-${train.id}-${container.id}-${container.container}`
  return {
    id,
    name: file.name,
    category,
    categoryLabel,
    size: file.size,
    uploadedAt: file.uploadedAt,
    ownerName: container.company === '-' ? '平台用户' : container.company,
    ownerId: String(train.id),
    relatedContainer: container.container,
    relatedWaybill: container.waybillNo,
    blockchainRequired: true,
    blockchainStatus: pending ? 'pending' : notarized ? 'notarized' : 'none',
    blockchain: notarized || pending ? buildBlockchainRecord(id, file.uploadedAt) : undefined,
  }
}

function buildFreightFiles(trains: TrainRecord[]): SystemFileRecord[] {
  const files: SystemFileRecord[] = []
  let index = 0
  trains.forEach((train) => {
    train.containers.forEach((container) => {
      const notarized = index % 5 !== 4
      const pending = index % 7 === 3 && !notarized
      files.push(
        freightDocRecord(train, container, container.ciplFile, 'cipl', 'CIPL', notarized, pending),
        freightDocRecord(train, container, container.smgsFile, 'smgs', 'SMGS', notarized || index % 3 === 0, false),
        freightDocRecord(train, container, container.customsFile, 'customs', '报关单', notarized, pending && index % 2 === 0),
      )
      index += 1
    })
  })
  return files
}

function buildUserFiles(): SystemFileRecord[] {
  const files: SystemFileRecord[] = []

  userManagementMockData.forEach((user, index) => {
    if (user.userStatus === 'unregistered') return

    const initial = user.companyName.charAt(0).toUpperCase()
    files.push({
      id: `avatar-${user.id}`,
      name: `${user.companyName}-头像.png`,
      category: 'avatar',
      categoryLabel: '头像',
      size: 48_576 + index * 1024,
      uploadedAt: user.createdAt ? `${user.createdAt} 09:00:00` : '2024-01-01 09:00:00',
      ownerName: user.companyName,
      ownerId: user.id,
      avatarColor: user.avatarColor,
      avatarInitial: initial,
      blockchainRequired: false,
      blockchainStatus: 'none',
    })

    if (user.fileStatus === 'unregistered') return

    const qualCount = user.fileStatus === 'approved' ? 3 : 2
    for (let i = 0; i < qualCount; i += 1) {
      const fileName = QUALIFICATION_NAMES[i] ?? `资质文件-${i + 1}.pdf`
      files.push({
        id: `qual-${user.id}-${i}`,
        name: `${user.companyName}-${fileName}`,
        category: 'company_qualification',
        categoryLabel: '公司资质',
        size: 256_000 + index * 8192 + i * 4096,
        uploadedAt: user.createdAt ? `${user.createdAt} 10:${String(i * 15).padStart(2, '0')}:00` : '2024-01-01 10:00:00',
        ownerName: user.companyName,
        ownerId: user.id,
        avatarColor: user.avatarColor,
        avatarInitial: initial,
        blockchainRequired: false,
        blockchainStatus: 'none',
      })
    }
  })

  return files
}

export const systemFileRecords: SystemFileRecord[] = [
  ...buildUserFiles(),
  ...buildFreightFiles(mockData),
  ...buildFreightFiles(archivedMockData),
].sort(
  (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
)

export function fileCategoryLabel(category: FileCategory) {
  const map: Record<FileCategory, string> = {
    avatar: '头像',
    company_qualification: '公司资质',
    cipl: 'CIPL',
    smgs: 'SMGS',
    customs: '报关单',
  }
  return map[category]
}

export function blockchainStatusLabel(status: BlockchainStatus) {
  switch (status) {
    case 'notarized':
      return '已存证'
    case 'pending':
      return '存证中'
    case 'none':
      return '未存证'
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function truncateHash(hash: string, head = 10, tail = 8) {
  if (hash.length <= head + tail + 3) return hash
  return `${hash.slice(0, head)}...${hash.slice(-tail)}`
}
