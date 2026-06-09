import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from './en'
import { zh, type TranslationTree } from './zh'

export type Locale = 'zh' | 'en'

const LOCALE_STORAGE_KEY = 'dtc-locale'

const catalogs: Record<Locale, TranslationTree> = { zh, en }

function loadLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored === 'en' ? 'en' : 'zh'
}

function resolvePath(tree: TranslationTree, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = tree
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale())

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = resolvePath(catalogs[locale], 'login.title') ?? resolvePath(catalogs.zh, 'login.title') ?? document.title
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const raw = resolvePath(catalogs[locale], key) ?? resolvePath(catalogs.zh, key) ?? key
    if (!params) return raw
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value)),
      raw,
    )
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
