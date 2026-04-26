import { Settings, Key } from 'lucide-react';
import { useState } from 'react';
import { setApiKey, getApiKey, hasApiKey, isProduction } from '../../services/claudeApi';

export function Header() {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [keySet, setKeySet] = useState(hasApiKey());

  return (
    <>
      <header className="bg-space-900/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center glow-hanwha"
            style={{ background: 'linear-gradient(135deg, #ff8a2a 0%, #ed7100 60%, #d05f00 100%)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M3 18 L9 6 L12 12 L15 6 L21 18" stroke="#0a0c10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              ECO-DevAssist
            </h1>
            <p className="text-[10px] text-hanwha-300/80 tracking-[0.2em] uppercase">Hanwha Aerospace · R&D SW AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isProduction ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-hanwha-500/10 text-hanwha-300 border border-hanwha-500/20">
              <span className="pulse-dot" />
              AI 연결됨
            </div>
          ) : (
            <>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${keySet ? 'bg-hanwha-500/10 text-hanwha-300 border border-hanwha-500/20' : 'bg-status-critical/10 text-status-critical border border-status-critical/30'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${keySet ? 'bg-hanwha-400' : 'bg-status-critical'}`} />
                {keySet ? 'AI 연결됨' : 'API 키 필요'}
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="p-2 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                title="API 키 설정"
              >
                <Key className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="p-2 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowKeyModal(false)}>
          <div className="liquid-glass-strong rounded-2xl p-6 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Claude API 키 설정
            </h2>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-ant-api..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-hanwha-500/60"
            />
            <p className="text-[11px] text-white/50 mt-2">API 키는 브라우저 로컬 스토리지에만 저장됩니다.</p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setApiKey(keyInput); setKeySet(true); setShowKeyModal(false); }}
                className="btn-hanwha rounded-lg px-5 py-2 text-sm font-semibold"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
