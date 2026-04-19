import { Shield, ArrowRight, Code2, TestTube2, FileText, Search, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const workflowSteps = [
  { icon: Shield, label: 'ECO 발생', desc: '형상변경 지시서 등록', color: '#78909c' },
  { icon: Search, label: 'AI 영향 분석', desc: '연관 모듈 자동 탐색', color: '#448aff' },
  { icon: Code2, label: 'AI 코드 생성', desc: '수정 코드 초안 자동 작성', color: '#00e676' },
  { icon: TestTube2, label: 'AI 테스트 생성', desc: 'DO-178C 수준 테스트', color: '#ffd600' },
  { icon: FileText, label: 'AI 보고서', desc: 'ECO 완료 보고서 자동화', color: '#00bcd4' },
];

const careerMapping = [
  { experience: 'IMS 이슈 처리 200건+', feature: 'ECO 대시보드', icon: '📋' },
  { experience: 'Theme/ClrMap 40개 파일 추적', feature: 'AI 영향 분석', icon: '🔍' },
  { experience: '코드 수정 + PR 리뷰', feature: 'AI 코드 생성', icon: '💻' },
  { experience: 'TestLink 350건 + Jest 최적화', feature: 'AI 테스트 생성', icon: '🧪' },
  { experience: '분기보고서 24건+', feature: 'AI 보고서 생성', icon: '📄' },
  { experience: '인수인계 문서 다수', feature: '지식 검색 (RAG)', icon: '📚' },
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="h-screen overflow-y-auto bg-navy-950">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-accent-green" />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white tracking-tight">ECO-DevAssist</h1>
              <p className="text-sm text-navy-500">형상변경 기반 R&D SW 개발자 AI 어시스턴트</p>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-3 leading-relaxed">
            ECO가 발생하면,<br />
            <span className="text-accent-green font-semibold">AI가 나머지를 합니다.</span>
          </p>
          <p className="text-sm text-navy-500 max-w-lg mx-auto mb-8">
            영향 분석 → 코드 수정 → 테스트 생성 → 보고서 작성까지<br />
            SW 개발자의 반복 작업을 AI가 자동으로 수행합니다.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-green text-navy-950 font-semibold rounded-lg hover:bg-accent-green-dim transition-colors text-base"
          >
            데모 시작하기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-center text-xs font-semibold text-navy-500 uppercase tracking-widest mb-8">
          ECO 자동화 워크플로우
        </h2>
        <div className="flex items-start justify-center gap-2">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-start">
                <div className="flex flex-col items-center text-center w-36">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: step.color + '15', border: `1px solid ${step.color}33` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <span className="text-sm font-medium text-white">{step.label}</span>
                  <span className="text-[10px] text-navy-500 mt-1">{step.desc}</span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-navy-600 mt-3.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Career Mapping */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-center text-xs font-semibold text-navy-500 uppercase tracking-widest mb-2">
          설계 근거
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8">
          5년간의 체계 SW 개발 경험이 각 기능의 설계 근거입니다
        </p>
        <div className="grid grid-cols-1 gap-2">
          {careerMapping.map((item) => (
            <div
              key={item.feature}
              className="flex items-center bg-navy-900 border border-navy-700 rounded-lg px-5 py-3 hover:border-navy-600 transition-colors"
            >
              <span className="text-lg mr-4">{item.icon}</span>
              <span className="text-sm text-navy-500 w-64 shrink-0">{item.experience}</span>
              <ArrowRight className="w-4 h-4 text-accent-green/50 mx-4 shrink-0" />
              <span className="text-sm font-medium text-accent-green">{item.feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-center text-xs font-semibold text-navy-500 uppercase tracking-widest mb-6">
          기술 스택
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Claude API', 'Recharts', 'Vercel'].map((tech) => (
            <span key={tech} className="px-4 py-1.5 bg-navy-900 border border-navy-700 rounded-full text-xs text-gray-400">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12 text-center">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent-green text-navy-950 font-semibold rounded-lg hover:bg-accent-green-dim transition-colors text-base"
        >
          데모 시작하기 <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-navy-600 mt-4">
          한화에어로스페이스 R&D SW AI 플랫폼 직무 포트폴리오 | 고경석
        </p>
      </section>
    </div>
  );
}
