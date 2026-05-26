import { STEP_NAMES, SCALE_RATIOS } from '../types';
import type { ScaleStep, ScaleRatio } from '../types';

const BASE_STEP_INDEX = 3 // 'base' is at index 3 in STEP_NAMES

function getLineHeight(remSize: number): number {
  // Tighter line height for large text, more generous for small
  if (remSize >= 3) return 1.1
  if (remSize >= 2) return 1.2
  if (remSize >= 1.5) return 1.3
  if (remSize >= 1) return 1.5
  return 1.7
}

function getLetterSpacing(remSize: number): string {
  if (remSize >= 3) return '-0.03em'
  if (remSize >= 2) return '-0.02em'
  if (remSize >= 1.5) return '-0.01em'
  if (remSize < 0.75) return '0.04em'
  return '0em'
}

function getFontWeight(stepIndex: number, totalSteps: number): number {
  // Larger steps get slightly heavier weight for visual harmony
  const mid = Math.floor(totalSteps / 2)
  if (stepIndex > mid + 2) return 700
  if (stepIndex > mid) return 500
  return 400
}

export function buildScale(
  baseRem: number,
  ratio: ScaleRatio,
  customRatio: number,
  totalSteps: number
): ScaleStep[] {
  const ratioValue = ratio === 'custom'
    ? customRatio
    : SCALE_RATIOS[ratio].value

  const names = STEP_NAMES.slice(0, totalSteps)
  const baseIdx = Math.min(BASE_STEP_INDEX, Math.floor(totalSteps * 0.35))

  return names.map((name, i) => {
    const power = i - baseIdx
    const size = parseFloat((baseRem * Math.pow(ratioValue, power)).toFixed(4))
    const sizePx = parseFloat((size * 16).toFixed(2))
    return {
      name,
      size,
      sizePx,
      lineHeight: getLineHeight(size),
      letterSpacing: getLetterSpacing(size),
      fontWeight: getFontWeight(i, totalSteps),
    }
  })
}

export function getEffectiveRatio(ratio: ScaleRatio, customRatio: number): number {
  return ratio === 'custom' ? customRatio : SCALE_RATIOS[ratio].value
}
