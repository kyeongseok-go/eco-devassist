import { ArrowRight, Code2, TestTube2, FileText, Search, ChevronRight, Sparkles, Shield, Cpu, Rocket, Satellite } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const workflowSteps = [
  { icon: Shield, label: 'ECO 발생', desc: '형상변경 지시서 등록' },
  { icon: Search, label: 'AI 영향 분석', desc: '연관 모듈 자동 탐색' },
  { icon: Code2, label: 'AI 코드 생성', desc: '수정 코드 초안 작성' },
  { icon: TestTube2, label: 'AI 테스트', desc: 'DO-178C 수준 검증' },
  { icon: FileText, label: 'AI 보고서', desc: '완료 보고서 자동화' },
];

const careerMapping = [
  { experience: 'IMS 이슈 처리 200건+', feature: 'ECO 대시보드' },
  { experience: 'Theme/ClrMap 40개 파일 추적', feature: 'AI 영향 분석' },
  { experience: '코드 수정 + PR 리뷰 다수', feature: 'AI 코드 생성' },
  { experience: 'TestLink 350건 + Jest 최적화', feature: 'AI 테스트 생성' },
  { experience: '분기보고서 24건+', feature: 'AI 보고서 생성' },
  { experience: '인수인계 문서 다수', feature: '지식 검색 (RAG)' },
];

