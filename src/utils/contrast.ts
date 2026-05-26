// WCAG 2.1 relative luminance and contrast ratio

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

export function contrastRatio(hex1: string, hex2: string): number {
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ]
  }
  const [r1, g1, b1] = parse(hex1)
  const [r2, g2, b2] = parse(hex2)
  const l1 = luminance(r1, g1, b1)
  const l2 = luminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

export type WCAGLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

export function wcagLevel(ratio: number, isLargeText: boolean): WCAGLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (isLargeText && ratio >= 3) return 'AA Large'
  return 'Fail'
}
