import { useCallback, useEffect, useState } from 'react'
import { fetchTrainTrajectory, TrainTrajectoryError } from '../api/trainTrajectory'
import { listMockTrainNumbers } from '../api/mockTrainTrajectory'
import { FreightLinesMap } from '../components/FreightLinesMap'
import { useLanguage } from '../i18n/LanguageContext'
import type { TrainTrajectory } from '../types/trainTrajectory'
import '../FreightMapTest.css'

const DEFAULT_TRAIN_NO = 'XL20260508001'

export function FreightMapTestPage() {
  const { t, locale, setLocale } = useLanguage()
  const [trainNo, setTrainNo] = useState(DEFAULT_TRAIN_NO)
  const [trajectory, setTrajectory] = useState<TrainTrajectory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTrajectory = useCallback(async (queryTrainNo: string) => {
    const normalized = queryTrainNo.trim()
    if (!normalized) {
      setError(t('mapTest.trajectory.trainNoRequired'))
      setTrajectory(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchTrainTrajectory(normalized)
      setTrajectory(data)
    } catch (err) {
      setTrajectory(null)
      if (err instanceof TrainTrajectoryError) {
        setError(err.message)
      } else {
        setError(t('mapTest.trajectory.loadFailed'))
      }
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadTrajectory(DEFAULT_TRAIN_NO)
  }, [loadTrajectory])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    void loadTrajectory(trainNo)
  }

  const mockTrainNumbers = listMockTrainNumbers()

  return (
    <div className="freight-map-test-page">
      <header className="freight-map-test-header">
        <div>
          <h1>{t('mapTest.title')}</h1>
          <p>{t('mapTest.subtitle')}</p>
        </div>
        <div className="freight-map-test-actions">
          {locale === 'en' && (
            <span className="freight-map-test-en-hint">{t('mapTest.trajectory.enLabelHint')}</span>
          )}
          <button
            type="button"
            className={locale === 'zh' ? 'active' : ''}
            onClick={() => setLocale('zh')}
          >
            中文
          </button>
          <button
            type="button"
            className={locale === 'en' ? 'active' : ''}
            onClick={() => setLocale('en')}
          >
            English
          </button>
        </div>
      </header>

      <div className="freight-map-test-toolbar">
        <form className="freight-map-test-query" onSubmit={handleSubmit}>
          <label htmlFor="train-no-input">{t('mapTest.trajectory.trainNo')}</label>
          <input
            id="train-no-input"
            type="text"
            value={trainNo}
            onChange={(event) => setTrainNo(event.target.value)}
            placeholder={t('mapTest.trajectory.trainNoPlaceholder')}
            list="mock-train-numbers"
          />
          <datalist id="mock-train-numbers">
            {mockTrainNumbers.map((no) => (
              <option key={no} value={no} />
            ))}
          </datalist>
          <button type="submit" disabled={loading}>
            {loading ? t('mapTest.trajectory.loading') : t('mapTest.trajectory.query')}
          </button>
        </form>
        {error && <div className="freight-map-test-error">{error}</div>}
        {trajectory && (
          <div className="freight-map-test-summary">
            <div className="freight-map-test-summary-title">
              {t('mapTest.trajectory.summaryTitle', { trainNo: trajectory.trainNo })}
            </div>
            <div className="freight-map-test-stations">
              <div>
                <span>{t('mapTest.trajectory.departure')}</span>
                <strong>{locale === 'en' ? trajectory.departure.nameEn ?? trajectory.departure.name : trajectory.departure.name}</strong>
              </div>
              <div>
                <span>{t('mapTest.trajectory.current')}</span>
                <strong>{locale === 'en' ? trajectory.current.nameEn ?? trajectory.current.name : trajectory.current.name}</strong>
              </div>
              <div>
                <span>{t('mapTest.trajectory.arrival')}</span>
                <strong>{locale === 'en' ? trajectory.arrival.nameEn ?? trajectory.arrival.name : trajectory.arrival.name}</strong>
              </div>
              <div>
                <span>{t('mapTest.trajectory.passedCount')}</span>
                <strong>{trajectory.passedStations.length}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <FreightLinesMap showLegend showTmtmOverlay trajectory={trajectory} />
    </div>
  )
}
