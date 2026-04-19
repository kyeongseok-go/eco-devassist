# ECO-DevAssist Implementation Plan (Post-Implementation)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 방산 R&D ECO 프로세스를 AI로 자동화하는 웹 데모 앱 구현

**Architecture:** React SPA + Vercel 서버리스 프록시. Mock 데이터 기반이지만 ENOVIA REST API 교체 가능한 구조. 7개 AI 탭으로 ECO 생명주기 전체를 커버.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vite 8, Recharts, Lucide React, Claude API

---

## File Structure

```
src/
├── App.tsx                               # 메인 앱 (랜딩 → 가이드 → 탭 라우팅)
├── types/index.ts                        # 전체 타입 정의 (BOM, ECO, AppState 등)
├── hooks/useAppState.ts                  # useReducer 상태 관리
├── services/
│   ├── claudeApi.ts                      # AI 호출 (프록시/직접 이중 경로)
│   └── promptTemplates.ts                # 6종 프롬프트 빌더
├── data/
│   ├── mockBOM.ts                        # EBOM 트리 (11 nodes)
│   ├── mockMBOM.ts                       # MBOM 트리 + 비교 알고리즘
│   ├── mockSWModules.ts                  # SW 모듈 11개 (코드 스니펫 포함)
│   ├── mockECOs.ts                       # ECO 3개
│   └── mockHistory.ts                    # 과거 이력 5개
├── components/
│   ├── Landing/LandingPage.tsx           # 히어로 + 워크플로우 + 경력 매핑
│   ├── Layout/
│   │   ├── Header.tsx                    # 상단바 + API 키 모달
│   │   ├── Sidebar.tsx                   # BOM 트리 사이드바
│   │   ├── TabBar.tsx                    # 7개 탭
│   │   └── WorkflowStepper.tsx           # 프로세스 진행 표시줄
│   ├── ECO/
│   │   ├── ECODashboard.tsx              # 통계 + 차트 + 카드 + BOM비교 + 타임라인
│   │   ├── ECOCreateModal.tsx            # ECO 생성 폼
│   │   ├── ECOTimeline.tsx               # git log 스타일 이력
│   │   └── BOMCompare.tsx                # EBOM vs MBOM 비교
│   ├── Analysis/ImpactAnalyzer.tsx       # AI 영향 분석
│   ├── CodeGen/CodeGenerator.tsx         # AI 코드 생성 (구분자 파서)
│   ├── TestGen/TestGenerator.tsx         # AI 테스트 생성 (차트)
│   ├── Report/ReportGenerator.tsx        # AI 보고서 생성
│   ├── Compliance/MisraCChecker.tsx      # MISRA-C 규격 검증
│   ├── Knowledge/KnowledgeSearch.tsx     # RAG 지식 검색
│   └── UI/
│       ├── ErrorBoundary.tsx             # 에러 복구 UI
│       ├── SkeletonLoader.tsx            # 로딩 스켈레톤
│       └── GuideTour.tsx                 # 5단계 가이드 투어
├── test/
│   ├── setup.ts
│   ├── types.test.ts                     # 타입 정의 검증 (5)
│   ├── mockData.test.ts                  # Mock 데이터 무결성 (22)
│   ├── claudeApi.test.ts                 # API 서비스 (10)
│   ├── useAppState.test.ts               # 상태 관리 (12)
│   └── promptTemplates.test.ts           # 프롬프트 템플릿 (14)
├── docs/
│   ├── adr/                              # Architecture Decision Records (5종)
│   └── superpowers/                      # 브레인스토밍 스펙 + 구현 계획
├── api/claude.ts                         # Vercel 서버리스 프록시
└── PROGRESS.md, TEST_REPORT.md           # 진행/검증 문서
```

---

## Implementation Waves (Completed)

