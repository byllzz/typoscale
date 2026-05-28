import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { ScaleStep } from '../types'
import { generateClampCSS } from '../utils/fluidTypography'
import { Copy, Check, Download } from 'lucide-react'

interface FluidExportProps {
  steps: ScaleStep[]
}

export function FluidExport({ steps }: FluidExportProps) {
  const { baseSize, darkMode } = useStore()
  const [copied, setCopied] = useState(false)

  const clampCSS = generateClampCSS(steps, baseSize)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(clampCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([clampCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fluid-typography.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${
      darkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'
    }`}>
      <div className={`border-b px-4 sm:px-5 py-3 flex-col items-start gap-3 sm:flex-row flex sm:items-center justify-between ${
        darkMode ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <div className="min-w-0">
          <h3 className={`text-sm font-medium truncate ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>
            Fluid Typography with clamp()
          </h3>
          <p className={`text-xs truncate ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
            Responsive font sizes that scale smoothly
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-500'
                : darkMode
                  ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              darkMode
                ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Download size={14} />
            <span>Download CSS</span>
          </button>
        </div>
      </div>

      <div className="overflow-auto max-h-[400px]">
        <pre className={`p-4 sm:p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap sm:whitespace-pre ${
          darkMode ? 'text-stone-300' : 'text-stone-700'
        }`}>
          <code>{clampCSS}</code>
        </pre>
      </div>
    </div>
  )
}
