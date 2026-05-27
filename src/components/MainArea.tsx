import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useTypeScale } from '../hooks/useTypeScale'
import { PreviewPane } from './PreviewPane'
import { TokenOutput } from './TokenOutput'
import { SCALE_RATIOS } from '../types'
import { PresetManager } from './PresetManager'

export function MainArea() {
  const {
    // displayFont, bodyFont,
    baseSize, ratio, customRatio, steps,
    darkMode, setDarkMode,
    // previewText,
    activeTab, setActiveTab,
  } = useStore()

  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false)
  const scaleSteps = useTypeScale({ baseSize, ratio, customRatio, steps })
  const effectiveRatio = ratio === 'custom' ? customRatio : SCALE_RATIOS[ratio].value

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0 transition-colors duration-300"
      style={{ backgroundColor: darkMode ? '#0c0a09' : '#fafaf9' }}>

      {/* Top Bar */}
      <div className={`border-b px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 transition-colors duration-300 ${
        darkMode ? 'border-stone-800 bg-stone-950/80' : 'border-stone-200 bg-white/80'
      } backdrop-blur-sm`}>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <Stat label="Base" value={`${baseSize}rem`} darkMode={darkMode} />
          <Stat label="Ratio" value={effectiveRatio.toFixed(3)} darkMode={darkMode} />
          <Stat label="Steps" value={steps.toString()} darkMode={darkMode} className="hidden xs:flex" />
          <Stat
            label="Range"
            value={`${scaleSteps[0]?.sizePx.toFixed(0)}–${scaleSteps[scaleSteps.length - 1]?.sizePx.toFixed(0)}px`}
            darkMode={darkMode}
            className="hidden sm:flex"
          />
        </div>

        {/* Right side: Tabs + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tabs */}
          <div className={`flex rounded-lg p-1 gap-1 ${darkMode ? 'bg-stone-900' : 'bg-stone-100'}`}>
            {(['preview', 'tokens'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-2 py-[2px] rounded-md text-xs sm:text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? darkMode
                      ? 'bg-amber-500 text-white shadow'
                      : 'bg-amber-500 text-white shadow'
                    : darkMode
                      ? 'text-stone-500 hover:text-stone-300'
                      : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Preset Manager Button */}
          <button
            onClick={() => setIsPresetManagerOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:text-amber-400 hover:border-amber-500/50'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-500/50'
            } border`}
            aria-label="Manage presets"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Presets</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-stone-900 border-stone-700 text-amber-400 hover:bg-stone-800'
                : 'bg-stone-100 border-stone-200 text-amber-600 hover:bg-stone-200'
            } border`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
              </svg>
            )}
            <span className="text-xs font-medium hidden sm:inline">
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/byllzz/typoscale"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:text-amber-400 hover:border-amber-500/50'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-500/50'
            } border`}
            aria-label="GitHub repository"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Primary content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-3">
        {activeTab === 'preview' ? (
          <div className="max-w-[1600px] mx-auto">
            <PreviewPane steps={scaleSteps} />
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
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
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-xs uppercase tracking-widest font-medium ${
        darkMode ? 'text-stone-600' : 'text-stone-400'
      }`}>{label}</span>
      <span className={`text-xs font-mono ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{value}</span>
    </div>
  )
}
