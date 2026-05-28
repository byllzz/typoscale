import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { FontPicker } from './FontPicker';
import { SCALE_RATIOS } from '../types';
import type { ScaleRatio } from '../types';
import { ChevronLeft, ChevronRight, Type, Sliders, Share2 } from 'lucide-react';

interface ScaleControlsProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function ScaleControls({ isOpen, onClose, isMobile }: ScaleControlsProps) {
  const {
    displayFont,
    setDisplayFont,
    bodyFont,
    setBodyFont,
    monoFont,
    setMonoFont,
    baseSize,
    setBaseSize,
    ratio,
    setRatio,
    customRatio,
    setCustomRatio,
    steps,
    setSteps,
    darkMode,
  } = useStore();

  // Initialize state directly from localStorage to prevent layout flashes on load
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('typoScale_sidebarCollapsed');
      return savedState === 'true';
    }
    return false;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Side-effect to write state changes to the browser vault
  useEffect(() => {
    localStorage.setItem('typoScale_sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  // Sidebar structural content layout configuration
  const sidebarContent = (
    <>
      {/* Fixed Header */}
      <div
        className={`sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300 flex-shrink-0 ${
          darkMode ? 'bg-stone-950/95 border-stone-800' : 'bg-white/95 border-stone-200'
        }`}
      >
        <div
          className={`py-3 flex items-center justify-between ${isCollapsed && !isMobile ? 'px-0 justify-center' : 'px-4'}`}
        >
          {/* Logo & Brand Identity text */}
          <div className="flex items-center">
            {(!isCollapsed || isMobile) && (
              <h1
                className={`font-medium text-[18px] tracking-tight transition-all duration-300 whitespace-nowrap relative left-1.5 ${
                  darkMode ? 'text-stone-100' : 'text-stone-800'
                }`}
              >
                TypoScale
              </h1>
            )}
          </div>

          {/* Desktop Collapse/Expand Trigger Action */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-md border transition-all duration-200 ${
                darkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-500/30'
                  : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-500/30'
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Setup Options */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden py-6 transition-all duration-300 space-y-8 ${
          isCollapsed && !isMobile ? 'px-2' : 'px-5'
        }`}
      >
        {/* Font Pairing */}
        <section className="flex flex-col">
          {isCollapsed && !isMobile ? (
            <div
              className={`mx-auto p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-stone-500 hover:bg-stone-900' : 'text-stone-400 hover:bg-stone-100'}`}
              onClick={() => setIsCollapsed(false)}
              title="Font Pairing"
            >
              <Type size={18} />
            </div>
          ) : (
            <>
              <h2
                className={`text-[10px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}
              >
                Font Pairing
              </h2>
              <div className="space-y-4">
                <FontPicker
                  label="Display / Heading"
                  value={displayFont}
                  onChange={setDisplayFont}
                />
                <FontPicker label="Body / Paragraph" value={bodyFont} onChange={setBodyFont} />
                <FontPicker label="Monospace / Code" value={monoFont} onChange={setMonoFont} />
              </div>
            </>
          )}
        </section>

        {/* Scale Controls */}
        <section className="flex flex-col">
          {isCollapsed && !isMobile ? (
            <div
              className={`mx-auto p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-stone-500 hover:bg-stone-900' : 'text-stone-400 hover:bg-stone-100'}`}
              onClick={() => setIsCollapsed(false)}
              title="Scale Configurations"
            >
              <Sliders size={18} />
            </div>
          ) : (
            <>
              <h2
                className={`text-[10px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}
              >
                Scale Configurations
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}
                    >
                      Base Size
                    </label>
                    <span className="text-amber-500 text-xs font-mono font-bold">
                      {baseSize}rem
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.0625"
                    value={baseSize}
                    onChange={e => setBaseSize(parseFloat(e.target.value))}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div>
                  <label
                    className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}
                  >
                    Ratio
                  </label>
                  <select
                    value={ratio}
                    onChange={e => setRatio(e.target.value as ScaleRatio)}
                    className={`w-full rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-300 ${
                      darkMode
                        ? 'bg-stone-900 border-stone-800 text-stone-200'
                        : 'bg-stone-100 border-stone-200 text-stone-800'
                    } border focus:outline-none focus:border-amber-500/50`}
                  >
                    {Object.entries(SCALE_RATIOS).map(([key, { label, value }]) => (
                      <option key={key} value={key}>
                        {label} {key !== 'custom' ? `(${value})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {ratio === 'custom' && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}
                      >
                        Custom Ratio
                      </label>
                      <span className="text-amber-500 text-xs font-mono font-bold">
                        {customRatio.toFixed(3)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.05"
                      max="2.0"
                      step="0.001"
                      value={customRatio}
                      onChange={e => setCustomRatio(parseFloat(e.target.value))}
                      className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}
                    >
                      Steps
                    </label>
                    <span className="text-amber-500 text-xs font-mono font-bold">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="1"
                    value={steps}
                    onChange={e => setSteps(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Fixed Action Footer */}
      <div
        className={`border-t transition-colors duration-300 flex-shrink-0 ${
          darkMode ? 'border-stone-800' : 'border-stone-200'
        } ${isCollapsed && !isMobile ? 'p-2' : 'px-5 py-4'}`}
      >
        <ShareButton darkMode={darkMode} isCollapsed={isCollapsed && !isMobile} />
      </div>
    </>
  );

  // Desktop Component View Rail Configuration
  if (!isMobile) {
    return (
      <aside
        className={`flex-shrink-0 border-r flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-14' : 'w-80'
        } ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'}`}
      >
        {sidebarContent}
      </aside>
    );
  }

  // Mobile Slide Overlay Mode Configuration
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-80 flex flex-col shadow-2xl
          transition-transform duration-300 ease-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${darkMode ? 'bg-stone-950' : 'bg-white'}
        `}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-4 p-1.5 rounded-lg transition-colors duration-200 z-20 ${
            darkMode ? 'text-stone-400 hover:text-amber-400' : 'text-stone-600 hover:text-amber-600'
          }`}
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

interface ShareButtonProps {
  darkMode: boolean;
  isCollapsed: boolean;
}

function ShareButton({ darkMode, isCollapsed }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isCollapsed) {
    return (
      <button
        onClick={handleShare}
        className={`w-full flex items-center justify-center p-2 rounded-md border transition-all duration-200 ${
          copied
            ? 'bg-green-500/10 text-green-500 border-green-500/30'
            : darkMode
              ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-500/30'
              : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-500/30'
        }`}
        title="Copy Share Link"
      >
        <Share2 size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
        copied
          ? 'bg-green-500/10 text-green-500 border border-green-500/30'
          : darkMode
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={14} />
          <span>Copy Share Link</span>
        </>
      )}
    </button>
  );
}
