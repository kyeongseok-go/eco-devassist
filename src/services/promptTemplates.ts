import type { ECO, SWModule, BOMItem, ECOHistory } from '../types';

export function buildImpactPrompt(
  eco: ECO,
  bomTree: BOMItem,
  swModules: SWModule[],
  history: ECOHistory[]
): string {
  return `당신은 방산 R&D SW 개발자를 위한 형상변경 영향 분석 AI입니다.

[ECO 정보]
- ECO ID: ${eco.id}
- 변경 대상: ${eco.targetBOMItem}
- 변경 유형: ${eco.changeType}
- 변경 내용: ${eco.changeDescription}
- 변경 사유: ${eco.reason}

[BOM 구조]
${JSON.stringify(bomTree, null, 2)}

[SW 모듈 목록]
${JSON.stringify(swModules.map(m => ({
  id: m.id, name: m.name, description: m.description,
  dependencies: m.dependencies, relatedBOMItems: m.relatedBOMItems
})), null, 2)}

[과거 유사 ECO 이력]
${JSON.stringify(history, null, 2)}

다음을 분석해주세요:
1. 이 변경으로 영향받는 SW 모듈 목록과 이유
2. 각 모듈의 위험도 (High/Medium/Low)
3. 과거 유사 변경에서 발생했던 이슈
4. 예상 작업 공수 (인일 단위)
5. 주의사항 및 권장 사항

반드시 다음 JSON 형식으로만 응답해주세요 (다른 텍스트 없이):
{
  "affectedModules": [
    { "moduleId": "...", "moduleName": "...", "riskLevel": "High|Medium|Low", "reason": "...", "estimatedEffort": "N일" }
  ],
  "similarECOs": [
    { "ecoId": "...", "title": "...", "issues": "...", "lessons": "..." }
  ],
  "totalEstimatedDays": 0,
  "warnings": ["..."],
  "recommendations": ["..."]
}`;
}

export function buildCodePrompt(
  eco: ECO,
  module: SWModule,
  relatedModules: SWModule[]
): string {
  return `당신은 방산 체계 SW 코드를 작성하는 시니어 개발자입니다.
안전 관련 SW이므로 방어적 프로그래밍, 경계값 검사, 에러 핸들링을 철저히 합니다.

[ECO 변경 내용]
- ECO ID: ${eco.id}
- 변경 설명: ${eco.changeDescription}
- 변경 사유: ${eco.reason}

[현재 코드 - ${module.name} (${module.filePath})]
\`\`\`${module.language.toLowerCase()}
${module.codeSnippet}
\`\`\`

[관련 모듈 인터페이스]
${relatedModules.map(m => `// ${m.name} (${m.filePath})\n${m.codeSnippet}`).join('\n\n')}

다음을 수행해주세요:
1. 변경 사항을 반영한 수정 코드를 생성
2. 변경된 부분에 // ECO-${eco.id} 주석 추가
3. 안전 관련 로직은 반드시 경계값 검사 포함
4. Before/After 비교 설명

반드시 아래 형식으로 응답해주세요. 코드와 메타데이터를 분리합니다.

===MODIFIED_CODE_START===
(수정된 전체 코드를 여기에 작성)
===MODIFIED_CODE_END===

===META_START===
{
  "changes": [
    { "line": "변경된 라인 설명", "before": "변경 전", "after": "변경 후", "reason": "변경 사유" }
  ],
  "safetyNotes": ["안전 관련 주의사항"],
  "summary": "변경 요약 설명"
}
===META_END===`;
}

export function buildTestPrompt(
  eco: ECO,
  modifiedCode: string,
  module: SWModule
): string {
  return `당신은 방산 SW 테스트 엔지니어입니다.
DO-178C 수준의 테스트 커버리지를 목표로 합니다.

[변경된 코드 - ${module.name}]
\`\`\`${module.language.toLowerCase()}
${modifiedCode}
\`\`\`

[ECO 변경 내용 요약]
${eco.changeDescription}

다음 테스트를 생성해주세요:
1. 단위 테스트 (정상 동작 확인)
2. 경계값 테스트 (최소/최대/경계 근처 값)
3. 예외 테스트 (잘못된 입력, 에러 상황)
4. 회귀 테스트 (기존 기능 영향 없음 확인)

다음 JSON 형식으로만 응답해주세요:
{
  "testCases": [
    {
      "id": "TC-XXX-NNN",
      "type": "unit|boundary|exception|regression",
      "description": "테스트 설명",
      "input": "입력값",
      "expectedResult": "예상 결과",
      "priority": "High|Medium|Low"
    }
  ]
}`;
}

export function buildReportPrompt(
  eco: ECO,
  analysisResult: string,
  codeChanges: string,
  testResults: string
): string {
  return `당신은 방산 R&D 기술 문서 작성 전문가입니다.

[ECO 정보]
${JSON.stringify(eco, null, 2)}

[영향 분석 결과]
${analysisResult}

[코드 변경 내역]
${codeChanges}

[테스트 결과]
${testResults}

다음 양식의 ECO 완료 보고서를 마크다운 형식으로 작성해주세요:

# ECO 완료 보고서

## 1. 변경 개요
## 2. 영향 분석 요약
## 3. SW 변경 상세
## 4. 검증 결과
## 5. 잔여 위험 및 조치 계획
## 6. 승인 내역

각 섹션을 상세하게 작성해주세요. 방산 기술 문서 양식에 맞게 격식체를 사용합니다.`;
}

export function buildKnowledgePrompt(
  question: string,
  history: ECOHistory[]
): string {
  return `당신은 방산 R&D SW 개발 지식 관리 AI입니다.

[과거 ECO 이력 데이터베이스]
${JSON.stringify(history, null, 2)}

[사용자 질문]
${question}

과거 이력에서 관련 사례를 찾아 다음 형식으로 답변해주세요:

1. 관련 사례 요약
2. 발생했던 문제점
3. 해결 방법
4. 교훈 및 권장 사항

답변은 실용적이고 구체적으로 작성하세요.`;
}
