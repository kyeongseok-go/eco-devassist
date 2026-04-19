import { useState } from 'react';
import { Play, ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ECO, Action } from '../../types';
import { callClaude, parseJsonResponse, hasApiKey } from '../../services/claudeApi';
import { buildMisraCPrompt } from '../../services/promptTemplates';
import { swModules, getModuleById } from '../../data/mockSWModules';

interface MisraCCheckerProps {
  selectedECO: ECO | null;
  generatedCode: string | null;
  selectedModuleId: string | null;
  dispatch: React.Dispatch<Action>;
}

interface Violation {
  ruleId: string;
  severity: 'Required' | 'Advisory' | 'Safety';
  line: string;
  description: string;
  recommendation: string;
}

interface ComplianceResult {
  violations: Violation[];
  summary: {
    totalViolations: number;
    required: number;
    advisory: number;
    safety: number;
    complianceScore: string;
  };
  overallAssessment: string;
}

const severityConfig = {
  Required: { color: '#ff9100', bg: 'bg-status-high/10', text: 'text-status-high', icon: AlertTriangle },
  Advisory: { color: '#ffd600', bg: 'bg-status-medium/10', text: 'text-status-medium', icon: Info },
  Safety: { color: '#ff1744', bg: 'bg-status-critical/10', text: 'text-status-critical', icon: ShieldCheck },
};

export function MisraCChecker({ generatedCode, selectedModuleId }: MisraCCheckerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [localModule, setLocalModule] = useState(selectedModuleId || 'ballistic-calc');

  const module = getModuleById(localModule);
  const codeToCheck = generatedCode || module?.codeSnippet || '';

  const runCheck = async () => {
    if (!module) return;
    setError(null);
    setIsLoading(true);
    try {
      const prompt = buildMisraCPrompt(codeToCheck, module.name);
      const response = await callClaude(prompt);
      const parsed = parseJsonResponse<ComplianceResult>(response);
      setResult(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : '규격 검증 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = result
    ? [
        { name: 'Required', value: result.summary.required, color: '#ff9100' },
        { name: 'Advisory', value: result.summary.advisory, color: '#ffd600' },
        { name: 'Safety', value: result.summary.safety, color: '#ff1744' },
      ].filter((d) => d.value > 0)
    : [];

  const score = result ? parseInt(result.summary.complianceScore) || 0 : 0;
  const scoreColor = score >= 80 ? 'text-accent-green' : score >= 60 ? 'text-status-medium' : 'text-status-critical';

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent-cyan" />
            MISRA-C 코딩 규격 검증
          </h2>
          <p className="text-xs text-navy-500 mt-1">MISRA-C:2012 / DO-178C / MIL-STD-498 기준 자동 검증</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={localModule}
            onChange={(e) => setLocalModule(e.target.value)}
            className="bg-navy-800 border border-navy-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-green"
          >
            {swModules.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button
            onClick={runCheck}
            disabled={isLoading || !hasApiKey()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-cyan text-navy-950 text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isLoading ? '검증 중...' : '규격 검증 실행'}
          </button>
        </div>
      </div>

      {/* Code Preview */}
      <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-navy-700 flex justify-between">
          <span className="text-xs font-medium text-white">검증 대상 코드</span>
          <span className="text-[10px] text-navy-500 font-mono">{module?.filePath} ({module?.language})</span>
        </div>
        <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
          {codeToCheck || '모듈을 선택하세요'}
        </pre>
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-3 text-sm text-status-critical">{error}</div>
      )}

      {result && (
        <>
          {/* Score + Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 text-center">
              <h3 className="text-xs text-navy-500 uppercase tracking-wider mb-2">준수율</h3>
              <span className={`text-4xl font-bold ${scoreColor}`}>{result.summary.complianceScore}</span>
              <p className="text-[10px] text-navy-500 mt-1">점</p>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-xs text-navy-500 uppercase tracking-wider mb-2">위반 분포</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} innerRadius={20}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid #1e2d5a', borderRadius: '6px', fontSize: '11px', color: '#e0e0ee' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[100px]">
                  <CheckCircle2 className="w-8 h-8 text-accent-green" />
                </div>
              )}
              <div className="flex justify-center gap-3 mt-1">
                {chartData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1 text-[10px] text-navy-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}: {d.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-xs text-navy-500 uppercase tracking-wider mb-2">위반 통계</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-status-critical">Safety</span>
                  <span className="text-white font-bold">{result.summary.safety}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-status-high">Required</span>
                  <span className="text-white font-bold">{result.summary.required}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-status-medium">Advisory</span>
                  <span className="text-white font-bold">{result.summary.advisory}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-navy-700 pt-2">
                  <span className="text-navy-500">총 위반</span>
                  <span className="text-white font-bold">{result.summary.totalViolations}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">종합 평가</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{result.overallAssessment}</p>
          </div>

          {/* Violations */}
          {result.violations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">위반 상세 ({result.violations.length}건)</h3>
              <div className="space-y-2">
                {result.violations.map((v, i) => {
                  const cfg = severityConfig[v.severity] || severityConfig.Advisory;
                  const SevIcon = cfg.icon;
                  return (
                    <div key={`${v.ruleId}-${i}`} className="bg-navy-900 border border-navy-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <SevIcon className={`w-4 h-4 ${cfg.text}`} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cfg.text} ${cfg.bg}`}>{v.severity}</span>
                        <span className="text-xs font-mono text-accent-cyan">{v.ruleId}</span>
                      </div>
                      <p className="text-xs text-white mb-1">{v.description}</p>
                      <div className="flex gap-4 mt-2">
                        <div className="flex-1">
                          <span className="text-[10px] text-navy-500 uppercase">해당 코드</span>
                          <p className="text-xs font-mono text-gray-400 mt-0.5">{v.line}</p>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] text-accent-green uppercase">수정 방법</span>
                          <p className="text-xs text-gray-400 mt-0.5">{v.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
