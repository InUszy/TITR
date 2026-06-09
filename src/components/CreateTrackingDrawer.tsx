import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

interface CreateTrackingDrawerProps {
  open: boolean
  stationOptions: string[]
  onClose: () => void
}

interface ContainerFormEntry {
  id: string
  containerNo: string
  waybillSmgsNo: string
  ciplFile: File | null
  smgsFile: File | null
}

interface FileUploadFieldProps {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  accept?: string
  deleteLabel: string
  uploadHint: string
}

function createEmptyContainer(id: string): ContainerFormEntry {
  return {
    id,
    containerNo: '',
    waybillSmgsNo: '',
    ciplFile: null,
    smgsFile: null,
  }
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
  const nextContainerId = useRef(1)
  const [trainNo, setTrainNo] = useState('')
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')
  const [containers, setContainers] = useState<ContainerFormEntry[]>(() => [
    createEmptyContainer('container-1'),
  ])

  const resetForm = () => {
    nextContainerId.current = 1
    setTrainNo('')
    setDeparture('')
    setArrival('')
    setContainers([createEmptyContainer('container-1')])
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const updateContainer = (id: string, patch: Partial<ContainerFormEntry>) => {
    setContainers((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))
  }

  const addContainer = () => {
    nextContainerId.current += 1
    const id = `container-${nextContainerId.current}`
    setContainers((prev) => [...prev, createEmptyContainer(id)])
  }

  const removeContainer = (id: string) => {
    setContainers((prev) => (prev.length <= 1 ? prev : prev.filter((entry) => entry.id !== id)))
  }

  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={handleClose}>
      <aside className="drawer-panel drawer-panel-wide" onClick={(e) => e.stopPropagation()}>
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
          <div className="drawer-section-label drawer-section-title">{t('createTracking.trainInfo')}</div>

          <div className="drawer-form-row">
            <div className="drawer-field">
              <label className="drawer-label" htmlFor="drawer-train-no">
                <span className="required">*</span> {t('freight.trainNo')}
              </label>
              <input
                id="drawer-train-no"
                type="text"
                className="drawer-input"
                placeholder={t('freight.trainNoPlaceholder')}
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
              />
            </div>
          </div>

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

          <div className="drawer-section-header drawer-containers-header">
            <span className="drawer-section-label">{t('createTracking.containerList')}</span>
            <button type="button" className="drawer-add-container-btn" onClick={addContainer}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t('createTracking.addContainer')}
            </button>
          </div>

          <div className="drawer-containers-list">
            {containers.map((entry, index) => (
              <div key={entry.id} className="drawer-container-block">
                <div className="drawer-container-block-header">
                  <span className="drawer-container-block-title">
                    {t('createTracking.containerIndex', { index: index + 1 })}
                  </span>
                  {containers.length > 1 && (
                    <button
                      type="button"
                      className="drawer-remove-container-btn"
                      onClick={() => removeContainer(entry.id)}
                    >
                      {t('createTracking.removeContainer')}
                    </button>
                  )}
                </div>

                <div className="drawer-form-row">
                  <div className="drawer-field">
                    <label className="drawer-label">
                      <span className="required">*</span> {t('freight.containerNo')}
                    </label>
                    <input
                      type="text"
                      className="drawer-input"
                      placeholder={t('freight.containerNoPlaceholder')}
                      value={entry.containerNo}
                      onChange={(e) => updateContainer(entry.id, { containerNo: e.target.value })}
                    />
                  </div>

                  <div className="drawer-field">
                    <label className="drawer-label">
                      <span className="required">*</span> {t('createTracking.waybillSmgsNo')}
                    </label>
                    <input
                      type="text"
                      className="drawer-input"
                      placeholder={t('createTracking.waybillSmgsPlaceholder')}
                      value={entry.waybillSmgsNo}
                      onChange={(e) => updateContainer(entry.id, { waybillSmgsNo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="drawer-form-row drawer-file-row">
                  <FileUploadField
                    label={t('createTracking.ciplFile')}
                    file={entry.ciplFile}
                    onChange={(file) => updateContainer(entry.id, { ciplFile: file })}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    deleteLabel={t('common.delete')}
                    uploadHint={t('createTracking.uploadHint')}
                  />

                  <FileUploadField
                    label={t('createTracking.smgsFile')}
                    file={entry.smgsFile}
                    onChange={(file) => updateContainer(entry.id, { smgsFile: file })}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    deleteLabel={t('common.delete')}
                    uploadHint={t('createTracking.uploadHint')}
                  />
                </div>
              </div>
            ))}
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
