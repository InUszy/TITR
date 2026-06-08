import { useState } from 'react'
import logoImg from '../assets/logo.png'
import { authenticate, type AuthUser } from '../types/auth'
import '../Login.css'

interface LoginPageProps {
  onLogin: (user: AuthUser) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('请输入用户名和密码')
      return
    }

    setSubmitting(true)
    const user = authenticate(username.trim(), password)
    setSubmitting(false)

    if (!user) {
      setError('用户名或密码错误')
      return
    }

    onLogin(user)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoImg} alt="DTC" />
        </div>

        <h1 className="login-title">货运追踪系统</h1>
        <p className="login-subtitle">请登录以继续</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="login-hint">
          <p className="login-hint-title">演示账号</p>
          <p>管理员：admin / admin123</p>
          <p>普通用户：user / user123</p>
        </div>
      </div>
    </div>
  )
}
