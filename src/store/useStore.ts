import { create } from 'zustand'
import type { ScaleRatio } from '../types/scale'
import type { OutputFormat } from '../types/output'
import type { AppState, AppStore } from '../types/store.types'
import { initializePresetLibrary } from '../utils/presetManager'

// Theme persistence
const THEME_STORAGE_KEY = 'typoscale-theme'
const ACTIVE_TAB_KEY = 'typoscale-active-tab'

//  tab types matching MainArea layouts
type ActiveTabType = 'preview' | 'responsive' | 'fluid' | 'tokens'

const getInitialDarkMode = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored !== null) {
    return stored === 'dark'
  }
  return false // default to light mode
}

const getInitialActiveTab = (): ActiveTabType => {
  const stored = localStorage.getItem(ACTIVE_TAB_KEY) as ActiveTabType
  if (stored === 'preview' || stored === 'responsive' || stored === 'fluid' || stored === 'tokens') {
    return stored
  }
  return 'preview' // default to preview
}

function encodeState(state: Partial<AppState>): string {
  const params = new URLSearchParams()
  if (state.displayFont) params.set('df', state.displayFont)
  if (state.bodyFont) params.set('bf', state.bodyFont)
  if (state.baseSize !== undefined) params.set('bs', String(state.baseSize))
  if (state.ratio) params.set('r', state.ratio)
  if (state.customRatio !== undefined) params.set('cr', String(state.customRatio))
  if (state.steps !== undefined) params.set('st', String(state.steps))
  return params.toString()
}

function decodeState(): Partial<AppState> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const result: Partial<AppState> = {}
  const df = params.get('df'); if (df) result.displayFont = df
  const bf = params.get('bf'); if (bf) result.bodyFont = bf
  const bs = params.get('bs'); if (bs) result.baseSize = parseFloat(bs)
  const r = params.get('r') as ScaleRatio; if (r) result.ratio = r
  const cr = params.get('cr'); if (cr) result.customRatio = parseFloat(cr)
  const st = params.get('st'); if (st) result.steps = parseInt(st)
  return result
}

const urlState = decodeState()

let urlUpdateTimer: ReturnType<typeof setTimeout> | undefined

function debouncedUpdateURL(state: AppStore) {
  if (urlUpdateTimer) clearTimeout(urlUpdateTimer)
  urlUpdateTimer = setTimeout(() => {
    updateURL(state)
    urlUpdateTimer = undefined
  }, 120)
}

function updateURL(state: AppStore) {
  const qs = encodeState(state)
  const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  window.history.replaceState(null, '', newUrl)
}

// Initialize preset library
initializePresetLibrary()

export const useStore = create<AppStore>((set, get) => ({
  displayFont: urlState.displayFont ?? 'Playfair Display',
  bodyFont: urlState.bodyFont ?? 'Source Sans 3',
  monoFont: 'JetBrains Mono',
  baseSize: urlState.baseSize ?? 1,
  ratio: urlState.ratio ?? 'perfectFourth',
  customRatio: urlState.customRatio ?? 1.333,
  steps: urlState.steps ?? 10,
  previewText: 'The quick brown fox jumps over the lazy dog',
  darkMode: getInitialDarkMode(),
  outputFormat: 'css' as OutputFormat,
  activeTab: getInitialActiveTab(),

  setDisplayFont: (displayFont) => {
    set({ displayFont, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setBodyFont: (bodyFont) => {
    set({ bodyFont, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setMonoFont: (monoFont) => {
    set({ monoFont, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
  },
  setBaseSize: (baseSize) => {
    set({ baseSize, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setRatio: (ratio) => {
    set({ ratio, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setCustomRatio: (customRatio) => {
    set({ customRatio, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setSteps: (steps) => {
    set({ steps, activeTab: 'preview' })
    localStorage.setItem(ACTIVE_TAB_KEY, 'preview')
    debouncedUpdateURL(get())
  },
  setPreviewText: (previewText) => set({ previewText }),
  setDarkMode: (darkMode) => {
    set({ darkMode })
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light')
  },
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setActiveTab: (activeTab) => {
    set({ activeTab })
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab)
  },
}))
