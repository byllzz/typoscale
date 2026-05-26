import { useStore } from '../store/useStore'
import { useTypeScale } from '../hooks/useTypeScale'
import { ScaleTable } from './ScaleTable'
import { PreviewPane } from './PreviewPane'
import { TokenOutput } from './TokenOutput'
import { SCALE_RATIOS } from '../types'

export function MainArea() {
  const {
    displayFont, bodyFont,
    baseSize, ratio, customRatio, steps,
    darkMode, previewText,
    activeTab, setActiveTab,
  } = useStore()

  const scaleSteps = useTypeScale({ baseSize, ratio, customRatio, steps })
  const effectiveRatio = ratio === 'custom' ? customRatio : SCALE_RATIOS[ratio].value

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0 bg-stone-950">

      {/* Top Bar */}
      <div className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <Stat label="Base" value={`${baseSize}rem`} />
          <Stat label="Ratio" value={effectiveRatio.toFixed(3)} />
          <Stat label="Steps" value={steps.toString()} className="hidden xs:flex" />
          <Stat
            label="Range"
            value={`${scaleSteps[0]?.sizePx.toFixed(0)}–${scaleSteps[scaleSteps.length - 1]?.sizePx.toFixed(0)}px`}
            className="hidden sm:flex"
          />
        </div>

        {/* Right side: Tabs + GitHub link */}
        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex rounded-lg bg-stone-900 p-1 gap-1">
            {(['preview', 'tokens'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-stone-700 text-stone-100 shadow'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Static GitHub link */}
          <a
            href="https://github.com/byllzz/typoscale"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-500/50 transition-all group"
            aria-label="GitHub repository"
          >
            <svg className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-stone-400 group-hover:text-amber-400">GitHub</span>
          </a>
        </div>
      </div>

      {/* Primary content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'preview' ? (
          <div className="space-y-6 max-w-[1600px] mx-auto">
            <PreviewPane steps={scaleSteps} />
            <ScaleTable
              steps={scaleSteps}
              displayFont={displayFont}
              bodyFont={bodyFont}
              darkMode={darkMode}
              previewText={previewText}
            />
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
            <TokenOutput steps={scaleSteps} />
          </div>
        )}
      </div>
    </main>
  )
}

function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-stone-600 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-xs font-mono text-amber-400">{value}</span>
    </div>
  )
}
