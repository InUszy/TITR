import type { TrainRecord } from '../types/freight'

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function locationText(location: { city: string } | null) {
  return location?.city ?? '-'
}

function buildCsvContent(trains: TrainRecord[]) {
  const headers = [
    '班列号',
    '集装箱号',
    '运单号',
    'SMGS号',
    '出发',
    '到达',
    '当前站点',
    '班列状态',
    '报关状态',
    '车厢号',
    '创建时间',
    '更新时间',
  ]

  const rows = trains.flatMap((train) =>
    train.containers.map((row) => [
      train.trainNo,
      row.container,
      row.waybillNo,
      row.smgsNo,
      locationText(train.departure),
      locationText(train.arrival),
      locationText(train.currentStation),
      train.status,
      row.customsStatus,
      train.carriageNo,
      train.createdAt,
      train.updatedAt,
    ]),
  )

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n')
}

export function downloadFreightRecords(trains: TrainRecord[]) {
  const csv = `\uFEFF${buildCsvContent(trains)}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const datePart = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `运踪记录_${datePart}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
