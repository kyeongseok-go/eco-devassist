# ADR-003: Claude API 선택 근거

## 상태
승인

## 맥락
ECO 워크플로우 자동화에는 고품질 한국어 LLM이 필요하다. 영향 분석, 코드 생성, 테스트 생성, 보고서 작성 4가지 작업을 수행해야 한다.

## 결정
Anthropic Claude (claude-sonnet-4-20250514) 모델을 사용한다.

## 근거
- JSON 응답 안정성: 구조화된 JSON 출력이 안정적 → 프론트엔드 파싱 용이
- 한국어 품질: 방산 기술 용어(형상관리, 탄도계산, MISRA-C 등)에 대한 이해도 높음
- 프롬프트 엔지니어링: System/User 역할 분리 + 4종 프롬프트 템플릿으로 일관된 출력
- 코드 생성 능력: C/C++ 방산 코드에 대한 수정 초안 품질이 우수

## 프로덕션 대안
- 방산 환경에서는 클라우드 AI 사용 불가 (군사 기밀 데이터 외부 전송 금지)
- 온프레미스 배포: Llama 3 / Mistral / Qwen 등 오픈소스 LLM
- 추론 서버: vLLM 또는 TGI로 사내 GPU에 배포
- API 호환: OpenAI 호환 API로 래핑 → 코드 최소 수정으로 전환 가능
- claudeApi.ts의 callDirect() → callViaProxy()로 URL만 변경하면 됨

## 설계 패턴
- PromptFactory 패턴: promptTemplates.ts에서 4종 프롬프트를 Factory 방식으로 관리
- TmaxGAIA에서의 CommandHandlerFactory, WriterFactory 패턴과 동일한 설계 철학
