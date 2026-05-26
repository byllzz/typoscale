import { create } from 'zustand'
import type { ScaleRatio } from '../types/scale'
import type { OutputFormat } from '../types/output'
import type { AppState, AppStore } from '../types/store.types'

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

export const useStore = create<AppStore>((set, get) => ({
  displayFont: urlState.displayFont ?? 'Playfair Display',
  bodyFont: urlState.bodyFont ?? 'Source Sans 3',
  monoFont: 'JetBrains Mono',
  baseSize: urlState.baseSize ?? 1,
  ratio: urlState.ratio ?? 'perfectFourth',
  customRatio: urlState.customRatio ?? 1.333,
  steps: urlState.steps ?? 10,
  previewText: 'The quick brown fox jumps over the lazy dog',
  darkMode: false,
  outputFormat: 'css' as OutputFormat,
  activeTab: 'preview' as const,

  setDisplayFont: (displayFont) => {
    set({ displayFont })
    debouncedUpdateURL(get())
  },
  setBodyFont: (bodyFont) => {
    set({ bodyFont })
    debouncedUpdateURL(get())
  },
  setMonoFont: (monoFont) => set({ monoFont }),
  setBaseSize: (baseSize) => {
    set({ baseSize })
    debouncedUpdateURL(get())
  },
  setRatio: (ratio) => {
    set({ ratio })
    debouncedUpdateURL(get())
  },
  setCustomRatio: (customRatio) => {
    set({ customRatio })
    debouncedUpdateURL(get())
  },
  setSteps: (steps) => {
    set({ steps })
    debouncedUpdateURL(get())
  },
  setPreviewText: (previewText) => set({ previewText }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setActiveTab: (activeTab) => set({ activeTab }),
}))
