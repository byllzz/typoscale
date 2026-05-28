import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import type { ScaleStep, OutputFormat } from '../types';

import { generateTokens, getLanguage } from '../utils/tokenGenerators'
import { useClipboard } from '../hooks/useClipboard';
import { useStore } from '../store/useStore'
import { Box, Clipboard, TextIcon } from 'lucide-react'

interface TokenOutputProps {
  steps: ScaleStep[]
}

const FORMAT_TABS: { id: OutputFormat; label: string; badge?: string }[] = [
  { id: 'css', label: 'CSS Variables' },
  { id: 'tailwind-v3', label: 'Tailwind v3' },
  { id: 'tailwind-v4', label: 'Tailwind v4', badge: 'new' },
  { id: 'json', label: 'Style Dictionary' },
]

export function TokenOutput({ steps }: TokenOutputProps) {
  const { displayFont, bodyFont, monoFont, outputFormat, setOutputFormat, darkMode } = useStore()
  const { copy } = useClipboard() // Removed 'copied' since it's not used
  const [copyAllCopied, setCopyAllCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const tokenString = generateTokens({
    steps,
    displayFont,
    bodyFont,
    monoFont,
    format: outputFormat,
  })

  const language = getLanguage(outputFormat)

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.textContent = tokenString
      Prism.highlightElement(codeRef.current)
    }
  }, [tokenString, language])

  const handleCopyAll = async () => {
    await copy(tokenString)
    setCopyAllCopied(true)
    setTimeout(() => setCopyAllCopied(false), 2000)
  }

  return (
    /*  height calculations  with h-full w-full */
    <div className={`rounded-xl overflow-hidden border flex flex-col transition-colors duration-300 h-full w-full ${
      darkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'
    }`}>
      {/* Format tabs - Fixed header */}
      <div className={`flex flex-wrap items-center justify-between border-b transition-colors duration-300 flex-shrink-0 ${
        darkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'
      }`}>
        <div className="flex flex-wrap">
          {FORMAT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setOutputFormat(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                outputFormat === tab.id
                  ? darkMode
                    ? 'border-amber-500 text-amber-400 bg-stone-900'
                    : 'border-amber-500 text-amber-600 bg-stone-50'
                  : darkMode
                    ? 'border-transparent text-stone-400 hover:text-stone-200'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  darkMode
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Copy All Button */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-0">
          <button
            onClick={handleCopyAll}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              copyAllCopied
                ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                : darkMode
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {copyAllCopied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Copy All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code - Scrollable area */}
      <div className="overflow-auto flex-1 min-h-0">
        <pre className={`p-4 sm:p-6 text-sm leading-relaxed m-0 transition-colors duration-300 ${
          darkMode ? 'bg-transparent' : 'bg-white'
        }`}>
          <code
            ref={codeRef}
            className={`language-${language}`}
          />
        </pre>
      </div>

      {/* Footer info - Fixed bottom */}
      <div className={`border-t px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors duration-300 flex-shrink-0 ${
        darkMode ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className={`flex items-center gap-1.5 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
            <Clipboard size={14} className="flex-shrink-0" />
            <span>{steps.length} steps</span>
          </span>

          <span className={`flex items-center gap-1.5 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
            <TextIcon size={14} className="flex-shrink-0" />
            <span>{displayFont} + {bodyFont}</span>
          </span>

          <span className={`flex items-center gap-1.5 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
            <Box size={14} className="flex-shrink-0" />
            <span>{tokenString.split('\n').length} lines</span>
          </span>
        </div>

        <a
          href="https://github.com/byllzz/typoscale"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs transition-colors duration-200 flex items-center gap-1 ${
            darkMode ? 'text-stone-500 hover:text-stone-400' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  )
}
