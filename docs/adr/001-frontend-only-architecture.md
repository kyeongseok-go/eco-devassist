# ADR-001: 프론트엔드 Only 아키텍처

## 상태
승인

## 맥락
ECO-DevAssist는 한화에어로스페이스 면접 시연용 데모 프로젝트로, 빠른 구현과 즉시 시연이 가능해야 한다.

## 결정
React SPA + Vercel 서버리스 프록시 구조를 채택한다.
- 프론트엔드: React 18 + TypeScript + Tailwind CSS
- AI 호출: 프로덕션은 Vercel 서버리스 프록시, 로컬은 브라우저 직접 호출
- 데이터: Mock JSON (별도 DB 없음)

## 근거
- 데모 목적상 백엔드 서버 운영 비용과 복잡도 불필요
- 면접장에서 URL 하나로 즉시 시연 가능
- 핵심 가치는 "AI가 ECO 워크플로우를 자동화할 수 있다"는 컨셉 증명

## 프로덕션 대안
- Next.js App Router + API Routes → 서버에서 LLM 호출
- ENOVIA REST API 연동 → 실시간 BOM/ECO 데이터 조회
- 온프레미스 LLM (Llama/Mistral) 배포 → 방산 보안 요구사항 충족

## 결과
- 구현 속도: 1주 내 MVP 완성
- 트레이드오프: 실시간 데이터 없음, API 키 관리 주의 필요
