import { useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

interface CreateTrackingDrawerProps {
  open: boolean
  stationOptions: string[]
  onClose: () => void
}

interface FileUploadFieldProps {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  accept?: string
  deleteLabel: string
  uploadHint: string
}

function FileUploadField({ label, file, onChange, accept, deleteLabel, uploadHint }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null)
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="drawer-field">
      <label className="drawer-label">
        <span className="required">*</span> {label}
      </label>
      {file ? (
        <div className="file-upload-preview">
          <div className="file-upload-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="file-upload-name">{file.name}</span>
            <span className="file-upload-size">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
          <button type="button" className="file-upload-remove" onClick={handleRemove}>
            {deleteLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="file-upload-zone"
          onClick={() => inputRef.current?.click()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{uploadHint}</span>
          <input
            ref={inputRef}
            type="file"
            className="file-upload-input"
            accept={accept}
            onChange={handleChange}
          />
        </button>
      )}
    </div>
  )
}

export function CreateTrackingDrawer({ open, stationOptions, onClose }: CreateTrackingDrawerProps) {
  const { t } = useLanguage()
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')
  const [containerNo, setContainerNo] = useState('')
  const [smgsNo, setSmgsNo] = useState('')
  const [ciplFile, setCiplFile] = useState<File | null>(null)
  const [smgsFile, setSmgsFile] = useState<File | null>(null)
  const [customsFile, setCustomsFile] = useState<File | null>(null)

  const handleClose = () => {
    onClose()
  }

  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={handleClose}>
      <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button type="button" className="drawer-close" onClick={handleClose} aria-label={t('common.close')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="drawer-title">{t('createTracking.title')}</h2>
        </div>

        <div className="drawer-body">
          <div className="drawer-form-row">
            <div className="drawer-field">
              <label className="drawer-label">
                <span className="required">*</span> {t('freight.departure')}
              </label>
              <div className="drawer-select">
                <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
                  <option value="">{t('createTracking.from')}</option>
                  {stationOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <div className="drawer-field">
              <label className="drawer-label">
                <span className="required">*</span> {t('freight.arrival')}
              </label>
              <div className="drawer-select">
                <select value={arrival} onChange={(e) => setArrival(e.target.value)}>
                  <option value="">{t('createTracking.to')}</option>
                  {stationOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="tracking-form">
            <div className="drawer-field">
              <label className="drawer-label" htmlFor="drawer-container-no">
                <span className="required">*</span> {t('freight.containerNo')}
              </label>
              <input
                id="drawer-container-no"
                type="text"
                className="drawer-input"
                placeholder={t('freight.containerNoPlaceholder')}
                value={containerNo}
                onChange={(e) => setContainerNo(e.target.value)}
              />
            </div>

            <div className="drawer-field">
              <label className="drawer-label" htmlFor="drawer-smgs-no">
                <span className="required">*</span> {t('createTracking.smgsNo')}
              </label>
              <input
                id="drawer-smgs-no"
                type="text"
                className="drawer-input"
                placeholder={t('createTracking.smgsPlaceholder')}
                value={smgsNo}
                onChange={(e) => setSmgsNo(e.target.value)}
              />
            </div>

            <FileUploadField
              label={t('createTracking.ciplFile')}
              file={ciplFile}
              onChange={setCiplFile}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              deleteLabel={t('common.delete')}
              uploadHint={t('createTracking.uploadHint')}
            />

            <FileUploadField
              label={t('createTracking.smgsFile')}
              file={smgsFile}
              onChange={setSmgsFile}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              deleteLabel={t('common.delete')}
              uploadHint={t('createTracking.uploadHint')}
            />

            <FileUploadField
              label={t('createTracking.customsFile')}
              file={customsFile}
              onChange={setCustomsFile}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              deleteLabel={t('common.delete')}
              uploadHint={t('createTracking.uploadHint')}
            />
          </div>
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-cancel" onClick={handleClose}>{t('common.cancel')}</button>
          <button type="button" className="btn-submit">{t('createTracking.send')}</button>
        </div>
      </aside>
    </div>
  )
}
