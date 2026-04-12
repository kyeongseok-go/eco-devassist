import { Shield, Settings, Key } from 'lucide-react';
import { useState } from 'react';
import { setApiKey, getApiKey, hasApiKey } from '../../services/claudeApi';

export function Header() {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(getApiKey());

  return (
    <>
      <header className="bg-navy-900 border-b border-navy-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-accent-green" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ECO-DevAssist</h1>
            <p className="text-xs text-navy-500">R&D SW 개발자 AI 어시스턴트</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium ${hasApiKey() ? 'bg-accent-green/10 text-accent-green' : 'bg-status-critical/10 text-status-critical'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${hasApiKey() ? 'bg-accent-green' : 'bg-status-critical'}`} />
            {hasApiKey() ? 'AI 연결됨' : 'API 키 필요'}
          </div>
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 rounded hover:bg-navy-800 text-navy-500 hover:text-white transition-colors"
            title="API 키 설정"
          >
            <Key className="w-4 h-4" />
          </button>
          <button className="p-2 rounded hover:bg-navy-800 text-navy-500 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowKeyModal(false)}>
          <div className="bg-navy-900 border border-navy-700 rounded-lg p-6 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Claude API 키 설정</h2>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-ant-api..."
              className="w-full bg-navy-800 border border-navy-600 rounded px-3 py-2 text-white text-sm font-mono placeholder:text-navy-500 focus:outline-none focus:border-accent-green"
            />
            <p className="text-xs text-navy-500 mt-2">API 키는 브라우저 로컬 스토리지에만 저장됩니다.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-sm text-navy-500 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setApiKey(keyInput); setShowKeyModal(false); }}
                className="px-4 py-2 text-sm bg-accent-green text-navy-950 font-medium rounded hover:bg-accent-green-dim transition-colors"
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
