import type { TypoScalePreset } from '../types/preset'
import type { AppState } from '../types/store.types'

const STORAGE_KEY = 'typoscale-presets'
const CURRENT_VERSION = '1.0.0'

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get current state as preset data
export function getCurrentPresetData(state: AppState): TypoScalePreset['data'] {
  return {
    displayFont: state.displayFont,
    bodyFont: state.bodyFont,
    monoFont: state.monoFont,
    baseSize: state.baseSize,
    ratio: state.ratio,
    customRatio: state.customRatio,
    steps: state.steps,
    darkMode: state.darkMode,
    outputFormat: state.outputFormat,
  }
}

// Save preset to library
export function savePreset(name: string, description: string, state: AppState): TypoScalePreset {
  const preset: TypoScalePreset = {
    id: generateId(),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: CURRENT_VERSION,
    data: getCurrentPresetData(state),
  }

  const library = getPresetLibrary()
  library.presets.push(preset)
  library.lastUpdated = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))

  return preset
}

// Update existing preset
export function updatePreset(id: string, state: AppState): TypoScalePreset | null {
  const library = getPresetLibrary()
  const index = library.presets.findIndex(p => p.id === id)

  if (index === -1) return null

  library.presets[index] = {
    ...library.presets[index],
    data: getCurrentPresetData(state),
    updatedAt: new Date().toISOString(),
  }
  library.lastUpdated = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))

  return library.presets[index]
}

// Delete preset
export function deletePreset(id: string): boolean {
  const library = getPresetLibrary()
  const filtered = library.presets.filter(p => p.id !== id)

  if (filtered.length === library.presets.length) return false

  library.presets = filtered
  library.lastUpdated = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))

  return true
}

// Get all presets
export function getPresetLibrary(): { presets: TypoScalePreset[]; lastUpdated: string } {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { presets: [], lastUpdated: new Date().toISOString() }
}

// Load preset by ID
export function loadPreset(id: string): TypoScalePreset | null {
  const library = getPresetLibrary()
  return library.presets.find(p => p.id === id) || null
}

// Export preset as JSON file
export function exportPresetAsFile(preset: TypoScalePreset) {
  const dataStr = JSON.stringify(preset, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `typoscale-${preset.name.toLowerCase().replace(/\s+/g, '-')}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Import preset from JSON file
export function importPresetFromFile(file: File): Promise<TypoScalePreset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const preset = JSON.parse(e.target?.result as string)
        // Validate preset structure
        if (!preset.id || !preset.name || !preset.data) {
          reject(new Error('Invalid preset file format'))
        }
        resolve(preset as TypoScalePreset)
      } catch (error) {
        reject(new Error('Failed to parse preset file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Get default presets (built-in)
export function getDefaultPresets(): TypoScalePreset[] {
  return [
    {
      id: 'default-modern',
      name: 'Modern Web',
      description: 'Clean and readable with perfect harmony',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      data: {
        displayFont: 'Playfair Display',
        bodyFont: 'Source Sans 3',
        monoFont: 'JetBrains Mono',
        baseSize: 1,
        ratio: 'perfectFourth',
        customRatio: 1.333,
        steps: 10,
        darkMode: false,
        outputFormat: 'css',
      },
    },
    {
      id: 'default-minimal',
      name: 'Minimal System',
      description: 'System fonts with classic scale',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      data: {
        displayFont: 'Inter',
        bodyFont: 'system-ui',
        monoFont: 'SF Mono',
        baseSize: 1,
        ratio: 'majorThird',
        customRatio: 1.25,
        steps: 8,
        darkMode: false,
        outputFormat: 'css',
      },
    },
    {
      id: 'default-elegant',
      name: 'Elegant Serif',
      description: 'Classic serif pairing for editorial',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      data: {
        displayFont: 'Cormorant Garamond',
        bodyFont: 'Lora',
        monoFont: 'Fira Code',
        baseSize: 1.125,
        ratio: 'goldenRatio',
        customRatio: 1.618,
        steps: 9,
        darkMode: false,
        outputFormat: 'css',
      },
    },
  ]
}

// Initialize library with default presets if empty
export function initializePresetLibrary() {
  const library = getPresetLibrary()
  if (library.presets.length === 0) {
    library.presets = getDefaultPresets()
    library.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  }
}
