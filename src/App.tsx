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
import { archivedMockData, mockData } from './types/freight'
import {
  clearStoredUser,
  loadStoredUser,
  storeUser,
  type AuthUser,
} from './types/auth'
import './FreightTracking.css'

const USER_ALLOWED_PAGES: AppPage[] = ['freight', 'files', 'profile']

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser())
  const [activePage, setActivePage] = useState<AppPage>('freight')
  const [trackingView, setTrackingView] = useState<TrackingView>('regular')
  const pageData = trackingView === 'regular' ? mockData : archivedMockData

  const handleLogin = (loggedInUser: AuthUser) => {
    storeUser(loggedInUser)
    setUser(loggedInUser)
    setActivePage('freight')
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
