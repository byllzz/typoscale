// /src/types/fonts.ts
export interface GoogleFont {
  family: string
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[]
  subsets: string[]
  files?: Record<string, string>
}

export type FontCategory = 'all' | 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
