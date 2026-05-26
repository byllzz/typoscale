import { useState, useRef, useEffect } from 'react'


import type { GoogleFont, FontCategory } from '../types';

import { useFonts, loadGoogleFont } from '../hooks/useFonts'

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
      <label className="block text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-left hover:border-amber-500/50 transition-colors group"
        style={{ fontFamily: `'${value}', serif` }}
      >
        <span className="text-stone-100 truncate text-lg">{value}</span>
        <svg
          className={`w-4 h-4 text-stone-500 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-stone-800">
            <input
              type="text"
              placeholder="Search fonts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 border border-stone-700 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 p-2 border-b border-stone-800 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-amber-500 text-stone-900'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Font list */}
          {loading ? (
            <div className="p-4 text-center text-stone-500 text-sm">Loading fonts…</div>
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
                    className={`w-full text-left px-4 py-3 hover:bg-stone-800 transition-colors flex items-center justify-between group ${
                      value === font.family ? 'bg-stone-800 text-amber-400' : 'text-stone-200'
                    }`}
                  >
                    <span
                      className="text-xl leading-tight truncate"
                      style={{ fontFamily: `'${font.family}', serif` }}
                    >
                      {font.family}
                    </span>
                    <span className="text-xs text-stone-600 ml-2 flex-shrink-0">{font.category}</span>
                  </button>
                </li>
              ))}
              {filteredFonts.length === 0 && (
                <li className="p-4 text-center text-stone-500 text-sm">No fonts found</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
