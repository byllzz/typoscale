import type { ScaleStep } from '../types';
import { useStore } from '../store/useStore'

interface PreviewPaneProps {
  steps: ScaleStep[]
}

export function PreviewPane({ steps }: PreviewPaneProps) {
  const { displayFont, bodyFont, monoFont, darkMode, previewText, setPreviewText } = useStore()

  const bg = darkMode ? '#0c0a09' : '#fafaf9'
  const fg = darkMode ? '#fafaf9' : '#1c1917'
  const fgMuted = darkMode ? '#a8a29e' : '#57534e'
  const borderColor = darkMode ? '#292524' : '#e7e5e4'

  // Pick representive steps for the editorial layout
  const heroStep = steps[steps.length - 1]
  const h1Step = steps[steps.length - 2] ?? heroStep
  const h2Step = steps[steps.length - 3] ?? h1Step
  const bodyStep = steps.find(s => s.name === 'base') ?? steps[3]
  const smStep = steps.find(s => s.name === 'sm') ?? steps[2]
  const codeStep = steps.find(s => s.name === 'xs') ?? steps[1]

  const displayStyle = (step: ScaleStep, isDisplay = false) => ({
    fontFamily: `'${isDisplay ? displayFont : bodyFont}', ${isDisplay ? 'serif' : 'sans-serif'}`,
    fontSize: `${step.size}rem`,
    lineHeight: step.lineHeight,
    letterSpacing: step.letterSpacing,
    fontWeight: step.fontWeight,
    color: fg,
  })

  const monoStyle = (step: ScaleStep) => ({
    fontFamily: `'${monoFont}', monospace`,
    fontSize: `${step.size}rem`,
    lineHeight: 1.6,
    color: darkMode ? '#78716c' : '#a8a29e',
    background: darkMode ? '#1c1917' : '#f5f5f4',
    padding: '1em',
    borderRadius: '0.5rem',
    display: 'block',
    border: `1px solid ${borderColor}`,
  })

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors duration-300"
      style={{ backgroundColor: bg, color: fg, borderColor: borderColor }}
    >
      {/* Preview text input - responsive: column on small screens */}
      <div className="border-b px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors duration-300" style={{ borderColor }}>
        <label className="text-xs font-medium uppercase tracking-widest flex-shrink-0 transition-colors duration-300" style={{ color: fgMuted }}>
          Sample text
        </label>
        <input
          type="text"
          value={previewText}
          onChange={e => setPreviewText(e.target.value)}
          className="flex-1 w-full sm:w-auto bg-transparent text-sm focus:outline-none min-w-0 placeholder:text-stone-500"
          style={{ color: fg }}
          placeholder="Type your sample text…"
        />
      </div>

      {/* Editorial layout - responsive padding */}
      <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

        {/* Hero heading */}
        <div className="border-b pb-6 sm:pb-8 transition-colors duration-300" style={{ borderColor }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-2 sm:mb-3 transition-colors duration-300" style={{ color: fgMuted }}>
            {heroStep.name} · {heroStep.sizePx.toFixed(0)}px
          </p>
          <h1 style={displayStyle(heroStep, true)}>
            {previewText}
          </h1>
        </div>

        {/* H1 */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2 transition-colors duration-300" style={{ color: fgMuted }}>
            {h1Step.name} · {h1Step.sizePx.toFixed(0)}px
          </p>
          <h2 style={displayStyle(h1Step, true)}>
            The art of readable typography
          </h2>
        </div>

        {/* H2 + body - responsive grid: 1 column on mobile, 2 on larger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2 transition-colors duration-300" style={{ color: fgMuted }}>
              {h2Step.name} · {h2Step.sizePx.toFixed(0)}px
            </p>
            <h3 style={displayStyle(h2Step, true)}>
              A balanced type scale creates visual harmony across every breakpoint
            </h3>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2 transition-colors duration-300" style={{ color: fgMuted }}>
              {bodyStep.name} · {bodyStep.sizePx.toFixed(0)}px (body)
            </p>
            <p style={displayStyle(bodyStep)}>
              Good typography is the silent backbone of every great design. It guides the reader's eye,
              establishes hierarchy, and communicates tone before a single word is consciously processed.
              A well-constructed type scale ensures that every text element — from captions to callouts —
              feels intentionally placed within the larger visual system.
            </p>
          </div>
        </div>

        {/* Small / caption - responsive flex wrap */}
        <div className="border-t pt-5 sm:pt-6 transition-colors duration-300" style={{ borderColor }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-3 transition-colors duration-300" style={{ color: fgMuted }}>
            {smStep.name} · {smStep.sizePx.toFixed(0)}px (caption / label)
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <p className="transition-colors duration-300" style={{ ...displayStyle(smStep), color: fgMuted }}>
              Article published on June 12, 2025 · 5 min read
            </p>
            <p className="transition-colors duration-300" style={{ ...displayStyle(smStep), color: fgMuted }}>
              Category: Typography · Design Systems · Frontend
            </p>
          </div>
        </div>

        {/* Mono code */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3 transition-colors duration-300" style={{ color: fgMuted }}>
            {codeStep.name} · {codeStep.sizePx.toFixed(0)}px (mono)
          </p>
          <code style={monoStyle(codeStep)}>
            {`--font-size-base: ${bodyStep.size}rem;\n--font-size-${h1Step.name}: ${h1Step.size}rem;\n--font-size-${heroStep.name}: ${heroStep.size}rem;`}
          </code>
        </div>

        {/* Full scale strip - horizontal scroll on small screens */}
        <div className="border-t pt-5 sm:pt-6 transition-colors duration-300" style={{ borderColor }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4 transition-colors duration-300" style={{ color: fgMuted }}>
            Full scale
          </p>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="space-y-1 min-w-[280px]">
              {[...steps].reverse().map(step => (
                <div key={step.name} className="flex items-baseline gap-4">
                  <span
                    className="font-mono text-xs w-16 flex-shrink-0 transition-colors duration-300"
                    style={{ color: fgMuted }}
                  >
                    {step.name}
                  </span>
                  <span
                    className="flex-1 truncate transition-colors duration-300"
                    style={{
                      fontFamily: `'${step.size >= 1.5 ? displayFont : bodyFont}', serif`,
                      fontSize: `${Math.min(step.size, 2.5)}rem`,
                      lineHeight: 1.1,
                      letterSpacing: step.letterSpacing,
                      fontWeight: step.fontWeight,
                      color: fg,
                    }}
                  >
                    {previewText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
