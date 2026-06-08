import type { FreightRecord, TrackingEvent } from '../types/freight'

function eventTypeLabel(type: TrackingEvent['type']) {
  return type === 'arrival' ? '到达' : '出发'
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildCsvContent(record: FreightRecord) {
  const headers = ['集装箱号', '运单号', 'SMGS号', '时间', '地点', '状态', '事件类型']
  const rows = record.detail.trackingHistory.map((event) => [
    record.container,
    record.waybillNo,
    record.smgsNo,
    event.time,
    event.location,
    event.status,
    eventTypeLabel(event.type),
  ])

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n')
}

export function downloadTrackingHistory(record: FreightRecord) {
  const csv = `\uFEFF${buildCsvContent(record)}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const datePart = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `跟踪历史_${record.container}_${datePart}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
