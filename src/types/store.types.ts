import type { ScaleRatio } from './scale'
import type { OutputFormat } from './output'

export type ActiveTabType = 'preview' | 'responsive' | 'fluid' | 'tokens'

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
  activeTab: ActiveTabType
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
  setActiveTab: (t: ActiveTabType) => void
}
