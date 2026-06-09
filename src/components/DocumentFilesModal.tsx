import { useLanguage } from '../i18n/LanguageContext'
import type { CustomsStatus, TrackingFile } from '../types/freight'

interface DocumentFilesModalProps {
  open: boolean
  container: string
  waybillNo: string
  smgsNo: string
  customsStatus: CustomsStatus
  ciplFile: TrackingFile
  smgsFile: TrackingFile
  customsFile: TrackingFile
  onClose: () => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function buildPreviewHtml(
  title: string,
  container: string,
  waybillNo: string,
  smgsNo: string,
  customsStatus: CustomsStatus,
  file: TrackingFile,
) {
  const rows = title === 'CIPL'
    ? [
        ['品名', '电子元器件'],
        ['数量', '120 箱'],
        ['毛重', '2,450 kg'],
        ['净重', '2,380 kg'],
        ['体积', '18.6 m³'],
        ['起运地', '塔什干'],
        ['目的地', '乌鲁木齐'],
      ]
    : title === 'SMGS'
      ? [
          ['运单号', waybillNo],
          ['SMGS号', smgsNo],
          ['集装箱号', container],
          ['发站', '塔什干'],
          ['到站', '乌鲁木齐'],
          ['承运人', '中铁集装箱'],
          ['车号', '55616056'],
          ['货物名称', 'General Cargo'],
        ]
      : [
          ['报关单号', `CUS-${container}`],
          ['运单号', waybillNo],
          ['申报口岸', '霍尔果斯'],
          ['申报日期', file.uploadedAt],
          ['贸易方式', '一般贸易'],
          ['收发货人', 'SZY Trading Co.'],
          ['货物名称', '电子元器件'],
          ['报关状态', customsStatus],
        ]

  const heading = title === 'CIPL'
    ? 'Commercial Invoice & Packing List'
    : title === 'SMGS'
      ? 'SMGS 铁路运单'
      : '中华人民共和国海关出口货物报关单'

  const docNo = title === 'CIPL'
    ? `CIPL-${container}`
    : title === 'SMGS'
      ? smgsNo
      : `CUS-${container}`

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td>${label}</td>
          <td>${value}</td>
        </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      background: #fff;
      padding: 24px;
    }
    h1 {
      font-size: 18px;
      text-align: center;
      margin-bottom: 6px;
      color: #1a5c38;
    }
    .meta {
      text-align: center;
      color: #888;
      font-size: 12px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    td {
      border: 1px solid #ddd;
      padding: 8px 12px;
    }
    td:first-child {
      width: 120px;
      background: #f7f7f7;
      font-weight: 500;
      color: #555;
    }
    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px dashed #ccc;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <h1>${heading}</h1>
  <p class="meta">${file.name} · ${formatFileSize(file.size)} · 上传于 ${file.uploadedAt}</p>
  <table>${tableRows}</table>
  <p class="footer">集装箱号：${container} · 文档编号：${docNo}</p>
</body>
</html>`
}

function downloadPreviewFile(file: TrackingFile, previewHtml: string) {
  const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}

function FilePreviewPane({
  label,
  container,
  waybillNo,
  smgsNo,
  customsStatus,
  file,
  downloadLabel,
}: {
  label: string
  container: string
  waybillNo: string
  smgsNo: string
  customsStatus: CustomsStatus
  file: TrackingFile
  downloadLabel: string
}) {
  const previewHtml = buildPreviewHtml(label, container, waybillNo, smgsNo, customsStatus, file)

  return (
    <div className="doc-preview-pane">
      <div className="doc-preview-pane-header">
        <span className="doc-preview-badge">{label}</span>
        <span className="doc-preview-name">{file.name}</span>
      </div>
      <iframe
        className="doc-preview-frame"
        title={`${label} 文件预览`}
        srcDoc={previewHtml}
        sandbox=""
      />
      <div className="doc-preview-pane-footer">
        <button
          type="button"
          className="doc-preview-download"
          onClick={() => downloadPreviewFile(file, previewHtml)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloadLabel}
        </button>
      </div>
    </div>
  )
}

export function DocumentFilesModal({
  open,
  container,
  waybillNo,
  smgsNo,
  customsStatus,
  ciplFile,
  smgsFile,
  customsFile,
  onClose,
}: DocumentFilesModalProps) {
  const { t } = useLanguage()

  if (!open) return null

  const paneProps = { container, waybillNo, smgsNo, customsStatus }
  const downloadLabel = t('documentModal.download')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel modal-panel-lg modal-panel-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{t('documentModal.title')}</h2>
            <p className="modal-subtitle">{t('freight.container')} {container} · {t('freight.waybillNo')} {waybillNo}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body modal-body-preview modal-body-preview-3">
          <FilePreviewPane label="CIPL" file={ciplFile} downloadLabel={downloadLabel} {...paneProps} />
          <FilePreviewPane label="SMGS" file={smgsFile} downloadLabel={downloadLabel} {...paneProps} />
          <FilePreviewPane label={t('freight.customsDoc')} file={customsFile} downloadLabel={downloadLabel} {...paneProps} />
        </div>
      </div>
    </div>
  )
}
