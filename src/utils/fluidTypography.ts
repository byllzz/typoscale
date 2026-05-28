import type { ScaleStep } from '../types'

export function generateClampCSS(steps: ScaleStep[], baseSize: number): string {
  const minWidth = 375
  const maxWidth = 1440

  const clampRules = steps.map(step => {
    const minSize = (step.size * 0.75) // 75% on mobile
    const maxSize = step.size

    const slope = (maxSize - minSize) / (maxWidth - minWidth)
    const intercept = minSize - slope * minWidth

    const clampValue = `clamp(${minSize.toFixed(4)}rem, ${(slope * 100).toFixed(2)}vw + ${intercept.toFixed(4)}rem, ${maxSize.toFixed(4)}rem)`

    return `.text-${step.name} {
  font-size: ${clampValue};
  line-height: ${step.lineHeight};
  letter-spacing: ${step.letterSpacing};
  font-weight: ${step.fontWeight};
}`
  }).join('\n\n')

  return `/* Fluid Typography Scale */
/* Min viewport: 375px, Max viewport: 1440px */

${clampRules}

/* Usage example:
<h1 class="text-${steps[steps.length - 1]?.name}">Heading</h1>
<p class="text-base">Body text</p>
*/`
}
