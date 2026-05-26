import type { ScaleStep } from '../types';
import { contrastRatio, wcagLevel } from '../utils/contrast'

interface ScaleTableProps {
  steps: ScaleStep[]
  displayFont: string
  bodyFont: string
  darkMode: boolean
  previewText: string
}

export function ScaleTable({ steps, displayFont, bodyFont, darkMode, previewText }: ScaleTableProps) {
  const bg = darkMode ? '#1c1917' : '#fafaf9'
  const textColor = darkMode ? '#fafaf9' : '#1c1917'
  const bgHex = darkMode ? '#1c1917' : '#ffffff'
  const textHex = darkMode ? '#fafaf9' : '#1c1917'

  return (
    <div
      className="rounded-xl overflow-hidden border border-stone-800"
      style={{ backgroundColor: bg }}
    >
      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_80px_90px_90px] gap-0 border-b border-stone-800 px-6 py-2">
        <span className="text-xs text-stone-500 font-medium uppercase tracking-widest">Step</span>
        <span className="text-xs text-stone-500 font-medium uppercase tracking-widest">Preview</span>
        <span className="text-xs text-stone-500 font-medium uppercase tracking-widest text-right">Size</span>
        <span className="text-xs text-stone-500 font-medium uppercase tracking-widest text-right">LH</span>
        <span className="text-xs text-stone-500 font-medium uppercase tracking-widest text-right">WCAG</span>
      </div>

      {/* Reversed so largest is at top */}
      {[...steps].reverse().map((step) => {
        const isDisplay = step.size >= 1.5
        const font = isDisplay ? displayFont : bodyFont
        const contrast = contrastRatio(bgHex, textHex)
        const isLarge = step.sizePx >= 18
        const level = wcagLevel(contrast, isLarge)
        const levelColor = level === 'Fail' ? 'text-red-400 bg-red-950' :
          level === 'AA Large' ? 'text-yellow-400 bg-yellow-950' :
          level === 'AA' ? 'text-blue-400 bg-blue-950' : 'text-green-400 bg-green-950'

        return (
          <div
            key={step.name}
            className={`grid grid-cols-[80px_1fr_80px_90px_90px] gap-0 px-6 py-4 items-center border-b border-stone-800/40 last:border-b-0 transition-colors hover:bg-black/10`}
            style={{ color: textColor }}
          >
            {/* Step name */}
            <div className="flex flex-col">
              <span className="font-mono text-xs text-stone-500">{step.name}</span>
              <span className="font-mono text-xs text-stone-600">{step.sizePx.toFixed(0)}px</span>
            </div>

            {/* Preview text */}
            <div className="overflow-hidden">
              <p
                className="truncate leading-tight"
                style={{
                  fontFamily: `'${font}', serif`,
                  fontSize: `${Math.min(step.size, 3.5)}rem`,
                  lineHeight: step.lineHeight,
                  letterSpacing: step.letterSpacing,
                  fontWeight: step.fontWeight,
                }}
              >
                {previewText}
              </p>
            </div>

            {/* Size */}
            <div className="text-right">
              <span className="font-mono text-xs text-stone-400">{step.size}rem</span>
            </div>

            {/* Line height */}
            <div className="text-right">
              <span className="font-mono text-xs text-stone-400">{step.lineHeight}</span>
            </div>

            {/* WCAG badge */}
            <div className="text-right">
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${levelColor}`}>
                {level}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
