import { useState } from 'react';
import { Play, AlertTriangle, Shield, Clock, Lightbulb, Loader2 } from 'lucide-react';
import type { ECO, AnalysisResult, Action } from '../../types';
import { callClaude, parseJsonResponse, hasApiKey } from '../../services/claudeApi';
import { buildImpactPrompt } from '../../services/promptTemplates';
import { bomTree } from '../../data/mockBOM';
import { swModules } from '../../data/mockSWModules';
import { ecoHistory } from '../../data/mockHistory';

interface ImpactAnalyzerProps {
  selectedECO: ECO | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  dispatch: React.Dispatch<Action>;
}

const riskColors = { High: 'text-status-critical', Medium: 'text-status-high', Low: 'text-status-low' };
const riskBg = { High: 'bg-status-critical/10', Medium: 'bg-status-high/10', Low: 'bg-status-low/10' };

export function ImpactAnalyzer({ selectedECO, analysisResult, isLoading, dispatch }: ImpactAnalyzerProps) {
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!selectedECO) return;
    setError(null);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prompt = buildImpactPrompt(selectedECO, bomTree, swModules, ecoHistory);
      const response = await callClaude(prompt);
      const result = parseJsonResponse<AnalysisResult>(response);
      dispatch({ type: 'SET_ANALYSIS', payload: result });
    } catch (e) {
      setError(e instanceof Error ? e.message : '분석 중 오류가 발생했습니다.');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!selectedECO) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-navy-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ECO를 먼저 선택해주세요</p>
          <p className="text-xs mt-1">대시보드에서 분석할 ECO를 클릭하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Selected ECO Info */}
      <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-navy-500">{selectedECO.id}</span>
            <h3 className="text-sm font-medium text-white mt-1">{selectedECO.title}</h3>
            <p className="text-xs text-navy-500 mt-1">{selectedECO.changeDescription}</p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={isLoading || !hasApiKey()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-green text-navy-950 text-sm font-medium rounded hover:bg-accent-green-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isLoading ? 'AI 분석 중...' : 'AI 영향 분석 실행'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-4 text-sm text-status-critical">{error}</div>
      )}

      {/* Results */}
      {analysisResult && (
        <>
          {/* Affected Modules */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-green" /> 영향받는 SW 모듈
            </h3>
            <div className="space-y-2">
              {analysisResult.affectedModules.map((m) => (
                <div key={m.moduleId} className="bg-navy-900 border border-navy-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{m.moduleName}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${riskColors[m.riskLevel]} ${riskBg[m.riskLevel]}`}>
                        {m.riskLevel} RISK
                      </span>
                      <span className="text-xs text-navy-500">{m.estimatedEffort}</span>
                    </div>
                  </div>
                  <p className="text-xs text-navy-500">{m.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar ECOs */}
          {analysisResult.similarECOs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-cyan" /> 과거 유사 변경 사례
              </h3>
              <div className="space-y-2">
                {analysisResult.similarECOs.map((s) => (
                  <div key={s.ecoId} className="bg-navy-900 border border-navy-700 rounded-lg p-4">
                    <span className="text-xs font-mono text-navy-500">{s.ecoId}</span>
                    <h4 className="text-sm text-white mt-1">{s.title}</h4>
                    <p className="text-xs text-status-high mt-1">문제: {s.issues}</p>
                    <p className="text-xs text-accent-green mt-1">교훈: {s.lessons}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-high" /> 주의사항
              </h3>
              <ul className="space-y-1">
                {analysisResult.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-navy-500 flex items-start gap-1.5">
                    <span className="text-status-high mt-0.5">!</span> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-status-medium" /> 권장사항
              </h3>
              <ul className="space-y-1">
                {analysisResult.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-navy-500 flex items-start gap-1.5">
                    <span className="text-accent-green mt-0.5">+</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-accent-green/5 border border-accent-green/20 rounded-lg p-4 text-center">
            <span className="text-sm text-accent-green font-medium">
              총 예상 작업 공수: {analysisResult.totalEstimatedDays}일
            </span>
          </div>
        </>
      )}
    </div>
  );
}
