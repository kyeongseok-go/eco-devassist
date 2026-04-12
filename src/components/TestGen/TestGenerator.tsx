import { useState } from 'react';
import { Play, TestTube2, Loader2, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ECO, TestCase, Action } from '../../types';
import { callClaude, parseJsonResponse, hasApiKey } from '../../services/claudeApi';
import { buildTestPrompt } from '../../services/promptTemplates';
import { getModuleById } from '../../data/mockSWModules';

interface TestGeneratorProps {
  selectedECO: ECO | null;
  generatedCode: string | null;
  generatedTests: TestCase[] | null;
  isLoading: boolean;
  selectedModuleId: string | null;
  dispatch: React.Dispatch<Action>;
}

const typeColors: Record<string, string> = {
  unit: '#448aff',
  boundary: '#ffd600',
  exception: '#ff1744',
  regression: '#00e676',
};
const typeLabels: Record<string, string> = {
  unit: '단위 테스트',
  boundary: '경계값 테스트',
  exception: '예외 테스트',
  regression: '회귀 테스트',
};
const priorityColors: Record<string, string> = {
  High: 'text-status-critical',
  Medium: 'text-status-high',
  Low: 'text-status-low',
};

export function TestGenerator({ selectedECO, generatedCode, generatedTests, isLoading, selectedModuleId, dispatch }: TestGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const module = getModuleById(selectedModuleId || 'ballistic-calc');

  const runTestGen = async () => {
    if (!selectedECO || !module) return;
    setError(null);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const code = generatedCode || module.codeSnippet;
      const prompt = buildTestPrompt(selectedECO, code, module);
      const response = await callClaude(prompt);
      const result = parseJsonResponse<{ testCases: TestCase[] }>(response);
      dispatch({ type: 'SET_TESTS', payload: result.testCases });
    } catch (e) {
      setError(e instanceof Error ? e.message : '테스트 생성 중 오류 발생');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const chartData = generatedTests
    ? Object.entries(
        generatedTests.reduce<Record<string, number>>((acc, t) => {
          acc[t.type] = (acc[t.type] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name: typeLabels[name] || name, value, color: typeColors[name] || '#888' }))
    : [];

  if (!selectedECO) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-navy-500">
          <TestTube2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ECO를 먼저 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">AI 테스트 생성</h2>
          <p className="text-xs text-navy-500 mt-1">DO-178C 수준의 테스트 커버리지를 목표로 테스트 케이스를 생성합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runTestGen}
            disabled={isLoading || !hasApiKey()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-green text-navy-950 text-sm font-medium rounded hover:bg-accent-green-dim transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isLoading ? '테스트 생성 중...' : '테스트 생성'}
          </button>
          {generatedTests && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-800 text-accent-cyan text-sm rounded hover:bg-navy-700 transition-colors">
              <Download className="w-4 h-4" /> TestLink로 내보내기
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-3 text-sm text-status-critical">{error}</div>
      )}

      {generatedTests && (
        <>
          {/* Chart + Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2">테스트 분포</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid #1e2d5a', borderRadius: '6px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-2 bg-navy-900 border border-navy-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">테스트 요약</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800 rounded p-3">
                  <span className="text-2xl font-bold text-white">{generatedTests.length}</span>
                  <span className="text-xs text-navy-500 ml-2">총 테스트 케이스</span>
                </div>
                {Object.entries(typeLabels).map(([type, label]) => (
                  <div key={type} className="bg-navy-800 rounded p-3 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[type] }} />
                    <span className="text-xs text-navy-500">{label}:</span>
                    <span className="text-sm font-bold text-white">{generatedTests.filter((t) => t.type === type).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-2">
            {generatedTests.map((tc) => (
              <div key={tc.id} className="bg-navy-900 border border-navy-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-navy-500">{tc.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: typeColors[tc.type] + '33', color: typeColors[tc.type] }}>
                      {typeLabels[tc.type]}
                    </span>
                    <span className={`text-[10px] font-medium ${priorityColors[tc.priority]}`}>{tc.priority}</span>
                  </div>
                </div>
                <p className="text-sm text-white">{tc.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-[10px] text-navy-500 uppercase">입력값</span>
                    <p className="text-xs text-gray-300 font-mono mt-0.5">{tc.input}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-navy-500 uppercase">예상 결과</span>
                    <p className="text-xs text-gray-300 font-mono mt-0.5">{tc.expectedResult}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
