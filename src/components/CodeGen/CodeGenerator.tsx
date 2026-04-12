import { useState } from 'react';
import { Play, Code2, Loader2, AlertTriangle } from 'lucide-react';
import type { ECO, AnalysisResult, Action } from '../../types';
import { callClaude, hasApiKey } from '../../services/claudeApi';
import { buildCodePrompt } from '../../services/promptTemplates';
import { swModules, getModuleById } from '../../data/mockSWModules';

interface CodeGeneratorProps {
  selectedECO: ECO | null;
  analysisResult: AnalysisResult | null;
  generatedCode: string | null;
  isLoading: boolean;
  selectedModuleId: string | null;
  dispatch: React.Dispatch<Action>;
}

interface CodeResult {
  modifiedCode: string;
  changes: { line: string; before: string; after: string; reason: string }[];
  safetyNotes: string[];
  summary: string;
}

function parseCodeResponse(response: string): CodeResult {
  const codeMatch = response.match(/===MODIFIED_CODE_START===([\s\S]*?)===MODIFIED_CODE_END===/);
  const metaMatch = response.match(/===META_START===([\s\S]*?)===META_END===/);

  const modifiedCode = codeMatch ? codeMatch[1].trim() : '';
  let changes: CodeResult['changes'] = [];
  let safetyNotes: string[] = [];
  let summary = '';

  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1].trim());
      changes = meta.changes || [];
      safetyNotes = meta.safetyNotes || [];
      summary = meta.summary || '';
    } catch {
      summary = '메타데이터 파싱 실패 — 코드는 정상 생성되었습니다.';
    }
  }

  if (!modifiedCode) {
    throw new Error('AI 응답에서 수정된 코드를 추출할 수 없습니다.');
  }

  return { modifiedCode, changes, safetyNotes, summary };
}

export function CodeGenerator({ selectedECO, analysisResult, generatedCode, isLoading, selectedModuleId, dispatch }: CodeGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null);
  const [localSelectedModule, setLocalSelectedModule] = useState<string>(selectedModuleId || 'ballistic-calc');

  const module = getModuleById(localSelectedModule);
  const affectedModuleIds = analysisResult?.affectedModules.map((m) => m.moduleId) || [];
  const availableModules = affectedModuleIds.length > 0
    ? swModules.filter((m) => affectedModuleIds.includes(m.id))
    : swModules;

  const runCodeGen = async () => {
    if (!selectedECO || !module) return;
    setError(null);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const relatedModules = module.dependencies
        .map((d) => getModuleById(d))
        .filter((m): m is NonNullable<typeof m> => m !== undefined);
      const prompt = buildCodePrompt(selectedECO, module, relatedModules);
      const response = await callClaude(prompt);
      const result = parseCodeResponse(response);
      setCodeResult(result);
      dispatch({ type: 'SET_CODE', payload: result.modifiedCode });
    } catch (e) {
      setError(e instanceof Error ? e.message : '코드 생성 중 오류 발생');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!selectedECO) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-navy-500">
          <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ECO를 먼저 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* Module selector + run button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-navy-500 mb-1">대상 모듈 선택</label>
          <select
            value={localSelectedModule}
            onChange={(e) => setLocalSelectedModule(e.target.value)}
            className="w-full bg-navy-800 border border-navy-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-green"
          >
            {availableModules.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.filePath})</option>
            ))}
          </select>
        </div>
        <button
          onClick={runCodeGen}
          disabled={isLoading || !hasApiKey()}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent-green text-navy-950 text-sm font-medium rounded hover:bg-accent-green-dim transition-colors disabled:opacity-50 mt-5"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isLoading ? '코드 생성 중...' : 'AI 코드 수정 생성'}
        </button>
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-3 text-sm text-status-critical">{error}</div>
      )}

      {/* Before/After Code View */}
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-navy-700 flex items-center justify-between">
            <span className="text-xs font-medium text-status-critical">BEFORE (현재 코드)</span>
            <span className="text-[10px] text-navy-500 font-mono">{module?.filePath}</span>
          </div>
          <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {module?.codeSnippet || 'N/A'}
          </pre>
        </div>

        {/* After */}
        <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-navy-700 flex items-center justify-between">
            <span className="text-xs font-medium text-accent-green">AFTER (수정 코드)</span>
            <span className="text-[10px] text-navy-500 font-mono">{module?.filePath}</span>
          </div>
          <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {generatedCode || codeResult?.modifiedCode || '아직 코드가 생성되지 않았습니다.\n"AI 코드 수정 생성" 버튼을 클릭하세요.'}
          </pre>
        </div>
      </div>

      {/* Changes Detail */}
      {codeResult && (
        <>
          <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">변경 요약</h3>
            <p className="text-xs text-navy-500">{codeResult.summary}</p>
          </div>

          {codeResult.changes.length > 0 && (
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">변경 상세</h3>
              <div className="space-y-3">
                {codeResult.changes.map((c, i) => (
                  <div key={i} className="border-b border-navy-700 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs text-white font-medium">{c.line}</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="text-xs font-mono bg-status-critical/5 text-status-critical p-2 rounded">- {c.before}</div>
                      <div className="text-xs font-mono bg-accent-green/5 text-accent-green p-2 rounded">+ {c.after}</div>
                    </div>
                    <p className="text-[10px] text-navy-500 mt-1">{c.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {codeResult.safetyNotes.length > 0 && (
            <div className="bg-status-high/5 border border-status-high/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-high" /> 안전 관련 주의사항
              </h3>
              <ul className="space-y-1">
                {codeResult.safetyNotes.map((n, i) => (
                  <li key={i} className="text-xs text-navy-500">- {n}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
