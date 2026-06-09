import { useState } from 'react'
import { Sidebar, type AppPage, type TrackingView } from './components/Sidebar'
import { LoginPage } from './pages/LoginPage'
import { PersonalCenterPage } from './pages/PersonalCenterPage'
import { DataExportPage } from './pages/DataExportPage'
import { DataAggregationPage } from './pages/DataAggregationPage'
import { FileManagementPage } from './pages/FileManagementPage'
import { FreightTrackingPage } from './pages/FreightTrackingPage'
import { DictionaryManagementPage } from './pages/DictionaryManagementPage'
import { LogManagementPage } from './pages/LogManagementPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { CommandDashboardPage } from './pages/CommandDashboardPage'
import { archivedMockData, mockData } from './types/freight'
import {
  clearStoredUser,
  loadStoredUser,
  storeUser,
  type AuthUser,
  type UserRole,
} from './types/auth'
import './FreightTracking.css'

const USER_ALLOWED_PAGES: AppPage[] = ['freight', 'files', 'profile']

function getDefaultPage(role: UserRole): AppPage {
  return role === 'admin' ? 'command' : 'freight'
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser())
  const [activePage, setActivePage] = useState<AppPage>(() => {
    const storedUser = loadStoredUser()
    return storedUser ? getDefaultPage(storedUser.role) : 'freight'
  })
  const [trackingView, setTrackingView] = useState<TrackingView>('regular')
  const pageData = trackingView === 'regular' ? mockData : archivedMockData

  const handleLogin = (loggedInUser: AuthUser) => {
    storeUser(loggedInUser)
    setUser(loggedInUser)
    setActivePage(getDefaultPage(loggedInUser.role))
  }

  const handleLogout = () => {
    clearStoredUser()
    setUser(null)
  }

  const handlePageChange = (page: AppPage) => {
    if (user?.role !== 'admin' && !USER_ALLOWED_PAGES.includes(page)) return
    setActivePage(page)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  const renderPage = () => {
    if (user.role === 'admin') {
      if (activePage === 'users') return <UserManagementPage />
      if (activePage === 'dictionaries') return <DictionaryManagementPage />
      if (activePage === 'logs') return <LogManagementPage />
      if (activePage === 'dataExport') {
        return <DataExportPage canControlExport />
      }
      if (activePage === 'aggregation') {
        return <DataAggregationPage />
      }
      if (activePage === 'command') {
        return <CommandDashboardPage />
      }
    }

    if (activePage === 'profile') {
      return <PersonalCenterPage user={user} />
    }
    if (activePage === 'files') {
      return <FileManagementPage />
    }

    return (
      <FreightTrackingPage
        key={trackingView}
        data={pageData}
        showDelayRisk={trackingView === 'regular'}
      />
    )
  }

  return (
    <div className="layout">
      <Sidebar
        user={user}
        activePage={activePage}
        onPageChange={handlePageChange}
        trackingView={trackingView}
        onTrackingViewChange={setTrackingView}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
