// /src/types/store.types.ts
import type { ScaleRatio } from './scale'
import type { OutputFormat } from './output'

export interface AppState {
  displayFont: string
  bodyFont: string
  monoFont: string
  baseSize: number
  ratio: ScaleRatio
  customRatio: number
  steps: number
  previewText: string
  darkMode: boolean
  outputFormat: OutputFormat
  activeTab: 'preview' | 'tokens'
}

export interface AppStore extends AppState {
  setDisplayFont: (f: string) => void
  setBodyFont: (f: string) => void
  setMonoFont: (f: string) => void
  setBaseSize: (n: number) => void
  setRatio: (r: ScaleRatio) => void
  setCustomRatio: (n: number) => void
  setSteps: (n: number) => void
  setPreviewText: (t: string) => void
  setDarkMode: (b: boolean) => void
  setOutputFormat: (f: OutputFormat) => void
  setActiveTab: (t: 'preview' | 'tokens') => void
}
