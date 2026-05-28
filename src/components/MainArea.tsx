import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useTypeScale } from '../hooks/useTypeScale'
import { PreviewPane } from './PreviewPane'
import { TokenOutput } from './TokenOutput'
import { ResponsivePreview } from './ResponsivePreview'
import { FluidExport } from './FluidExport'
import { SCALE_RATIOS } from '../types'
import { PresetManager } from './PresetManager'

export function MainArea() {
  const {
    baseSize, ratio, customRatio, steps,
    darkMode, setDarkMode,
    activeTab, setActiveTab,
  } = useStore()

  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false)
  const scaleSteps = useTypeScale({ baseSize, ratio, customRatio, steps })
  const effectiveRatio = ratio === 'custom' ? customRatio : SCALE_RATIOS[ratio]?.value || 0

  return (
    <main
      className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0 transition-colors duration-300"
      style={{ backgroundColor: darkMode ? '#0c0a09' : '#fafaf9' }}
    >
      {/* Professional Open-Source Repository Style Header */}
      <div className={`border-b px-4 sm:px-6 py-4 flex flex-col gap-4 flex-shrink-0 transition-colors duration-300 ${
        darkMode ? 'border-stone-800 bg-stone-950/40' : 'border-stone-200 bg-white'
      } backdrop-blur-sm`}>

        {/* Upper Header Row: Repo Title Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg className={`w-4 h-4 hidden xs:block ${darkMode ? 'text-stone-500' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div className="flex items-center gap-1.5 text-sm sm:text-base">
              <span className={`font-medium tracking-tight ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>byllzz</span>
              <span className={`${darkMode ? 'text-stone-700' : 'text-stone-300'}`}>/</span>
              <span className={`font-bold tracking-tight ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>typoscale</span>
              <span className={`text-[10px] ml-1.5 px-2 py-0.5 rounded-full font-mono font-medium border ${
                darkMode ? 'bg-stone-900 text-stone-400 border-stone-800' : 'bg-stone-50 text-stone-500 border-stone-200'
              }`}>public</span>
            </div>
          </div>

          {/* Core App Actions Container */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Tabs Styled like Git Tab Selectors */}
            <div className={`flex rounded-lg p-0.5 border ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
              {(['preview', 'responsive', 'fluid', 'tokens'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? darkMode
                        ? 'bg-stone-800 text-amber-400 border border-stone-700/50 shadow-sm'
                        : 'bg-white text-amber-600 border border-stone-200 shadow-sm'
                      : darkMode
                        ? 'text-stone-400 hover:text-stone-200 border border-transparent'
                        : 'text-stone-500 hover:text-stone-800 border border-transparent'
                  }`}
                >
                  {tab === 'responsive' ? 'Responsive' : tab === 'fluid' ? 'Fluid CSS' : tab}
                </button>
              ))}
            </div>

            {/* Presets Button */}
            <button
              onClick={() => setIsPresetManagerOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                darkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-amber-400'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-amber-600'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Presets</span>
            </button>

            {/* Theme Toggle Button */}
            <div
              onClick={() => setDarkMode(!darkMode)}
              className={`group flex items-center font-mono text-[11px] rounded-lg border overflow-hidden cursor-pointer select-none transition-all duration-300 ${
                darkMode
                  ? 'border-stone-800 bg-stone-950 hover:border-amber-500/40'
                  : 'border-stone-200 bg-stone-50 hover:border-amber-500/40'
              }`}
              title="Click to execute environment container rebuild"
            >
              <span className={`px-2 py-1.5 font-bold transition-colors ${
                darkMode ? 'bg-stone-900 text-stone-400 border-r border-stone-800' : 'bg-stone-200 text-stone-600 border-r border-stone-300'
              }`}>
                $ core-sh
              </span>
              <span className={`px-2.5 py-1.5 font-medium transition-all flex items-center gap-1.5 ${
                darkMode ? 'text-amber-400 group-hover:text-amber-300' : 'text-amber-600 group-hover:text-amber-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {darkMode ? '--env-dark' : '--env-light'}
              </span>
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/byllzz/typoscale"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg border transition-all duration-200 ${
                darkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
              aria-label="GitHub repository"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Lower Header Row: Badge Metrics */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800/60">
          <Stat label="base-size" value={`${baseSize}rem`} darkMode={darkMode} />
          <Stat label="scale-ratio" value={effectiveRatio.toFixed(3)} darkMode={darkMode} />
          <Stat label="total-steps" value={steps.toString()} darkMode={darkMode} className="hidden xs:flex" />
          <Stat
            label="rendered-range"
            value={`${scaleSteps[0]?.sizePx?.toFixed(0) || 0}–${scaleSteps[scaleSteps.length - 1]?.sizePx?.toFixed(0) || 0}px`}
            darkMode={darkMode}
            className="hidden sm:flex"
          />
        </div>
      </div>

      {/* Primary Content Target Tabs Area (Fixed p-2! syntax to native !p-2 layout rule) */}
      <div className="flex-1 overflow-hidden !p-2 sm:p-5 flex flex-col min-h-0">
        {activeTab === 'preview' && (
          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
            <PreviewPane steps={scaleSteps} />
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
            <ResponsivePreview steps={scaleSteps} />
          </div>
        )}

        {activeTab === 'fluid' && (
          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
            <FluidExport steps={scaleSteps} />
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="max-w-[1600px] w-full mx-auto flex-1 overflow-y-auto">
            <TokenOutput steps={scaleSteps} />
          </div>
        )}
      </div>

      {/* Preset Manager Modal */}
      <PresetManager
        isOpen={isPresetManagerOpen}
        onClose={() => setIsPresetManagerOpen(false)}
      />
    </main>
  )
}

function Stat({ label, value, className = '', darkMode }: { label: string; value: string; className?: string; darkMode: boolean }) {
  return (
    <div className={`inline-flex items-center rounded-md text-[11px] font-mono border overflow-hidden transition-all shadow-sm ${
      darkMode
        ? 'border-stone-800 bg-stone-900/40 text-stone-300'
        : 'border-stone-200 bg-stone-100/60 text-stone-600'
    } ${className}`}>
      <span className={`px-2 py-0.5 font-medium border-r ${
        darkMode ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-stone-200/60 border-stone-200 text-stone-500'
      }`}>
        {label}
      </span>
      <span className={`px-2 py-0.5 font-bold ${darkMode ? 'text-amber-400' : 'text-amber-400'}`}>
        {value}
      </span>
    </div>
  )
}
