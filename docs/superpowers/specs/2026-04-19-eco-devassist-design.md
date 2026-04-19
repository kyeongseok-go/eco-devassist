# ECO-DevAssist 설계 스펙 (Post-Implementation Review)

> 브레인스토밍 스킬을 통한 구현 후 설계 검토

## 1. 프로젝트 정의

### 목적
방산 R&D에서 ECO(Engineering Change Order)가 발생했을 때 SW 개발자의 반복 작업을 AI로 자동화하는 웹 데모 앱.

### 대상 사용자
- 1차: 한화에어로스페이스 면접관 (개발자 또는 PLM 엔지니어)
- 2차: 방산 R&D SW 개발자 (프로덕션 전환 시)

### 핵심 가치 제안
"ECO가 발생하면, AI가 영향 분석 → 코드 수정 → 테스트 생성 → 규격 검증 → 보고서 작성을 자동으로 수행하여, 개발자는 설계 판단에만 집중"

## 2. 기술 스택

| 계층 | 기술 | 선택 근거 (ADR 참조) |
|------|------|---------------------|
| UI Framework | React 18 + TypeScript | ADR-001: 빠른 프로토타이핑 |
| Styling | Tailwind CSS v4 | 군용 다크 테마 커스텀 |
| Charts | Recharts | 도넛/바 차트 시각화 |
| Icons | Lucide React | 일관된 아이콘 시스템 |
| AI | Claude API (Sonnet 4) | ADR-003: JSON 안정성 |
| Build | Vite 8 | HMR 속도 |
| Deploy | Vercel + 서버리스 프록시 | ADR-001, ADR-005 |

## 3. 아키텍처

### 3.1 시스템 구조
```
Browser (React SPA)
  ├── 랜딩 페이지 (경력 매핑 + 워크플로우 시각화)
  ├── 가이드 투어 (5단계 온보딩)
  └── 메인 앱
      ├── Header (API 키 관리)
      ├── WorkflowStepper (프로세스 진행 표시)
      ├── TabBar (7개 탭)
      ├── Sidebar (BOM 트리)
      └── Content Area
          ├── Tab 1: ECO Dashboard (차트 3종 + EBOM/MBOM + 타임라인)
          ├── Tab 2: Impact Analyzer (AI 영향 분석)
          ├── Tab 3: Code Generator (Before/After diff)
          ├── Tab 4: Test Generator (4종 분류 + 분포 차트)
          ├── Tab 5: Report Generator (마크다운 보고서)
          ├── Tab 6: MISRA-C Checker (코딩 규격 검증)
          └── Tab 7: Knowledge Search (RAG 기반)
```

### 3.2 상태 관리
- useReducer 패턴: AppState + Action 타입으로 중앙 집중 관리
- 각 AI 결과(analysisResult, generatedCode, generatedTests, generatedReport)를 글로벌 상태에 유지
- 탭 간 이동 시 AI 결과 보존

### 3.3 데이터 계층
- Mock 데이터가 `data/` 디렉토리에 분리
- BOM/SW모듈/ECO/이력/MBOM 각각 독립 파일
- 프로덕션 전환 시 ENOVIA REST API 클라이언트로 교체 가능 (인터페이스 동일)

### 3.4 AI 서비스 계층
- `claudeApi.ts`: 프로덕션(프록시)/로컬(직접) 이중 경로
- `promptTemplates.ts`: 6종 프롬프트 빌더 (Factory 패턴)
- JSON 파싱: 코드블록 우선 → 중괄호 깊이 추적 (balanced parser)

## 4. Mock 데이터 설계

### 4.1 BOM 트리 (EBOM)
- K-FCS 화력통제시스템 (1 system + 3 subsystems + 7 assemblies = 11 nodes)
- 각 노드에 relatedSWModules 매핑

### 4.2 SW 모듈 (11개)
| 모듈 | 언어 | 핵심 기능 |
|------|------|----------|
| ballistic-calc | C | 탄도 궤적 계산, 사거리/풍향 보정 |
| fire-control | C | 사격 가능 판단, 발사 시퀀스 |
| safety-interlock | C | 안전장치 상태 감시 |
| emergency-stop | C | 비상 정지 제어 |
| sensor-fusion | C++ | 다중 센서 데이터 융합 (칼만 필터) |
| target-tracking | C++ | 표적 추적, 예측 경로 계산 |
| thermal-interface | C | 열상 카메라 인터페이스 |
| image-processing | C++ | 열상 영상 전처리, 표적 탐지 |
| comm-protocol | C | MIL-STD-1553B 통신 |
| data-link | C | 전술 데이터링크 (Link-K) |
| encryption | C | 군용 암호화 (AES-256-GCM) |

### 4.3 ECO (3건)
- 사거리 변경 40→52km (approved/high) — 메인 데모 시나리오
- 열상 센서 해상도 업그레이드 (review/medium)
- 암호화 알고리즘 교체 AES-128→256 (draft/critical)

