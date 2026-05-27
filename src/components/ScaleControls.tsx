import { useState, useRef } from 'react'
import { useStore } from '../store/useStore'
import { FontPicker } from './FontPicker'
import { SCALE_RATIOS } from '../types'
import type { ScaleRatio } from '../types'
import logo from '../assets/logo.svg'

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
    darkMode,
  } = useStore()

  const scrollRef = useRef<HTMLDivElement>(null)

  // Sidebar content with theme support
  const sidebarContent = (
    <>
      {/* Fixed Header */}
      <div
        className={`sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300 flex-shrink-0 ${
          darkMode ? 'bg-stone-950/95 border-stone-800' : 'bg-white/95 border-stone-200'
        }`}
      >
        <div className="px-2 py-3 flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-2 relative left-[6px]">
            <div className="w-5.5 h-5.5 relative left-0.5 ">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1
                className={`font-semibold text-base tracking-tight transition-colors duration-300 ${
                  darkMode ? 'text-stone-100' : 'text-stone-800'
                }`}
              >
                TypoScale
              </h1>
            </div>
          </div>
         
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        {/* Font Pairing */}
        <section>
          <h2
            className={`text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-300 ${
              darkMode ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Font Pairing
          </h2>
          <div className="space-y-4">
            <FontPicker label="Display / Heading" value={displayFont} onChange={setDisplayFont} />
            <FontPicker label="Body / Paragraph" value={bodyFont} onChange={setBodyFont} />
            <FontPicker label="Monospace / Code" value={monoFont} onChange={setMonoFont} />
          </div>
        </section>

        {/* Scale */}
        <section>
          <h2
            className={`text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-300 ${
              darkMode ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Scale
          </h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
                    darkMode ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  Base Size
                </label>
                <span className="text-amber-400 text-sm font-mono">{baseSize}rem</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.0625"
                value={baseSize}
                onChange={e => setBaseSize(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label
                className={`block text-xs font-medium uppercase tracking-widest mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                Ratio
              </label>
              <select
                value={ratio}
                onChange={e => setRatio(e.target.value as ScaleRatio)}
                className={`w-full rounded-lg px-3 py-2.5 text-sm transition-colors duration-300 ${
                  darkMode
                    ? 'bg-stone-900 border-stone-700 text-stone-100'
                    : 'bg-stone-100 border-stone-300 text-stone-800'
                } border focus:outline-none focus:border-amber-500/50`}
              >
                {Object.entries(SCALE_RATIOS).map(([key, { label, value }]) => (
                  <option key={key} value={key}>
                    {label} {key !== 'custom' ? `(${value})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {ratio === 'custom' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
                      darkMode ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    Custom Ratio
                  </label>
                  <span className="text-amber-400 text-sm font-mono">{customRatio.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="1.05"
                  max="2.0"
                  step="0.001"
                  value={customRatio}
                  onChange={e => setCustomRatio(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
                    darkMode ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  Steps
                </label>
                <span className="text-amber-400 text-sm font-mono">{steps}</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="1"
                value={steps}
                onChange={e => setSteps(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Footer with Share Button */}
      <div
        className={`border-t px-5 py-4 transition-colors duration-300 flex-shrink-0 ${
          darkMode ? 'border-stone-800' : 'border-stone-200'
        }`}
      >
        <ShareButton darkMode={darkMode} />
      </div>
    </>
  );

  // Desktop: always visible
  if (!isMobile) {
    return (
      <aside className={`w-80 flex-shrink-0 border-r flex flex-col h-full overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'
      }`}>
        {sidebarContent}
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
          fixed top-0 left-0 z-50 h-full w-80 flex flex-col shadow-2xl
          transition-transform duration-300 ease-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${darkMode ? 'bg-stone-950' : 'bg-white'}
        `}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors duration-200 z-20 ${
            darkMode ? 'text-stone-400 hover:text-amber-400' : 'text-stone-600 hover:text-amber-600'
          }`}
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}

function ShareButton({ darkMode }: { darkMode: boolean }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        copied
          ? 'bg-green-500/20 text-green-500 border border-green-500/50'
          : darkMode
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
            : 'bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Copy Share Link
        </>
      )}
    </button>
  )
}
