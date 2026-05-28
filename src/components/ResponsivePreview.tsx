import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import type { ScaleStep } from '../types'
import { Smartphone, Tablet, Monitor } from 'lucide-react'

interface ResponsivePreviewProps {
  steps: ScaleStep[]
}

type Device = 'mobile' | 'tablet' | 'desktop'

export function ResponsivePreview({ steps }: ResponsivePreviewProps) {
  const { displayFont, bodyFont, darkMode, previewText } = useStore()

  // Initialize device selection state directly from LocalStorage fallback
  const [device, setDevice] = useState<Device>(() => {
    if (typeof window !== 'undefined') {
      const savedDevice = localStorage.getItem('typoScale_previewDevice')
      if (savedDevice === 'mobile' || savedDevice === 'tablet' || savedDevice === 'desktop') {
        return savedDevice
      }
    }
    return 'desktop'
  })

  // Watch device selection hook updates to save to client storage state
  useEffect(() => {
    localStorage.setItem('typoScale_previewDevice', device)
  }, [device])

  const bodyStep = steps.find(s => s.name === 'base') ?? steps[3]

  const deviceSizes = {
    mobile: { width: 375, scale: 0.8 },
    tablet: { width: 768, scale: 0.9 },
    desktop: { width: 1024, scale: 1 }
  }

  const currentDevice = deviceSizes[device]

  const bg = darkMode ? '#0c0a09' : '#fafaf9'
  const textColor = darkMode ? '#fafaf9' : '#1c1917'
  const frameBorderColor = darkMode ? 'border-stone-800' : 'border-stone-200'

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${
      darkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'
    }`}>
      {/* Device selector */}
      <div className={`border-b px-4 py-3 flex items-center gap-2 ${
        darkMode ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <button
          onClick={() => setDevice('mobile')}
          className={`p-2 rounded-lg transition-all ${
            device === 'mobile'
              ? 'bg-amber-500/20 text-amber-400'
              : darkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Mobile View"
        >
          <Smartphone size={18} />
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`p-2 rounded-lg transition-all ${
            device === 'tablet'
              ? 'bg-amber-500/20 text-amber-400'
              : darkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Tablet View"
        >
          <Tablet size={18} />
        </button>
        <button
          onClick={() => setDevice('desktop')}
          className={`p-2 rounded-lg transition-all ${
            device === 'desktop'
              ? 'bg-amber-500/20 text-amber-400'
              : darkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Desktop View"
        >
          <Monitor size={18} />
        </button>

        <span className={`text-[11px] font-mono ml-auto ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
          {Math.round(currentDevice.width * currentDevice.scale)}px viewport
        </span>
      </div>

      {/* Frame Container Viewport Canvas with scale alignment fix */}
      <div className="p-4 sm:p-6 flex justify-center overflow-x-auto" style={{ backgroundColor: bg }}>
        <div
          className={`overflow-y-auto rounded-xl shadow-xl border transition-all duration-300 flex-shrink-0 ${frameBorderColor}`}
          style={{
            width: currentDevice.width,
            maxWidth: '100%',
            height: 400,
            backgroundColor: darkMode ? '#1c1917' : '#ffffff',
            padding: 24,
            transform: `scale(${currentDevice.scale})`,
            transformOrigin: 'top center'
          }}
        >
          <h1 className="mb-4 break-words font-bold tracking-tight" style={{
            fontFamily: `'${displayFont}', serif`,
            fontSize: `${steps[steps.length - 1]?.size || 3}rem`,
            color: textColor
          }}>
            {previewText}
          </h1>
          <p className="leading-relaxed break-words" style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: `${bodyStep.size}rem`,
            lineHeight: bodyStep.lineHeight,
            color: darkMode ? '#a8a29e' : '#57534e'
          }}>
            Responsive typography adapts to every screen size. Your scale maintains harmony whether viewed on mobile, tablet, or desktop.
          </p>
        </div>
      </div>
    </div>
  )
}
