import { useMemo } from 'react'
import type { ScaleStep, ScaleRatio } from '../types';
import { buildScale } from '../utils/scaleAlgorithms'

interface UseTypeScaleOptions {
  baseSize: number
  ratio: ScaleRatio
  customRatio: number
  steps: number
}

export function useTypeScale({ baseSize, ratio, customRatio, steps }: UseTypeScaleOptions): ScaleStep[] {
  return useMemo(
    () => buildScale(baseSize, ratio, customRatio, steps),
    [baseSize, ratio, customRatio, steps]
  )
}
