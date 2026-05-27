import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import {
  savePreset,
  deletePreset,
  getPresetLibrary,
  loadPreset,
  exportPresetAsFile,
  importPresetFromFile,
  initializePresetLibrary
} from '../utils/presetManager'
import type { TypoScalePreset } from '../types/preset'

interface PresetManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function PresetManager({ isOpen, onClose }: PresetManagerProps) {
  const [presets, setPresets] = useState<TypoScalePreset[]>([])
  const [presetName, setPresetName] = useState('')
  const [presetDescription, setPresetDescription] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const store = useStore()

  useEffect(() => {
    if (isOpen) {
      loadPresets()
    }
  }, [isOpen])

  const loadPresets = () => {
    initializePresetLibrary()
    const library = getPresetLibrary()
    setPresets(library.presets)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      showMessage('error', 'Please enter a preset name')
      return
    }

    const preset = savePreset(presetName, presetDescription, store)
    setPresetName('')
    setPresetDescription('')
    loadPresets()
    showMessage('success', `Preset "${preset.name}" saved!`)
  }

  const handleLoadPreset = (preset: TypoScalePreset) => {
    const data = preset.data
    store.setDisplayFont(data.displayFont)
    store.setBodyFont(data.bodyFont)
    store.setMonoFont(data.monoFont)
    store.setBaseSize(data.baseSize)
    store.setRatio(data.ratio as any)
    store.setCustomRatio(data.customRatio)
    store.setSteps(data.steps)
    store.setDarkMode(data.darkMode)
    store.setOutputFormat(data.outputFormat as any)
    showMessage('success', `Loaded "${preset.name}"`)
    onClose()
  }

  const handleDeletePreset = (id: string, name: string) => {
    if (confirm(`Delete preset "${name}"?`)) {
      deletePreset(id)
      loadPresets()
      showMessage('success', `Deleted "${name}"`)
    }
  }

  const handleExportPreset = (preset: TypoScalePreset) => {
    exportPresetAsFile(preset)
    showMessage('success', `Exported "${preset.name}"`)
  }

  const handleImportPreset = async (file: File) => {
    try {
      const preset = await importPresetFromFile(file)
      // Check if preset with same ID exists
      const existing = presets.find(p => p.id === preset.id)
      if (existing) {
        if (!confirm(`Preset "${preset.name}" already exists. Overwrite?`)) {
          return
        }
        deletePreset(preset.id)
      }
      savePreset(preset.name, preset.description || '', preset.data as any)
      loadPresets()
      showMessage('success', `Imported "${preset.name}"`)
    } catch (error) {
      showMessage('error', 'Failed to import preset')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-2xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl transition-all duration-300"
        style={{ backgroundColor: store.darkMode ? '#1c1917' : '#ffffff' }}>

        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${
          store.darkMode ? 'border-stone-800' : 'border-stone-200'
        }`}>
          <div>
            <h2 className={`text-lg font-semibold ${store.darkMode ? 'text-stone-100' : 'text-stone-800'}`}>
              Preset Manager
            </h2>
            <p className={`text-xs mt-1 ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
              Save, load, and manage your typography scales
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${store.darkMode ? 'hover:bg-stone-800' : 'hover:bg-stone-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Save new preset */}
          <div className={`mb-6 p-4 rounded-lg ${store.darkMode ? 'bg-stone-900' : 'bg-stone-50'}`}>
            <h3 className={`text-sm font-medium mb-3 ${store.darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              Save Current Configuration
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Preset name"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-amber-500/50 ${
                  store.darkMode
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-300 text-stone-800'
                }`}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={presetDescription}
                onChange={e => setPresetDescription(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-amber-500/50 ${
                  store.darkMode
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-300 text-stone-800'
                }`}
              />
              <button
                onClick={handleSavePreset}
                className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save Preset
              </button>
            </div>
          </div>

          {/* Import/Export buttons */}
          <div className="flex gap-3 mb-6">
            <label className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              store.darkMode
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}>
              Import Preset
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleImportPreset(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>

          {/* Preset list */}
          <div className="space-y-2">
            <h3 className={`text-sm font-medium mb-3 ${store.darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              Your Presets ({presets.length})
            </h3>
            {presets.length === 0 ? (
              <p className={`text-sm text-center py-8 ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                No presets yet. Save your first preset above!
              </p>
            ) : (
              presets.map(preset => (
                <div
                  key={preset.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    store.darkMode ? 'bg-stone-900 hover:bg-stone-800' : 'bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${store.darkMode ? 'text-stone-200' : 'text-stone-700'}`}>
                      {preset.name}
                    </p>
                    {preset.description && (
                      <p className={`text-xs truncate ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                        {preset.description}
                      </p>
                    )}
                    <p className={`text-xs mt-1 ${store.darkMode ? 'text-stone-600' : 'text-stone-400'}`}>
                      {new Date(preset.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="p-1.5 rounded hover:bg-amber-500/20 text-amber-500 transition-colors"
                      title="Load preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleExportPreset(preset)}
                      className="p-1.5 rounded hover:bg-blue-500/20 text-blue-500 transition-colors"
                      title="Export preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePreset(preset.id, preset.name)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                      title="Delete preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message toast */}
        {message && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </>
  )
}
