// /src/types/scale.ts
export type ScaleRatio =
  | 'minorSecond'
  | 'majorSecond'
  | 'minorThird'
  | 'majorThird'
  | 'perfectFourth'
  | 'augmentedFourth'
  | 'perfectFifth'
  | 'goldenRatio'
  | 'custom'

export const SCALE_RATIOS: Record<ScaleRatio, { label: string; value: number }> = {
  minorSecond:   { label: 'Minor Second',    value: 1.067 },
  majorSecond:   { label: 'Major Second',    value: 1.125 },
  minorThird:    { label: 'Minor Third',     value: 1.200 },
  majorThird:    { label: 'Major Third',     value: 1.250 },
  perfectFourth: { label: 'Perfect Fourth',  value: 1.333 },
  augmentedFourth: { label: 'Augmented Fourth', value: 1.414 },
  perfectFifth:  { label: 'Perfect Fifth',   value: 1.500 },
  goldenRatio:   { label: 'Golden Ratio',    value: 1.618 },
  custom:        { label: 'Custom',          value: 1.333 },
}

export const STEP_NAMES = ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

export interface ScaleStep {
  name: string
  size: number
  sizePx: number
  lineHeight: number
  letterSpacing: string
  fontWeight: number
}
