import { useState, useRef, useEffect } from 'react'
import type { GoogleFont, FontCategory } from '../types';
import { useFonts, loadGoogleFont } from '../hooks/useFonts'
import { useStore } from '../store/useStore'

const CATEGORIES: { id: FontCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'serif', label: 'Serif' },
  { id: 'sans-serif', label: 'Sans' },
  { id: 'display', label: 'Display' },
  { id: 'handwriting', label: 'Script' },
  { id: 'monospace', label: 'Mono' },
]

interface FontPickerProps {
  label: string
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ label, value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const { filteredFonts, loading, search, setSearch, category, setCategory } = useFonts()
  const { darkMode } = useStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Load current font
  useEffect(() => { loadGoogleFont(value) }, [value])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectFont(font: GoogleFont) {
    loadGoogleFont(font.family)
    onChange(font.family)
    setOpen(false)
  }

  // Preload visible fonts
  function handleVisibleFonts() {
    if (!listRef.current) return
    const items = listRef.current.querySelectorAll('[data-family]')
    items.forEach(item => {
      const family = item.getAttribute('data-family')
      if (family) loadGoogleFont(family)
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-xs font-medium uppercase tracking-widest mb-2 transition-colors duration-300 ${
        darkMode ? 'text-stone-400' : 'text-stone-500'
      }`}>
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 group ${
          darkMode
            ? 'bg-stone-900 border-stone-700 hover:border-amber-500/50'
            : 'bg-white border-stone-300 hover:border-amber-500/50 shadow-sm'
        }`}
        style={{ fontFamily: `'${value}', serif` }}
      >
        <span className={`truncate text-lg transition-colors duration-300 ${
          darkMode ? 'text-stone-100' : 'text-stone-800'
        }`}>{value}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${
            darkMode ? 'text-stone-500' : 'text-stone-400'
          } ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute z-50 top-full mt-2 left-0 right-0 rounded-xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          darkMode
            ? 'bg-stone-900 border border-stone-700 shadow-black/50'
            : 'bg-white border border-stone-200 shadow-xl'
        }`}>
          {/* Search */}
          <div className={`p-3 border-b transition-colors duration-300 ${
            darkMode ? 'border-stone-800' : 'border-stone-100'
          }`}>
            <input
              type="text"
              placeholder="Search fonts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className={`w-full rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${
                darkMode
                  ? 'bg-stone-800 text-stone-100 placeholder-stone-500 border-stone-700 focus:border-amber-500/50'
                  : 'bg-stone-50 text-stone-800 placeholder-stone-400 border-stone-200 focus:border-amber-500/50'
              } border focus:outline-none`}
            />
          </div>

          {/* Category tabs */}
          <div className={`flex gap-1 p-2 border-b overflow-x-auto transition-colors duration-300 ${
            darkMode ? 'border-stone-800' : 'border-stone-100'
          }`}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  category === cat.id
                    ? darkMode
                      ? 'bg-amber-500 text-stone-900'
                      : 'bg-amber-500 text-white'
                    : darkMode
                      ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Font list */}
          {loading ? (
            <div className={`p-4 text-center text-sm transition-colors duration-300 ${
              darkMode ? 'text-stone-500' : 'text-stone-400'
            }`}>Loading fonts…</div>
          ) : (
            <ul
              ref={listRef}
              onScroll={handleVisibleFonts}
              className="max-h-64 overflow-y-auto"
            >
              {filteredFonts.slice(0, 100).map(font => (
                <li key={font.family}>
                  <button
                    data-family={font.family}
                    onClick={() => selectFont(font)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group ${
                      value === font.family
                        ? darkMode
                          ? 'bg-stone-800 text-amber-400'
                          : 'bg-stone-100 text-amber-600'
                        : darkMode
                          ? 'text-stone-200 hover:bg-stone-800'
                          : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="text-xl leading-tight truncate"
                      style={{ fontFamily: `'${font.family}', serif` }}
                    >
                      {font.family}
                    </span>
                    <span className={`text-xs ml-2 flex-shrink-0 transition-colors duration-200 ${
                      darkMode ? 'text-stone-600' : 'text-stone-400'
                    }`}>{font.category}</span>
                  </button>
                </li>
              ))}
              {filteredFonts.length === 0 && (
                <li className={`p-4 text-center text-sm transition-colors duration-300 ${
                  darkMode ? 'text-stone-500' : 'text-stone-400'
                }`}>No fonts found</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
