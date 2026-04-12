# ECO-DevAssist 구현 진행 문서

## 프로젝트 개요
- **프로젝트명**: ECO-DevAssist — 형상변경 기반 R&D SW 개발자 AI 어시스턴트
- **목적**: 한화에어로스페이스 실무면접 시연용 데모
- **핵심 가치**: ECO 발생 시 AI가 영향 분석 → 코드 수정 → 테스트 생성 → 보고서 작성을 자동 수행

## 기술 스택
| 항목 | 기술 |
|------|------|
| Framework | React 18 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| AI | Claude API (claude-sonnet-4-20250514) |
| Fonts | Inter (UI) + JetBrains Mono (코드) |

## 구현 완료 항목

### 1. 프로젝트 구조 (완료)
```
src/
├── App.tsx                          # 메인 앱 (탭 라우팅)
├── types/index.ts                   # 전체 TypeScript 타입 정의
├── hooks/useAppState.ts             # useReducer 기반 상태 관리
├── services/
│   ├── claudeApi.ts                 # Claude API 호출 래퍼
│   └── promptTemplates.ts           # 4종 프롬프트 템플릿
├── data/
│   ├── mockBOM.ts                   # K-FCS BOM 트리 (3 서브시스템, 7 조립체)
│   ├── mockSWModules.ts             # SW 모듈 11개 (코드 스니펫 포함)
│   ├── mockECOs.ts                  # ECO 3개 (다양한 상태/우선순위)
│   └── mockHistory.ts              # 과거 ECO 이력 5개 (RAG용)
└── components/
    ├── Layout/
    │   ├── Header.tsx               # 상단바 + API 키 설정 모달
    │   ├── Sidebar.tsx              # BOM 트리 사이드바 (접기/펼치기)
    │   └── TabBar.tsx               # 6개 탭 네비게이션
    ├── ECO/
    │   ├── ECODashboard.tsx         # 탭1: ECO 목록/통계/카드
    │   └── ECOCreateModal.tsx       # 신규 ECO 생성 모달
    ├── Analysis/
    │   └── ImpactAnalyzer.tsx       # 탭2: AI 영향 분석
    ├── CodeGen/
    │   └── CodeGenerator.tsx        # 탭3: AI 코드 생성 (Before/After diff)
    ├── TestGen/
    │   └── TestGenerator.tsx        # 탭4: AI 테스트 생성 (분포 차트)
    ├── Report/
    │   └── ReportGenerator.tsx      # 탭5: AI 보고서 생성 (다운로드)
    └── Knowledge/
        └── KnowledgeSearch.tsx      # 탭6: 자연어 지식 검색
```

### 2. Mock 데이터 (완료)
- **BOM 트리**: K-FCS 화력통제시스템 → 사격통제 컴퓨터 / 센서 처리 장치 / 통신 제어 장치 → 7개 조립체
- **SW 모듈 11개**: ballistic-calc, fire-control, safety-interlock, emergency-stop, sensor-fusion, target-tracking, thermal-interface, image-processing, comm-protocol, data-link, encryption
- **ECO 3개**: 사거리 변경(approved/high), 열상 센서 업그레이드(review/medium), 암호화 교체(draft/critical)
- **과거 이력 5개**: 사거리 변경, 칼만 필터 조정, 통신 타이밍, 비상 정지, 다중 표적 교전

### 3. 핵심 기능 (완료)
- **탭1 ECO 대시보드**: 통계 카드, ECO 목록, 상태/우선순위 뱃지, 생성 모달
- **탭2 AI 영향 분석**: Claude API 호출 → 영향 모듈/위험도/과거 사례/공수 산출
- **탭3 AI 코드 생성**: 모듈 선택 → Before/After diff 뷰 → 변경 상세/안전 주의사항
- **탭4 AI 테스트 생성**: 단위/경계값/예외/회귀 테스트 → 분포 차트 → TestLink 내보내기
- **탭5 AI 보고서 생성**: 데이터 준비도 표시 → ECO 완료 보고서 자동 생성 → MD 다운로드
- **탭6 지식 검색**: 자연어 질문 → 과거 이력 RAG → 예시 질문 제공

### 4. 디자인 (완료)
- 다크 테마: 네이비 블루(#0a0e1a ~ #2a3f7a) + 그린 강조색(#00e676)
- 상태 표시: critical(빨강), high(주황), medium(노랑), low(초록)
- ECO 상태: draft(회색), review(노랑), approved(파랑), in-progress(주황), completed(초록)
- 모노스페이스 코드 영역, 산세리프 UI 텍스트

## 실행 방법
```bash
cd eco-devassist
npm install
npm run dev
```

## 데모 시나리오 (설계 문서 Part 4 기준)
1. ECO 대시보드에서 "탄도 계산 모듈 최대 사거리 변경" ECO 선택
2. 영향 분석 탭 → "AI 분석 실행" → 3개 모듈 영향 확인
3. 코드 생성 탭 → ballistic-calc 선택 → Before/After diff 확인
4. 테스트 생성 탭 → 8개 테스트 케이스 확인
5. 보고서 탭 → ECO 완료 보고서 자동 생성
6. 지식 검색 → "이전 사거리 변경 이슈?" 질문

## 빌드 상태
- TypeScript: 0 errors
- Build: SUCCESS (dist/ 생성 완료)
- Bundle: 578KB JS + 23KB CSS (gzip: 176KB + 5KB)
