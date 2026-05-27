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

  // Theme-based border colors
  const borderColor = darkMode ? 'border-stone-800' : 'border-stone-200'
  const borderLight = darkMode ? 'border-stone-800/40' : 'border-stone-200/60'

  // Theme-based text colors
  const mutedTextColor = darkMode ? 'text-stone-500' : 'text-stone-400'
  const mutedTextLight = darkMode ? 'text-stone-600' : 'text-stone-500'

  // WCAG badge colors based on theme
  const getBadgeColors = (level: string) => {
    if (level === 'Fail') {
      return darkMode
        ? 'text-red-400 bg-red-950/50'
        : 'text-red-700 bg-red-100'
    } else if (level === 'AA Large') {
      return darkMode
        ? 'text-yellow-400 bg-yellow-950/50'
        : 'text-yellow-700 bg-yellow-100'
    } else if (level === 'AA') {
      return darkMode
        ? 'text-blue-400 bg-blue-950/50'
        : 'text-blue-700 bg-blue-100'
    } else {
      return darkMode
        ? 'text-green-400 bg-green-950/50'
        : 'text-green-700 bg-green-100'
    }
  }

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-300 ${
        darkMode ? 'border-stone-800' : 'border-stone-200 shadow-sm'
      }`}
      style={{ backgroundColor: bg }}
    >
      {/* Table header */}
      <div className={`grid grid-cols-[80px_1fr_80px_90px_90px] gap-0 border-b px-4 sm:px-6 py-3 transition-colors duration-300 ${
        darkMode ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <span className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
          darkMode ? 'text-stone-500' : 'text-stone-400'
        }`}>Step</span>
        <span className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
          darkMode ? 'text-stone-500' : 'text-stone-400'
        }`}>Preview</span>
        <span className={`text-xs font-medium uppercase tracking-widest text-right transition-colors duration-300 ${
          darkMode ? 'text-stone-500' : 'text-stone-400'
        }`}>Size</span>
        <span className={`text-xs font-medium uppercase tracking-widest text-right transition-colors duration-300 ${
          darkMode ? 'text-stone-500' : 'text-stone-400'
        }`}>LH</span>
        <span className={`text-xs font-medium uppercase tracking-widest text-right transition-colors duration-300 ${
          darkMode ? 'text-stone-500' : 'text-stone-400'
        }`}>WCAG</span>
      </div>

      {/* Reversed so largest is at top */}
      {[...steps].reverse().map((step) => {
        const isDisplay = step.size >= 1.5
        const font = isDisplay ? displayFont : bodyFont
        const contrast = contrastRatio(bgHex, textHex)
        const isLarge = step.sizePx >= 18
        const level = wcagLevel(contrast, isLarge)
        const badgeColors = getBadgeColors(level)

        return (
          <div
            key={step.name}
            className={`grid grid-cols-[80px_1fr_80px_90px_90px] gap-0 px-4 sm:px-6 py-4 items-center border-b transition-all duration-200 hover:bg-black/5 last:border-b-0 ${
              darkMode ? 'border-stone-800/40' : 'border-stone-200/60'
            }`}
            style={{ color: textColor }}
          >
            {/* Step name */}
            <div className="flex flex-col gap-0.5">
              <span className={`font-mono text-xs transition-colors duration-300 ${
                darkMode ? 'text-stone-400' : 'text-stone-600'
              }`}>{step.name}</span>
              <span className={`font-mono text-xs transition-colors duration-300 ${
                darkMode ? 'text-stone-600' : 'text-stone-500'
              }`}>{step.sizePx.toFixed(0)}px</span>
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
              <span className={`font-mono text-xs transition-colors duration-300 ${
                darkMode ? 'text-stone-500' : 'text-stone-600'
              }`}>{step.size}rem</span>
            </div>

            {/* Line height */}
            <div className="text-right">
              <span className={`font-mono text-xs transition-colors duration-300 ${
                darkMode ? 'text-stone-500' : 'text-stone-600'
              }`}>{step.lineHeight}</span>
            </div>

            {/* WCAG badge */}
            <div className="text-right">
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded transition-all duration-200 ${badgeColors}`}>
                {level}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
