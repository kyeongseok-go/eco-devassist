import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface GuideTourProps {
  onClose: () => void;
}

const tourSteps = [
  {
    title: '1. ECO 선택',
    description: 'ECO 대시보드에서 분석할 ECO를 클릭하세요. "탄도 계산 모듈 최대 사거리 변경" ECO를 추천합니다.',
    tip: 'BOM 트리에서 부품을 클릭하면 관련 정보를 확인할 수 있어요.',
  },
  {
    title: '2. AI 영향 분석',
    description: 'ECO를 선택한 후 "영향 분석" 탭으로 이동하여 "AI 분석 실행" 버튼을 클릭하세요. AI가 영향받는 SW 모듈, 위험도, 과거 유사 사례를 자동으로 분석합니다.',
    tip: '과거 이력 데이터를 기반으로 RAG 검색이 수행됩니다.',
  },
  {
    title: '3. AI 코드 생성',
    description: '"코드 생성" 탭에서 대상 모듈을 선택하고 "AI 코드 수정 생성"을 클릭하세요. Before/After diff 뷰로 변경 사항을 확인할 수 있습니다.',
    tip: '안전 관련 코드는 방어적 프로그래밍과 경계값 검사가 자동 포함됩니다.',
  },
  {
    title: '4. AI 테스트 + MISRA-C 검증',
    description: '"테스트 생성" 탭에서 DO-178C 수준의 테스트 케이스를 자동 생성하고, "MISRA-C 검증" 탭에서 코딩 규격 준수 여부를 확인하세요.',
    tip: '단위/경계값/예외/회귀 4종 테스트가 자동 분류됩니다.',
  },
  {
    title: '5. AI 보고서 + 지식 검색',
    description: '"보고서" 탭에서 전체 과정을 종합한 ECO 완료 보고서를 자동 생성합니다. "지식 검색" 탭에서는 과거 이력을 자연어로 질문할 수 있습니다.',
    tip: '보고서는 마크다운 형식으로 다운로드 가능합니다.',
  },
];

export function GuideTour({ onClose }: GuideTourProps) {
  const [step, setStep] = useState(0);
  const current = tourSteps[step];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-navy-900 border border-navy-700 rounded-xl w-[480px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-navy-800">
          <div
            className="h-full bg-accent-green transition-all duration-300"
            style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent-green" />
              <span className="text-xs text-navy-500">데모 가이드 {step + 1}/{tourSteps.length}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-navy-800 text-navy-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">{current.title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{current.description}</p>

          {/* Tip */}
          <div className="bg-accent-green/5 border border-accent-green/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-xs text-accent-green">💡 {current.tip}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-navy-500 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> 이전
            </button>
            <div className="flex gap-1.5">
              {tourSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-accent-green' : 'bg-navy-600'}`}
                />
              ))}
            </div>
            {step < tourSteps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-accent-green text-navy-950 font-medium rounded hover:bg-accent-green-dim transition-colors"
              >
                다음 <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-accent-green text-navy-950 font-medium rounded hover:bg-accent-green-dim transition-colors"
              >
                시작하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
