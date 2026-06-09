import type { TrackingEvent, TrainRecord } from '../types/freight'

function eventTypeLabel(type: TrackingEvent['type']) {
  return type === 'arrival' ? '到达' : '出发'
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildCsvContent(train: TrainRecord) {
  const headers = ['班列号', '集装箱号', '运单号', 'SMGS号', '时间', '地点', '状态', '事件类型']
  const containerSummary = train.containers.map((c) => c.container).join('; ')
  const rows = train.detail.trackingHistory.map((event) => [
    train.trainNo,
    containerSummary,
    train.containers.map((c) => c.waybillNo).join('; '),
    train.containers.map((c) => c.smgsNo).join('; '),
    event.time,
    event.location,
    event.status,
    eventTypeLabel(event.type),
  ])

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n')
}

export function downloadTrackingHistory(train: TrainRecord) {
  const csv = `\uFEFF${buildCsvContent(train)}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const datePart = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `跟踪历史_${train.trainNo}_${datePart}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
