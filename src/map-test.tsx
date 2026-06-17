import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './i18n/LanguageContext'
import { FreightMapTestPage } from './pages/FreightMapTestPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <FreightMapTestPage />
    </LanguageProvider>
  </StrictMode>,
)
