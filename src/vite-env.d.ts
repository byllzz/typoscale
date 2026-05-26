/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_FONTS_KEY: string
  readonly VITE_ANOTHER_API_KEY?: string  // Optional
  readonly VITE_API_URL?: string           // Optional
  // Add more as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
