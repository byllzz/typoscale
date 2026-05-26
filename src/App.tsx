import { useEffect } from 'react'
import { ScaleControls } from './components/ScaleControls'
import { MainArea } from './components/MainArea'
import { PrismTheme } from './components/PrismTheme'
import { loadGoogleFont } from './hooks/useFonts'
import { useStore } from './store/useStore'

export default function App() {
  const { displayFont, bodyFont, monoFont } = useStore()

  // Load fonts on mount and when they change
  useEffect(() => {
    loadGoogleFont(displayFont)
    loadGoogleFont(bodyFont)
    loadGoogleFont(monoFont)
  }, [displayFont, bodyFont, monoFont])

  return (
    <>
      <PrismTheme />
      <div className="flex h-screen overflow-hidden bg-stone-950">
        <ScaleControls />
        <MainArea />
      </div>
    </>
  )
}
