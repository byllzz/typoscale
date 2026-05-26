import { useState, useEffect, useCallback, useRef } from 'react'
import type { GoogleFont, FontCategory } from '../types';


const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_KEY ?? ''
const FONTS_API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`

// Fallback popular fonts when no API key is configured
const FALLBACK_FONTS: GoogleFont[] = [
  { family: 'Playfair Display', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Lora', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Merriweather', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'EB Garamond', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Libre Baskerville', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Cormorant Garamond', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Source Serif 4', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Crimson Text', category: 'serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Source Sans 3', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'IBM Plex Sans', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Nunito', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Outfit', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'DM Sans', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Figtree', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Raleway', category: 'sans-serif', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Fraunces', category: 'display', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Syne', category: 'display', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Bodoni Moda', category: 'display', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Unbounded', category: 'display', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Abril Fatface', category: 'display', variants: ['regular'], subsets: ['latin'] },
  { family: 'Dela Gothic One', category: 'display', variants: ['regular'], subsets: ['latin'] },
  { family: 'Caveat', category: 'handwriting', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Dancing Script', category: 'handwriting', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'JetBrains Mono', category: 'monospace', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Fira Code', category: 'monospace', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'IBM Plex Mono', category: 'monospace', variants: ['regular', '700'], subsets: ['latin'] },
  { family: 'Source Code Pro', category: 'monospace', variants: ['regular', '700'], subsets: ['latin'] },
]

const loadedFonts = new Set<string>()

export function loadGoogleFont(family: string, weights = '400;700') {
  if (loadedFonts.has(family)) return
  loadedFonts.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weights}&display=swap`
  document.head.appendChild(link)
}

export interface UseFontsReturn {
  fonts: GoogleFont[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (s: string) => void
  category: FontCategory
  setCategory: (c: FontCategory) => void
  filteredFonts: GoogleFont[]
  hasApiKey: boolean
}

export function useFonts(): UseFontsReturn {
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearchRaw] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState<FontCategory>('all')
 const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const setSearch = useCallback((s: string) => {
    setSearchRaw(s)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(s), 200)
  }, [])

  useEffect(() => {
    async function fetchFonts() {
      if (!GOOGLE_FONTS_API_KEY) {
        setFonts(FALLBACK_FONTS)
        setLoading(false)
        return
      }
      try {
        const res = await fetch(FONTS_API_URL)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setFonts(data.items as GoogleFont[])
      } catch (e) {
        setError('Could not load Google Fonts. Using fallback list.')
        setFonts(FALLBACK_FONTS)
      } finally {
        setLoading(false)
      }
    }
    fetchFonts()
  }, [])

  const filteredFonts = fonts.filter(f => {
    const matchesSearch = f.family.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesCategory = category === 'all' || f.category === category
    return matchesSearch && matchesCategory
  })

  return {
    fonts,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    filteredFonts,
    hasApiKey: !!GOOGLE_FONTS_API_KEY,
  }
}
