import { useEffect, useState } from 'react';
import { ScaleControls } from './components/ScaleControls';
import { MainArea } from './components/MainArea';
import { PrismTheme } from './components/PrismTheme';
import { loadGoogleFont } from './hooks/useFonts';
import { useStore } from './store/useStore';

export default function App() {
  const { displayFont, bodyFont, monoFont, darkMode } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Apply light mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadGoogleFont(displayFont);
    loadGoogleFont(bodyFont);
    loadGoogleFont(monoFont);
  }, [displayFont, bodyFont, monoFont]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      <PrismTheme />
      {/* h-screen to h-dvh  */}
      <div className="flex h-dvh overflow-hidden relative">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`fixed top-4 left-4 z-30 p-2 rounded-lg border transition-colors ${
              darkMode
                ? 'bg-stone-900 border-stone-700 text-stone-400 hover:text-amber-400'
                : 'bg-white border-stone-200 text-stone-600 hover:text-amber-600 shadow-sm'
            }`}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <ScaleControls
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />
        <MainArea />
      </div>
    </>
  );
}
