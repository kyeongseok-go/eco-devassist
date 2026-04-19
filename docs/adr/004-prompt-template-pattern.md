# ADR-004: 프롬프트 템플릿 패턴

## 상태
승인

## 맥락
5가지 AI 작업(영향분석, 코드생성, 테스트생성, 보고서, 지식검색)에 대해 각각 다른 프롬프트가 필요하다. 프롬프트의 일관성과 유지보수성을 확보해야 한다.

## 결정
Factory 패턴으로 프롬프트 템플릿을 분리 관리한다.
- promptTemplates.ts에 5개 빌더 함수 정의
- 각 함수는 ECO/모듈/이력 데이터를 받아 완전한 프롬프트 문자열 반환
- 응답 형식(JSON 스키마)을 프롬프트에 명시하여 파싱 안정성 확보

## 근거
- 단일 책임: 각 프롬프트는 하나의 작업만 담당
- 테스트 가능: 프롬프트 빌더를 독립적으로 단위 테스트 (14개 테스트 통과)
- 확장 용이: 새로운 AI 작업 추가 시 빌더 함수만 추가

## 설계자의 실무 경험
- TmaxGAIA CommandHandlerFactory: 100+ 커맨드를 팩토리 패턴으로 관리
- TmaxGAIA WriterFactory: HWP/HWPX/HTML/DOCX 포맷별 Writer를 팩토리로 분기
- 동일한 패턴을 AI 프롬프트 관리에 적용

## 코드 구조
```
promptTemplates.ts
├── buildImpactPrompt()     → 영향 분석 (JSON 응답)
├── buildCodePrompt()       → 코드 생성 (구분자 기반 파싱)
├── buildTestPrompt()       → 테스트 생성 (JSON 응답)
├── buildReportPrompt()     → 보고서 (마크다운 응답)
├── buildKnowledgePrompt()  → 지식 검색 (자연어 응답)
└── buildMisraCPrompt()     → 규격 검증 (JSON 응답)
```
