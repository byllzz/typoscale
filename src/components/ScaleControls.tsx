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
      <div
        className={`sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300 ${
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
          {/* right - GitHub link */}
          <div className="pr-2">
            <a
              href="https://github.com/byllzz/typoscale"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className={`transition-colors duration-200 ${
                darkMode
                  ? 'text-stone-400 hover:text-amber-400'
                  : 'text-stone-600 hover:text-amber-600'
              }`}
            >
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

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

        <section
          className={`border-t pt-6 transition-colors duration-300 ${
            darkMode ? 'border-stone-800' : 'border-stone-200'
          }`}
        >
          <ShareButton darkMode={darkMode} />
        </section>
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
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 ${
        darkMode
          ? 'border-stone-700 text-stone-400 hover:border-amber-500/50 hover:text-amber-400'
          : 'border-stone-300 text-stone-600 hover:border-amber-500/50 hover:text-amber-600'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      {copied ? 'Copied!' : 'Copy share link'}
    </button>
  )
}