### 4.4 과거 이력 (5건)
- RAG 기반 지식 검색용, 각각 issuesEncountered + lessonsLearned 포함

### 4.5 MBOM (EBOM 대비 4건 차이)
- FCP-150 → FCP-150R2 (부품번호 변경)
- PCM-160 냉각 모듈 추가 (EBOM에 없음)
- TSI-500 → TSI-500R2 (부품번호 변경)
- CPH-620 통신 프로토콜 처리기 누락

## 5. UI/UX 설계

### 5.1 디자인 시스템
- **테마**: 다크 밀리터리 (네이비 블루 + 그린 강조)
- **색상 팔레트**:
  - 배경: navy-950(#0a0e1a) ~ navy-500(#3a5599)
  - 강조: accent-green(#00e676), accent-cyan(#00bcd4)
  - 상태: critical(빨강), high(주황), medium(노랑), low(초록)
  - ECO 상태: draft(회색), review(노랑), approved(파랑), in-progress(주황), completed(초록)
- **폰트**: Inter (UI) + JetBrains Mono (코드)

### 5.2 사용자 플로우
```
랜딩 → 가이드 투어 → 대시보드 → ECO 선택 → 영향분석 → 코드생성
→ 테스트생성 → MISRA-C 검증 → 보고서 → 지식검색
```

### 5.3 핵심 UX 요소
- 워크플로우 스텝퍼: 상단 진행 표시줄 (완료 시 체크마크)
- 에러 바운더리: AI 실패 시 복구 가능한 UI
- 스켈레톤 로더: AI 호출 중 로딩 표시
- BOM 트리: 접기/펼치기 + 타입별 색상 아이콘

## 6. 보안 설계 (ADR-005 참조)

| 위험 | 데모 대응 | 프로덕션 대응 |
|------|----------|-------------|
| API 키 노출 | localStorage + 주석 명시 | 서버 프록시 (구현 완료) |
| 프롬프트 인젝션 | 인지 + 길이 제한 권장 | 입력 검증 계층 |
| 군사 기밀 데이터 | Mock 데이터 사용 | 온프레미스 LLM + 사내망 |
| LLM 환각 | 개발자 검토 필수 안내 | 검증 파이프라인 |

## 7. 테스트 현황

- 5개 테스트 파일, 63개 테스트 케이스, ALL PASS
- 타입 정의, Mock 데이터 무결성, API 서비스, 상태 관리, 프롬프트 템플릿 검증
- ECC TypeScript Reviewer + Security Reviewer 코드 리뷰 완료

## 8. 설계자의 실무 경험 매핑

| 경력 | ECO-DevAssist 기능 | 설계 근거 |
|------|-------------------|----------|
| IMS 200건+ 이슈 처리 | ECO 대시보드 | 이슈 추적 시스템 설계 경험 |
| Theme/ClrMap 40파일 추적 | AI 영향 분석 | 의존성 추적 실무 경험 |
| 코드 수정 + PR 리뷰 | AI 코드 생성 | Before/After diff 일상적 수행 |
| TestLink 350건 + Jest | AI 테스트 + MISRA-C | 테스트 자동화 체계 구축 |
| 분기보고서 24건+ | AI 보고서 | 기술 문서 작성 역량 |
| 인수인계 문서 다수 | 지식 검색 (RAG) | 조직 지식 체계화 경험 |
| CommandHandlerFactory | 프롬프트 템플릿 패턴 | Factory 패턴 반복 적용 |
| DOM Tree 설계 | BOM 트리 구조 | 계층 구조 설계 전문성 |

## 9. 개선 후보 (Backlog)

### P1 — 높은 임팩트
- [ ] BOM 노드 클릭 시 영향 분석 결과를 트리에 위험도 색상으로 표시
- [ ] 실시간 협업 시뮬레이션 ("김탄도 연구원이 영향분석 중")
- [ ] ECO 통계 대시보드 월별 추이 차트

### P2 — 기술 깊이
- [ ] Zod 기반 AI 응답 런타임 검증
- [ ] 탭별 독립 로딩 상태 (현재 전역 isLoading)
- [ ] React.lazy + Suspense 코드 스플리팅

### P3 — 프로덕션 준비
- [ ] ENOVIA REST API 연동 인터페이스 설계
- [ ] 온프레미스 LLM 배포 가이드 (Llama/Mistral + vLLM)
- [ ] 감사 로그 시스템 설계

## Spec Self-Review Checklist
- [x] 플레이스홀더 없음
- [x] 모순 없음 (데모 vs 프로덕션 명확히 분리)
- [x] 모호한 요구사항 없음
- [x] 스코프 적절 (면접 데모용)
- [x] 모든 ADR 참조 일관됨
