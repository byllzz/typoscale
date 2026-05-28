import {  Book, Bug, Sliders, Code2, Type, Smartphone, Heart } from 'lucide-react';

interface WelcomeNoteProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function WelcomeNote({ isOpen, onClose, darkMode }: WelcomeNoteProps) {
  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard?.writeText('npm install typoscale');
    const btn = e.currentTarget;
    btn.textContent = '✓ copied';
    setTimeout(() => (btn.textContent = '⎘ copy'), 1400);
  };

  const d = darkMode;

  const base    = d ? 'bg-[#0f0f0f] text-stone-200 border-stone-800' : 'bg-white text-[#111] border-stone-200';
  const muted   = d ? 'text-stone-400' : 'text-stone-500';
  const subtle  = d ? 'bg-[#1a1a1a] border-stone-800' : 'bg-stone-50 border-stone-200';
  const divider = d ? 'border-stone-800' : 'border-stone-200';

  const btnBase    = 'inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono border transition-colors leading-none';
  const btnGhost   = `${btnBase} ${d ? 'border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-stone-100' : 'border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`;
  const btnPrimary = `${btnBase} ${d ? 'bg-stone-100 text-stone-900 border-transparent hover:bg-white' : 'bg-stone-900 text-white border-transparent hover:bg-stone-700'}`;
  const tag        = `text-[10px] font-mono px-2 py-0.5 rounded-full border ${d ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`;

  const features = [
    { icon: <Sliders size={13} strokeWidth={1.5} />,    name: 'Modular scale ratios',     desc: 'Minor Second to Golden Ratio, or any custom value.' },
    { icon: <Code2 size={13} strokeWidth={1.5} />,      name: 'CSS, Tailwind & JSON export', desc: 'One-click copy for all token formats.' },
    { icon: <Type size={13} strokeWidth={1.5} />,       name: 'Live font pairing',        desc: 'Pair any Google Font. Preview updates instantly.' },
    { icon: <Smartphone size={13} strokeWidth={1.5} />, name: 'Responsive preview',       desc: 'Drag to resize across breakpoints.' },
    { icon: <Heart size={13} strokeWidth={1.5} />,      name: 'Free forever',             desc: 'No account, no limits, open source.' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
        w-[95vw] max-w-3xl rounded-lg border shadow-2xl overflow-hidden font-mono ${base}`}>

        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded border text-xs transition-colors
            ${d ? 'border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                : 'border-stone-300 text-stone-400 hover:bg-stone-100 hover:text-stone-700'}`}
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">

          {/* ── LEFT ── */}
          <div className={`flex-1 p-5 flex flex-col gap-2.5 border-b md:border-b-0 md:border-r ${divider}`}>

            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border w-fit
              ${d ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              v1.0.0 · stable
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold tracking-tight leading-tight mb-0.5">TypoScale</h1>
              <p className={`text-[11px] ${muted}`}>Type scale generator for design systems</p>
            </div>

            <p className={`text-[11.5px] leading-relaxed ${muted}`}>
              Create harmonious typography systems in seconds. Generate CSS tokens, Tailwind config,
              and design variables — ready to drop in.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-1.5">
              {[['MIT','License'],['v2.0','Latest'],['Zero','Dependencies'],['CSS/TW','Exports']].map(([v,l]) => (
                <div key={l} className={`rounded p-2 border ${subtle}`}>
                  <span className="block text-[13px] font-medium leading-tight">{v}</span>
                  <span className={`text-[10px] ${muted}`}>{l}</span>
                </div>
              ))}
            </div>

            {/* Install */}
            <div className={`rounded border p-2 ${subtle}`}>
              <span className={`block text-[9px] tracking-widest mb-1 ${muted}`}>QUICK START</span>
              <div className="flex items-center justify-between">
                <code className="text-[12px]">npm install typoscale</code>
                <button onClick={handleCopy} className={`text-[11px] font-mono transition-colors ${muted} hover:text-current`}>
                  ⎘ copy
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-1.5 flex-wrap">
              <button className={btnPrimary}><GithubIcon /> GitHub</button>
              <button className={btnGhost}><Book size={11} /> Docs</button>
              <button className={btnGhost}><Bug size={11} /> Issues</button>
            </div>

            <p className={`text-[10px] mt-auto ${muted}`}>Built in the open · contributions welcome</p>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex-1 p-5 flex flex-col">
            <p className={`text-[9px] tracking-widest mb-3 ${muted}`}>WHAT'S INCLUDED</p>

            <div className="flex flex-col">
              {features.map((f, i) => (
                <div key={f.name} className={`flex items-start gap-2 py-1.5 ${i < features.length - 1 ? `border-b ${divider}` : ''}`}>
                  <span className={`mt-0.5 flex-shrink-0 ${muted}`}>{f.icon}</span>
                  <div>
                    <span className="block text-[11.5px] font-medium leading-snug">{f.name}</span>
                    <span className={`text-[10.5px] leading-relaxed ${muted}`}>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className={`border-t ${divider} my-3`} />

            <p className={`text-[9px] tracking-widest mb-2 ${muted}`}>CONTRIBUTING</p>
            <p className={`text-[11px] leading-relaxed mb-3 ${muted}`}>
              Open an issue or PR on GitHub. Please read{' '}
              <code className={`text-[10.5px] px-1 py-0.5 rounded ${subtle}`}>CONTRIBUTING.md</code> first.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {['good first issue', 'help wanted', 'TypeScript', 'React'].map(label => (
                <span key={label} className={tag}>{label}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}


function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
