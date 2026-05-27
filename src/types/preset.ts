export interface TypoScalePreset {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  version: string
  data: {
    displayFont: string
    bodyFont: string
    monoFont: string
    baseSize: number
    ratio: string
    customRatio: number
    steps: number
    darkMode: boolean
    outputFormat: string
  }
}

export interface PresetLibrary {
  presets: TypoScalePreset[]
  lastUpdated: string
}
