import logoImg from '../assets/logo.png'

import type { AuthUser } from '../types/auth'



export type AppPage = 'users' | 'freight' | 'aggregation' | 'dataExport' | 'dictionaries' | 'logs' | 'files' | 'profile'

export type TrackingView = 'regular' | 'archived'



const SYSTEM_PAGES: AppPage[] = ['users', 'dictionaries', 'logs']



const icons = {

  settings: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <circle cx="12" cy="12" r="3" />

      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />

    </svg>

  ),

  location: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />

      <circle cx="12" cy="10" r="3" />

    </svg>

  ),

  bell: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />

      <path d="M13.73 21a2 2 0 0 1-3.46 0" />

    </svg>

  ),

  logout: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

      <polyline points="16 17 21 12 16 7" />

      <line x1="21" y1="12" x2="9" y2="12" />

    </svg>

  ),

  chevronDown: (

    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <polyline points="6 9 12 15 18 9" />

    </svg>

  ),

  chevronUp: (

    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <polyline points="18 15 12 9 6 15" />

    </svg>

  ),

  aggregation: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <ellipse cx="12" cy="5" rx="9" ry="3" />

      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />

      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />

    </svg>

  ),

  dataExport: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <circle cx="12" cy="12" r="10" />

      <line x1="2" y1="12" x2="22" y2="12" />

      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />

    </svg>

  ),

  files: (

    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

      <polyline points="14 2 14 8 20 8" />

      <line x1="16" y1="13" x2="8" y2="13" />

      <line x1="16" y1="17" x2="8" y2="17" />

    </svg>

  ),

}



interface SidebarProps {

  user: AuthUser

  activePage: AppPage

  onPageChange: (page: AppPage) => void

  trackingView: TrackingView

  onTrackingViewChange: (view: TrackingView) => void

  onLogout: () => void

}



export function Sidebar({

  user,

  activePage,

  onPageChange,

  trackingView,

  onTrackingViewChange,

  onLogout,

}: SidebarProps) {

  const isAdmin = user.role === 'admin'
  const avatarLetter = user.displayName.charAt(0).toUpperCase()

  const freightExpanded = activePage === 'freight'

  const systemExpanded = SYSTEM_PAGES.includes(activePage)



  return (

    <aside className="sidebar">

      <div className="sidebar-logo">

        <img src={logoImg} alt="DTC" className="logo-image" />

      </div>



      <nav className="nav-menu">

        {isAdmin && (
          <>
            <button
              type="button"
              className={`nav-item ${systemExpanded ? 'active' : ''}`}
              onClick={() => onPageChange(systemExpanded ? activePage : 'users')}
            >
              {icons.settings}
              系统管理
              <span className="nav-arrow">{systemExpanded ? icons.chevronUp : icons.chevronDown}</span>
            </button>
            {systemExpanded && (
              <div className="nav-sub">
                <button
                  type="button"
                  className={`nav-sub-item ${activePage === 'users' ? 'active' : ''}`}
                  onClick={() => onPageChange('users')}
                >
                  用户管理
                </button>
                <button
                  type="button"
                  className={`nav-sub-item ${activePage === 'dictionaries' ? 'active' : ''}`}
                  onClick={() => onPageChange('dictionaries')}
                >
                  字典管理
                </button>
                <button
                  type="button"
                  className={`nav-sub-item ${activePage === 'logs' ? 'active' : ''}`}
                  onClick={() => onPageChange('logs')}
                >
                  日志管理
                </button>
              </div>
            )}
          </>
        )}

        <button
          type="button"
          className={`nav-item ${activePage === 'files' ? 'active' : ''}`}
          onClick={() => onPageChange('files')}
        >
          {icons.files}
          文件管理
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              className={`nav-item ${activePage === 'dataExport' ? 'active' : ''}`}
              onClick={() => onPageChange('dataExport')}
            >
              {icons.dataExport}
              数据出境
            </button>

            <button
              type="button"
              className={`nav-item ${activePage === 'aggregation' ? 'active' : ''}`}
              onClick={() => onPageChange('aggregation')}
            >
              {icons.aggregation}
              数据汇聚
            </button>
          </>
        )}

        <button

          type="button"

          className={`nav-item ${activePage === 'freight' ? 'active' : ''}`}

          onClick={() => onPageChange('freight')}

        >

          {icons.location}

          货运追踪

          <span className="nav-arrow">{freightExpanded ? icons.chevronUp : icons.chevronDown}</span>

        </button>

        {freightExpanded && (

          <div className="nav-sub">

            <button

              type="button"

              className={`nav-sub-item ${trackingView === 'regular' ? 'active' : ''}`}

              onClick={() => {

                onPageChange('freight')

                onTrackingViewChange('regular')

              }}

            >

              常规

            </button>

            <button

              type="button"

              className={`nav-sub-item ${trackingView === 'archived' ? 'active' : ''}`}

              onClick={() => {

                onPageChange('freight')

                onTrackingViewChange('archived')

              }}

            >

              已归档

            </button>

          </div>

        )}

      </nav>



      <div className="sidebar-footer">

        <button type="button" className="nav-item">

          {icons.bell}

          消息中心

        </button>



        <button type="button" className="nav-item lang-item">

          <span className="lang-flag">🇨🇳</span>

          中文

          <span className="nav-arrow">{icons.chevronDown}</span>

        </button>



        <button type="button" className="nav-item" onClick={onLogout}>

          {icons.logout}

          退出登录

        </button>



        <button
          type="button"
          className={`user-profile ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => onPageChange('profile')}
        >
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <span className="user-role">{user.roleLabel}</span>
          </div>
        </button>

      </div>

    </aside>

  )

}

