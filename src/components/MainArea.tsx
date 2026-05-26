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
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-stone-800 bg-stone-950 px-6 py-3 flex items-center justify-between flex-shrink-0">
        {/* Stats */}
        <div className="flex items-center gap-6">
          <Stat label="Base" value={`${baseSize}rem`} />
          <Stat label="Ratio" value={effectiveRatio.toString()} />
          <Stat label="Steps" value={steps.toString()} />
          <Stat label="Range" value={`${scaleSteps[0]?.sizePx.toFixed(0)}–${scaleSteps[scaleSteps.length - 1]?.sizePx.toFixed(0)}px`} />
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-stone-900 p-1 gap-1">
          {(['preview', 'tokens'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
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
      <div className="flex-1 overflow-y-auto p-6">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-600 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-xs font-mono text-amber-400">{value}</span>
    </div>
  )
}