### Wave 1: Foundation & Polish — ✅ COMPLETE
- [x] ECO 프로세스 스텝퍼 (완료/진행/미완료 시각화)
- [x] 대시보드 차트 3종 (상태 도넛, 우선순위 바, 모듈 변경빈도)
- [x] 에러 바운더리 컴포넌트 (React class component)
- [x] 스켈레톤 로더 + 타이핑 인디케이터
- [x] 보안: dangerous 헤더 주석, CSP meta 태그, @anthropic-ai/sdk 제거
- [x] 빌드 검증: tsc 0 errors, vite build SUCCESS

### Wave 2: UX & Story — ✅ COMPLETE
- [x] 히어로 랜딩 페이지 (워크플로우 애니메이션 + 경력 매핑 테이블)
- [x] ECO 타임라인 (git log 스타일, 접기/펼치기)
- [x] 빌드 + 테스트 검증

### Wave 3: Domain Depth — ✅ COMPLETE
- [x] MISRA-C 코딩 규격 검증 탭 (7번째 탭)
- [x] MISRA-C 프롬프트 템플릿 (준수율 점수 + 위반 분류)
- [x] ADR 5종 작성 (아키텍처, Mock, Claude API, 프롬프트, 보안)
- [x] TabBar, WorkflowStepper 7탭 확장
- [x] 빌드 + 테스트 검증

### Wave 4: Advanced Features — ✅ COMPLETE
- [x] Mock MBOM 데이터 (EBOM 대비 4건 차이)
- [x] BOM 비교 알고리즘 (flattenBOM → Map 기반 diff)
- [x] BOMCompare 컴포넌트 (심각도별 통계 + 상세 리스트)
- [x] 데모 가이드 투어 (5단계, 진행 바, 팁)
- [x] 대시보드에 접기/펼치기 섹션으로 통합
- [x] 빌드 + 테스트 + 배포 (Vercel)

---

## Verification Matrix

| 요구사항 | 구현 상태 | 검증 방법 |
|---------|----------|----------|
| ECO CRUD | ✅ | 대시보드 생성/선택/상태 변경 |
| AI 영향 분석 | ✅ | Claude API + 구조화 JSON 파싱 |
| AI 코드 생성 | ✅ | 구분자 기반 파서 (===MODIFIED_CODE===) |
| AI 테스트 생성 | ✅ | 4종 분류 + Recharts 분포 차트 |
| AI 보고서 | ✅ | 마크다운 생성 + 다운로드 |
| MISRA-C 검증 | ✅ | 준수율 점수 + 위반 상세 |
| 지식 검색 (RAG) | ✅ | 과거 이력 context + 자연어 질문 |
| BOM 트리 | ✅ | 접기/펼치기 + 타입별 색상 |
| EBOM/MBOM 비교 | ✅ | 자동 diff 알고리즘 |
| 다크 밀리터리 테마 | ✅ | navy + green 커스텀 팔레트 |
| 워크플로우 가이드 | ✅ | 스텝퍼 + 가이드 투어 |
| 에러 처리 | ✅ | ErrorBoundary + try-catch |
| 테스트 | ✅ | 63개 vitest ALL PASS |
| 보안 | ✅ | CSP + 주석 + 프록시 |
| 문서화 | ✅ | ADR 5종 + PROGRESS + TEST_REPORT |

---

## Backlog (Future Waves)

### Wave 5: Visual Polish
- [ ] BOM 트리에 영향 분석 결과 위험도 색상 반영
- [ ] 실시간 협업 시뮬레이션 표시
- [ ] 반응형 디자인 개선 (모바일 대응)

### Wave 6: Technical Debt
- [ ] Zod 기반 AI 응답 런타임 검증
- [ ] 탭별 독립 로딩 상태
- [ ] React.lazy + Suspense 코드 스플리팅
- [ ] key={i} → 안정적 key로 교체

### Wave 7: Production Readiness
- [ ] ENOVIA REST API 연동 인터페이스
- [ ] 온프레미스 LLM 배포 가이드
- [ ] 감사 로그 시스템
- [ ] E2E 테스트 (Playwright)
