import { useState } from 'react';
import { Search, Loader2, MessageSquare, History } from 'lucide-react';
import { callClaude, hasApiKey } from '../../services/claudeApi';
import { buildKnowledgePrompt } from '../../services/promptTemplates';
import { ecoHistory } from '../../data/mockHistory';

export function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleQueries = [
    '이전에 사거리 관련 변경이 있었을 때 어떤 문제가 있었나?',
    '안전 연동 모듈을 수정할 때 주의할 점은?',
    '센서 파라미터 변경 시 고려사항은?',
    '통신 타이밍 변경 시 발생할 수 있는 이슈는?',
  ];

  const runSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setError(null);
    setIsLoading(true);
    try {
      const prompt = buildKnowledgePrompt(searchQuery, ecoHistory);
      const response = await callClaude(prompt);
      setAnswer(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : '검색 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">지식 검색</h2>
        <p className="text-xs text-navy-500 mt-1">과거 ECO 이력을 기반으로 AI가 관련 사례와 교훈을 제시합니다</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="자연어로 질문을 입력하세요..."
            className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-accent-green"
          />
        </div>
        <button
          onClick={() => runSearch()}
          disabled={isLoading || !query.trim() || !hasApiKey()}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent-green text-navy-950 text-sm font-medium rounded-lg hover:bg-accent-green-dim transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          검색
        </button>
      </div>

      {/* Example Queries */}
      <div>
        <span className="text-xs text-navy-500">예시 질문:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {exampleQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => runSearch(q)}
              className="text-xs bg-navy-800 border border-navy-700 rounded-full px-3 py-1.5 text-navy-500 hover:text-white hover:border-navy-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-3 text-sm text-status-critical">{error}</div>
      )}

      {/* Answer */}
      {answer && (
        <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-navy-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent-green" />
            <span className="text-xs font-medium text-white">AI 답변</span>
          </div>
          <div className="p-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        </div>
      )}

      {/* ECO History Reference */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-accent-cyan" /> 과거 ECO 이력 데이터베이스
        </h3>
        <div className="space-y-2">
          {ecoHistory.map((h) => (
            <div key={h.id} className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-navy-500">{h.id}</span>
                <span className="text-xs text-navy-600">{h.date}</span>
              </div>
              <h4 className="text-sm text-white">{h.title}</h4>
              <p className="text-xs text-navy-500 mt-1">{h.changeDescription}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="bg-navy-800 rounded p-2">
                  <span className="text-[10px] text-status-high uppercase">발생 이슈</span>
                  <p className="text-xs text-gray-300 mt-0.5">{h.issuesEncountered}</p>
                </div>
                <div className="bg-navy-800 rounded p-2">
                  <span className="text-[10px] text-accent-green uppercase">교훈</span>
                  <p className="text-xs text-gray-300 mt-0.5">{h.lessonsLearned}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
