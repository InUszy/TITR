/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TIANDITU_TK?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
