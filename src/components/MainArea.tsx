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
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0">
      {/* Top bar - responsive wrap */}
      <div className="border-b border-stone-800 bg-stone-950 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        {/* Stats - hide some on mobile */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <Stat label="Base" value={`${baseSize}rem`} />
          <Stat label="Ratio" value={effectiveRatio.toString()} className="hidden xs:flex" />
          <Stat label="Steps" value={steps.toString()} className="hidden sm:flex" />
          <Stat
            label="Range"
            value={`${scaleSteps[0]?.sizePx.toFixed(0)}–${scaleSteps[scaleSteps.length - 1]?.sizePx.toFixed(0)}px`}
            className="hidden md:flex"
          />
        </div>

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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'preview' ? (
          <div className="space-y-6">
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
          <TokenOutput steps={scaleSteps} />
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
