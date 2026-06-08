import type { FreightRecord } from '../types/freight'

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function locationText(location: { city: string } | null) {
  return location?.city ?? '-'
}

function buildCsvContent(records: FreightRecord[]) {
  const headers = [
    '集装箱号',
    '运单号',
    'SMGS号',
    '出发',
    '到达',
    '当前站点',
    '状态',
    '报关状态',
    '车厢号',
    '创建时间',
    '更新时间',
  ]

  const rows = records.map((row) => [
    row.container,
    row.waybillNo,
    row.smgsNo,
    locationText(row.departure),
    locationText(row.arrival),
    locationText(row.currentStation),
    row.status,
    row.customsStatus,
    row.carriageNo,
    row.createdAt,
    row.updatedAt,
  ])

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n')
}

export function downloadFreightRecords(records: FreightRecord[]) {
  const csv = `\uFEFF${buildCsvContent(records)}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const datePart = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `运踪记录_${datePart}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
