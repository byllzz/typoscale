import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import {
  savePreset,
  deletePreset,
  getPresetLibrary,
  exportPresetAsFile,
  importPresetFromFile,
  initializePresetLibrary
} from '../utils/presetManager'
import type { TypoScalePreset } from '../types/preset'
import {
  FolderOpen,
  Save,
  UploadCloud,
  Download,
  Trash2,
  RefreshCw,
  X,
  Sparkles,
  Calendar
} from 'lucide-react'

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
    deletePreset(id)
    loadPresets()
    showMessage('success', `Deleted "${name}"`)
  }

  const handleExportPreset = (preset: TypoScalePreset) => {
    exportPresetAsFile(preset)
    showMessage('success', `Exported "${preset.name}"`)
  }

  const handleImportPreset = async (file: File) => {
    try {
      const preset = await importPresetFromFile(file)
      const existing = presets.find(p => p.id === preset.id)
      if (existing) {
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-md z-50 animate-fade-in" onClick={onClose} />

      {/* Modal Viewport Frame */}
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] md:w-[85vw] max-w-4xl h-[90vh] md:h-[75vh] flex flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300 ${
          store.darkMode ? 'bg-stone-950 border-stone-850' : 'bg-white border-stone-200'
        }`}
      >
        {/* Header Section */}
        <div className={`flex justify-between items-center px-4 sm:px-6 py-4 border-b ${
          store.darkMode ? 'border-stone-900 bg-stone-950' : 'border-stone-100 bg-stone-50/50'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-lg flex-shrink-0 ${store.darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-500/10 text-amber-600'}`}>
              <FolderOpen size={18} />
            </div>
            <div className="min-w-0">
              <h2 className={`text-sm sm:text-base font-bold truncate ${store.darkMode ? 'text-stone-100' : 'text-stone-800'}`}>
                Preset Library
              </h2>
              <p className={`text-[11px] font-medium hidden sm:block truncate ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                Archive structural variables, swap layout steps, and share scaling configurations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border flex-shrink-0 transition-all ${
              store.darkMode
                ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        {/* Layout Body columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

          {/* Action Module Workbench Column */}
          <div className={`w-full md:w-72 p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 overflow-y-auto border-b md:border-b-0 md:border-r flex-shrink-0 ${
            store.darkMode ? 'border-stone-900 bg-stone-950' : 'border-stone-100 bg-stone-50/20'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <h3 className={`text-[10px] font-bold uppercase tracking-wider ${store.darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  Save Active Scale
                </h3>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Preset name"
                  value={presetName}
                  onChange={e => setPresetName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border font-medium focus:outline-none transition-all ${
                    store.darkMode
                      ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500/40'
                      : 'bg-white border-stone-200 text-stone-800 focus:border-amber-500/40'
                  }`}
                />
                <textarea
                  placeholder="Optional descriptions..."
                  value={presetDescription}
                  onChange={e => setPresetDescription(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-xs border font-medium resize-none focus:outline-none transition-all ${
                    store.darkMode
                      ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500/40'
                      : 'bg-white border-stone-200 text-stone-800 focus:border-amber-500/40'
                  }`}
                />
                <button
                  onClick={handleSavePreset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Save size={13} />
                  <span>Save Preset</span>
                </button>
              </div>
            </div>

            <hr className={store.darkMode ? 'border-stone-900' : 'border-stone-100'} />

            {/* Import Area Zone */}
            <div>
              <label className={`group flex items-center md:flex-col justify-center gap-3 md:gap-1.5 p-3.5 rounded-xl border border-dashed text-left md:text-center cursor-pointer transition-all duration-200 ${
                store.darkMode
                  ? 'bg-stone-900/40 border-stone-800 hover:bg-stone-900'
                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50'
              }`}>
                <UploadCloud size={18} className={`flex-shrink-0 transition-colors ${store.darkMode ? 'text-stone-500 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-600'}`} />
                <div className="md:text-center">
                  <span className={`text-xs font-bold block ${store.darkMode ? 'text-stone-300' : 'text-stone-700'}`}>Import JSON File</span>
                  <span className={`text-[10px] block mt-0.5 ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Click to browse configuration files</span>
                </div>
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
          </div>

          {/* Preset Cards Collection Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col min-w-0">
            <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5 ${
              store.darkMode ? 'text-stone-400' : 'text-stone-500'
            }`}>
              <span>Stored Presets</span>
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${store.darkMode ? 'bg-stone-900 text-stone-400' : 'bg-stone-100 text-stone-600'}`}>
                {presets.length}
              </span>
            </h3>

            {presets.length === 0 ? (
              <div className={`flex-1 border border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center ${
                store.darkMode ? 'border-stone-900' : 'border-stone-150'
              }`}>
                <FolderOpen size={24} className={`mb-2 ${store.darkMode ? 'text-stone-700' : 'text-stone-300'}`} />
                <p className={`text-xs font-semibold ${store.darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  No stored configurations found
                </p>
              </div>
            ) : (
              /*  Fluid Layout Grid - Single-column on mobile, two-column on desktop screens */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    className={`group flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                      store.darkMode
                        ? 'bg-stone-900/30 border-stone-900 hover:border-stone-800'
                        : 'bg-stone-50/40 border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    {/* Identity Metadata text */}
                    <div className="min-w-0 mb-2">
                      <p className={`text-xs font-bold truncate transition-colors ${store.darkMode ? 'text-stone-200 group-hover:text-amber-400' : 'text-stone-700 group-hover:text-amber-600'}`}>
                        {preset.name}
                      </p>
                      <p className={`text-[11px] mt-1 line-clamp-2 min-h-[2rem] leading-normal ${store.darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                        {preset.description || 'No descriptive metadata context details provided.'}
                      </p>
                    </div>

                    {/* Responsive Footer Action Matrix Row */}
                    <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t mt-1 ${
                      store.darkMode ? 'border-stone-900/60' : 'border-stone-100'
                    }`}>
                      <span className={`text-[9px] font-mono flex items-center gap-1 ${store.darkMode ? 'text-stone-600' : 'text-stone-400'}`}>
                        <Calendar size={10} className="flex-shrink-0" />
                        <span>{new Date(preset.updatedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      </span>

                      {/* Icon Control Group buttons */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleLoadPreset(preset)}
                          className={`p-1.5 rounded-md transition-colors ${
                            store.darkMode
                              ? 'bg-stone-950 text-stone-400 hover:text-amber-400'
                              : 'bg-white text-stone-500 hover:text-amber-600 border border-stone-100'
                          }`}
                          title="Apply Preset Scale"
                        >
                          <RefreshCw size={11} />
                        </button>
                        <button
                          onClick={() => handleExportPreset(preset)}
                          className={`p-1.5 rounded-md transition-colors ${
                            store.darkMode
                              ? 'bg-stone-950 text-stone-400 hover:text-blue-400'
                              : 'bg-white text-stone-500 hover:text-blue-600 border border-stone-100'
                          }`}
                          title="Download .json file"
                        >
                          <Download size={11} />
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id, preset.name)}
                          className={`p-1.5 rounded-md transition-colors ${
                            store.darkMode
                              ? 'bg-stone-950 text-stone-500 hover:text-red-400'
                              : 'bg-white text-stone-400 hover:text-red-600 border border-stone-100'
                          }`}
                          title="Delete Scale Record"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Toast Popovers */}
        {message && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide shadow-xl transition-all duration-300 flex items-center gap-2 border z-50 ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            {message.text}
          </div>
        )}
      </div>
    </>
  )
}
