import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { FontPicker } from './FontPicker'
import { SCALE_RATIOS } from '../types'
import type { ScaleRatio } from '../types'
import favicon from '../../public/favicon.svg'

interface ScaleControlsProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function ScaleControls({ isOpen, onClose, isMobile }: ScaleControlsProps) {
  const {
    displayFont, setDisplayFont,
    bodyFont, setBodyFont,
    monoFont, setMonoFont,
    baseSize, setBaseSize,
    ratio, setRatio,
    customRatio, setCustomRatio,
    steps, setSteps,
    darkMode, setDarkMode,
  } = useStore()

  const scrollRef = useRef<HTMLDivElement>(null)

  //  a plain JSX element variable
  const sidebarContent = (
    <>
      <div className="sticky top-0 z-10 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0">
              <img src={favicon} className="h-full w-full" alt="TypoScale logo" />
            </div>
            <div>
              <h1 className="text-stone-100 font-semibold text-base tracking-tight">TypoScale</h1>
              <p className="text-stone-500 text-xs">Type scale generator</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        {/* Font Pairing */}
        <section>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Font Pairing</h2>
          <div className="space-y-4">
            <FontPicker label="Display / Heading" value={displayFont} onChange={setDisplayFont} />
            <FontPicker label="Body / Paragraph" value={bodyFont} onChange={setBodyFont} />
            <FontPicker label="Monospace / Code" value={monoFont} onChange={setMonoFont} />
          </div>
        </section>

        {/* Scale */}
        <section>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Scale</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-stone-400 uppercase tracking-widest">Base Size</label>
                <span className="text-amber-400 text-sm font-mono">{baseSize}rem</span>
              </div>
              <input
                type="range" min="0.75" max="1.5" step="0.0625"
                value={baseSize} onChange={e => setBaseSize(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">Ratio</label>
              <select
                value={ratio}
                onChange={e => setRatio(e.target.value as ScaleRatio)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 text-sm"
              >
                {Object.entries(SCALE_RATIOS).map(([key, { label, value }]) => (
                  <option key={key} value={key}>{label} {key !== 'custom' ? `(${value})` : ''}</option>
                ))}
              </select>
            </div>

            {ratio === 'custom' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-stone-400 uppercase tracking-widest">Custom Ratio</label>
                  <span className="text-amber-400 text-sm font-mono">{customRatio.toFixed(3)}</span>
                </div>
                <input
                  type="range" min="1.05" max="2.0" step="0.001"
                  value={customRatio} onChange={e => setCustomRatio(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-stone-400 uppercase tracking-widest">Steps</label>
                <span className="text-amber-400 text-sm font-mono">{steps}</span>
              </div>
              <input
                type="range" min="5" max="10" step="1"
                value={steps} onChange={e => setSteps(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Preview</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-400">Dark preview</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-amber-500' : 'bg-stone-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        <section className="border-t border-stone-800 pt-6">
          <ShareButton />
        </section>
      </div>
    </>
  )

  // Desktop: always visible
  if (!isMobile) {
    return (
      <aside className="w-80 flex-shrink-0 bg-stone-950 border-r border-stone-800 flex flex-col h-full overflow-hidden">
        {sidebarContent} {/* Rendered as a variable expression */}
      </aside>
    )
  }

  // Mobile: overlay with slide animation
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300" onClick={onClose} />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-80 bg-stone-950 flex flex-col shadow-2xl
          transition-transform duration-300 ease-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-amber-400 z-20"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent} {/* Rendered as a variable expression */}
      </aside>
    </>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)
  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-700 rounded-lg text-stone-400 text-sm hover:border-amber-500/50 hover:text-amber-400 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      {copied ? 'Copied!' : 'Copy share link'}
    </button>
  )
}
