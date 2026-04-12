import { useState } from 'react';
import { Play, FileText, Loader2, Download } from 'lucide-react';
import type { ECO, AnalysisResult, TestCase, Action } from '../../types';
import { callClaude, hasApiKey } from '../../services/claudeApi';
import { buildReportPrompt } from '../../services/promptTemplates';

interface ReportGeneratorProps {
  selectedECO: ECO | null;
  analysisResult: AnalysisResult | null;
  generatedCode: string | null;
  generatedTests: TestCase[] | null;
  generatedReport: string | null;
  isLoading: boolean;
  dispatch: React.Dispatch<Action>;
}

export function ReportGenerator({ selectedECO, analysisResult, generatedCode, generatedTests, generatedReport, isLoading, dispatch }: ReportGeneratorProps) {
  const [error, setError] = useState<string | null>(null);

  const runReportGen = async () => {
    if (!selectedECO) return;
    setError(null);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prompt = buildReportPrompt(
        selectedECO,
        analysisResult ? JSON.stringify(analysisResult, null, 2) : '분석 결과 없음',
        generatedCode || '코드 변경 없음',
        generatedTests ? JSON.stringify(generatedTests, null, 2) : '테스트 결과 없음'
      );
      const response = await callClaude(prompt);
      dispatch({ type: 'SET_REPORT', payload: response });
    } catch (e) {
      setError(e instanceof Error ? e.message : '보고서 생성 중 오류 발생');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!selectedECO) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-navy-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ECO를 먼저 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">AI 보고서 생성</h2>
          <p className="text-xs text-navy-500 mt-1">ECO 정보 + 영향 분석 + 코드 변경 + 테스트 결과를 종합하여 ECO 완료 보고서를 자동 생성합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runReportGen}
            disabled={isLoading || !hasApiKey()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-green text-navy-950 text-sm font-medium rounded hover:bg-accent-green-dim transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isLoading ? '보고서 생성 중...' : 'ECO 완료 보고서 생성'}
          </button>
          {generatedReport && (
            <button
              onClick={() => {
                const blob = new Blob([generatedReport], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedECO.id}_완료보고서.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-navy-800 text-accent-cyan text-sm rounded hover:bg-navy-700 transition-colors"
            >
              <Download className="w-4 h-4" /> 다운로드 (MD)
            </button>
          )}
        </div>
      </div>

      {/* Data Readiness */}
      <div className="grid grid-cols-4 gap-3">
        <ReadyBadge label="ECO 정보" ready={!!selectedECO} />
        <ReadyBadge label="영향 분석" ready={!!analysisResult} />
        <ReadyBadge label="코드 변경" ready={!!generatedCode} />
        <ReadyBadge label="테스트 결과" ready={!!generatedTests} />
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-3 text-sm text-status-critical">{error}</div>
      )}

      {/* Report Preview */}
      {generatedReport && (
        <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-navy-700 flex items-center justify-between">
            <span className="text-xs font-medium text-white">보고서 미리보기</span>
            <span className="text-[10px] text-navy-500">{selectedECO.id} 완료 보고서</span>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none">
            <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
              {generatedReport}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadyBadge({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-2 text-center ${ready ? 'bg-accent-green/5 border-accent-green/20' : 'bg-navy-900 border-navy-700'}`}>
      <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${ready ? 'bg-accent-green' : 'bg-navy-600'}`} />
      <span className={`text-[10px] ${ready ? 'text-accent-green' : 'text-navy-500'}`}>{label}</span>
    </div>
  );
}
