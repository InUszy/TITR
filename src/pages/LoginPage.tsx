import { useState } from 'react'
import logoImg from '../assets/logo.png'
import { useLanguage } from '../i18n/LanguageContext'
import { authenticate, type AuthUser } from '../types/auth'
import '../Login.css'

interface LoginPageProps {
  onLogin: (user: AuthUser) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t, locale, setLocale } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError(t('login.errorEmpty'))
      return
    }

    setSubmitting(true)
    const user = authenticate(username.trim(), password)
    setSubmitting(false)

    if (!user) {
      setError(t('login.errorInvalid'))
      return
    }

    onLogin(user)
  }

  return (
    <div className="login-page">
      <div className="login-lang-switch">
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
          EN
        </button>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <img src={logoImg} alt="DTC" />
        </div>

        <h1 className="login-title">{t('login.title')}</h1>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="username">{t('login.username')}</label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder={t('login.usernamePlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>

        <div className="login-hint">
          <p className="login-hint-title">{t('login.hintTitle')}</p>
          <p>{t('login.hintAdmin')}</p>
          <p>{t('login.hintUser')}</p>
        </div>
      </div>
    </div>
  )
}