const techStack = ['React 19', 'TypeScript', 'Tailwind v4', 'Vite 8', 'Claude Sonnet', 'Vercel'];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="h-screen overflow-y-auto bg-space-950 text-white relative">
      {/* 배경 레이어 */}
      <div className="fixed inset-0 bg-space-stars opacity-60 pointer-events-none" />
      <div className="fixed inset-0 bg-space-grid opacity-40 pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(237, 113, 0, 0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(237, 113, 0, 0.08), transparent 70%)',
        }}
      />

      {/* 상단 네비 */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <HanwhaMark />
          <div className="hidden sm:block">
            <div className="text-[10px] font-semibold tracking-[0.3em] text-hanwha-300 uppercase">Hanwha Aerospace</div>
            <div className="text-xs text-white/50 tracking-wider">R&D · SW · AI</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#workflow" className="hover:text-hanwha-300 transition-colors">Workflow</a>
          <a href="#mapping" className="hover:text-hanwha-300 transition-colors">설계 근거</a>
          <a href="#stack" className="hover:text-hanwha-300 transition-colors">Stack</a>
        </div>
        <button
          onClick={onStart}
          className="liquid-glass rounded-full px-5 py-2 text-xs font-semibold tracking-wide text-white hover:scale-[1.03] transition-transform"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          데모 시작
        </button>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 lg:px-16 pt-16 lg:pt-28 pb-24 max-w-7xl mx-auto">
        {/* 배지 */}
        <div className="flex justify-center mb-10">
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs">
            <span className="pulse-dot" />
            <span className="text-white/70">실무면접 시연용 데모</span>
            <span className="text-white/30">|</span>
            <span className="text-hanwha-300 font-medium">한화에어로스페이스 R&D SW AI 직무</span>
          </div>
        </div>

        {/* 헤드라인 */}
        <h1
          className="text-center text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[1.05] tracking-[-0.04em] font-medium max-w-5xl mx-auto"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-gradient-hero">형상변경의</span>
          <br />
          <span className="text-gradient-hero">속도를</span>{' '}
          <em className="not-italic font-serif italic text-hanwha-400" style={{ fontFamily: 'var(--font-serif)' }}>
            재정의
          </em>
          <span className="text-gradient-hero">하다</span>
        </h1>

        {/* 부제 */}
        <p className="text-center text-base sm:text-lg text-white/60 max-w-2xl mx-auto mt-8 leading-relaxed">
          ECO가 발생하는 순간, 영향 분석부터 코드 수정·테스트·보고서까지.
          <br className="hidden sm:block" />
          체계 SW 개발자의 반복 작업을 AI가 자동으로 수행합니다.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            onClick={onStart}
            className="btn-hanwha rounded-full px-8 py-3.5 text-sm font-semibold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            데모 시작하기
            <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
          <a
            href="#workflow"
            className="liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium text-white/90 flex items-center gap-2 hover:scale-[1.02] transition-transform"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Sparkles className="w-4 h-4 text-hanwha-300" /> 워크플로우 둘러보기
          </a>
        </div>

        {/* 키워드 칩 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {['DO-178C', 'MISRA-C', 'EBOM/MBOM 정합성', 'RAG 지식 검색', '체계 SW 안전성'].map((k) => (
            <span
              key={k}
              className="liquid-glass rounded-full px-3.5 py-1.5 text-[11px] tracking-wide text-white/70"
            >
              {k}
            </span>
          ))}
        </div>

        {/* HUD 인디케이터 */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <HudStat label="자동화 단계" value="6" suffix="STEPS" />
          <HudStat label="시연 시나리오" value="3" suffix="ECO" />
          <HudStat label="규격 검증" value="MISRA-C" suffix="2012" />
          <HudStat label="추적성" value="EBOM↔MBOM" suffix="LIVE" />
        </div>
      </section>

      {/* 한화 시그니처 라인 */}
      <div className="hanwha-rule mx-16" />

      {/* WORKFLOW */}
      <section id="workflow" className="relative z-10 px-6 lg:px-16 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-hanwha-300 uppercase mb-4">
            <Cpu className="w-3 h-3" />
            ECO Automation Pipeline
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] font-medium"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-white">하나의 변경요청,</span>{' '}
            <em className="not-italic font-serif italic text-hanwha-400" style={{ fontFamily: 'var(--font-serif)' }}>
              다섯 단계의 자동화
            </em>
          </h2>
        </div>

        <div className="hidden lg:flex items-stretch justify-between gap-3">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center flex-1">
                <div className="liquid-glass-strong rounded-2xl p-5 flex-1 group hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-hanwha-500/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-hanwha-400" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">0{i + 1}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{step.label}</div>
                  <div className="text-[11px] text-white/50 leading-relaxed">{step.desc}</div>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-hanwha-500/50 mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* 모바일 */}
        <div className="lg:hidden space-y-3">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="liquid-glass-strong rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-hanwha-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-hanwha-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{step.label}</div>
                  <div className="text-[11px] text-white/50">{step.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-white/30">0{i + 1}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CAREER MAPPING */}
      <section id="mapping" className="relative z-10 px-6 lg:px-16 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-hanwha-300 uppercase mb-4">
            <Satellite className="w-3 h-3" />
            Why this design
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] font-medium text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            5년의 체계 SW 경험이{' '}
            <em className="not-italic font-serif italic text-hanwha-400" style={{ fontFamily: 'var(--font-serif)' }}>
              설계 근거
            </em>
            입니다
          </h2>
        </div>

        <div className="liquid-glass-strong rounded-3xl p-2">
          <div className="divide-y divide-white/5">
            {careerMapping.map((item) => (
              <div
                key={item.feature}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors rounded-2xl"
              >
                <span className="text-sm text-white/60">{item.experience}</span>
                <ArrowRight className="hidden sm:block w-4 h-4 text-hanwha-500" />
                <span className="text-sm font-semibold text-hanwha-300 sm:text-right" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="relative z-10 px-6 lg:px-16 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.3em] text-hanwha-300 uppercase mb-3">Tech Stack</div>
          <h3 className="text-2xl tracking-[-0.02em] font-medium text-white" style={{ fontFamily: 'var(--font-display)' }}>
            가볍고, 빠르고, 검증 가능한 구성
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="liquid-glass rounded-full px-4 py-2 text-xs font-medium text-white/80"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="liquid-glass-strong rounded-[2.5rem] max-w-5xl mx-auto p-12 lg:p-16 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(237, 113, 0, 0.25), transparent 70%)',
            }}
          />
          <div className="relative">
            <Rocket className="w-10 h-10 text-hanwha-400 mx-auto mb-6" />
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] font-medium mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-white">지금 바로,</span>{' '}
              <em className="not-italic font-serif italic text-gradient-hanwha" style={{ fontFamily: 'var(--font-serif)' }}>
                ECO-DevAssist
              </em>
              <span className="text-white">를 체험하세요</span>
            </h2>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
              AI가 ECO 워크플로우 전체를 자동화하는 과정을, 6단계 시나리오로 직접 확인할 수 있습니다.
            </p>
            <button
              onClick={onStart}
              className="btn-hanwha rounded-full px-9 py-4 text-sm font-semibold inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              데모 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-white/30 mt-8 tracking-wide">
              한화에어로스페이스 R&D SW AI 플랫폼 직무 포트폴리오 · 고경석
            </p>
          </div>
        </div>
      </section>

      {/* 하단 한화 라인 */}
      <footer className="relative z-10 px-6 lg:px-16 py-8 flex items-center justify-between text-[11px] text-white/30">
        <div className="flex items-center gap-3">
          <HanwhaMark size={20} />
          <span style={{ fontFamily: 'var(--font-display)' }}>Hanwha Aerospace · ECO-DevAssist Demo</span>
        </div>
        <div className="font-mono tracking-wider hidden sm:block">v1.0 · 2026</div>
      </footer>
    </div>
  );
}

function HudStat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="liquid-glass rounded-2xl px-5 py-4">
      <div className="text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl lg:text-3xl font-semibold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </span>
        <span className="text-[10px] font-mono text-hanwha-300 tracking-wider">{suffix}</span>
      </div>
    </div>
  );
}

function HanwhaMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full glow-hanwha"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #ff8a2a 0%, #ed7100 60%, #d05f00 100%)',
      }}
      aria-label="Hanwha"
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none">
        <path d="M3 18 L9 6 L12 12 L15 6 L21 18" stroke="#0a0c10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
