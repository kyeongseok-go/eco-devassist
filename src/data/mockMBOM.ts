import type { BOMItem } from '../types';

// MBOM (Manufacturing BOM) — 제조팀이 만든 "이렇게 만든다" BOM
// EBOM과 의도적으로 차이를 둬서 정합성 검증 데모에 사용
export const mbomTree: BOMItem = {
  id: 'SYS-001',
  name: 'K-FCS 화력통제시스템',
  partNumber: 'K-FCS-2024',
  type: 'system',
  relatedSWModules: [],
  children: [
    {
      id: 'SUB-001',
      name: '사격통제 컴퓨터',
      partNumber: 'FCC-100',
      type: 'subsystem',
      relatedSWModules: ['ballistic-calc', 'fire-control', 'safety-interlock'],
      children: [
        {
          id: 'ASM-001',
          name: '탄도 계산 모듈',
          partNumber: 'BCM-200',
          type: 'assembly',
          relatedSWModules: ['ballistic-calc'],
        },
        {
          id: 'ASM-002',
          name: '안전 연동 장치',
          partNumber: 'SIL-300',
          type: 'assembly',
          relatedSWModules: ['safety-interlock', 'emergency-stop'],
        },
        // 차이 1: MBOM에서는 FCP-150 대신 FCP-150R2 (개정판)
        {
          id: 'ASM-003',
          name: '사격통제 프로세서 (Rev.2)',
          partNumber: 'FCP-150R2',
          type: 'assembly',
          relatedSWModules: ['fire-control'],
        },
        // 차이 2: MBOM에 추가된 냉각 모듈 (EBOM에 없음)
        {
          id: 'ASM-008',
          name: '프로세서 냉각 모듈',
          partNumber: 'PCM-160',
          type: 'assembly',
          relatedSWModules: [],
        },
      ],
    },
    {
      id: 'SUB-002',
      name: '센서 처리 장치',
      partNumber: 'SPU-400',
      type: 'subsystem',
      relatedSWModules: ['sensor-fusion', 'target-tracking'],
      children: [
        // 차이 3: 부품번호 변경 (TSI-500 → TSI-500R2)
        {
          id: 'ASM-004',
          name: '열상 센서 인터페이스 (Rev.2)',
          partNumber: 'TSI-500R2',
          type: 'assembly',
          relatedSWModules: ['thermal-interface', 'image-processing'],
        },
        {
          id: 'ASM-005',
          name: '레이저 거리측정기',
          partNumber: 'LRF-510',
          type: 'assembly',
          relatedSWModules: ['sensor-fusion'],
        },
      ],
    },
    {
      id: 'SUB-003',
      name: '통신 제어 장치',
      partNumber: 'CCU-600',
      type: 'subsystem',
      relatedSWModules: ['comm-protocol', 'data-link', 'encryption'],
      children: [
        {
          id: 'ASM-006',
          name: '전술 데이터링크',
          partNumber: 'TDL-610',
          type: 'assembly',
          relatedSWModules: ['data-link', 'encryption'],
        },
        // 차이 4: EBOM의 CPH-620이 MBOM에서 누락됨
      ],
    },
  ],
};

export interface BOMDiff {
  type: 'added' | 'removed' | 'modified';
  severity: 'high' | 'medium' | 'low';
  ebomItem?: { id: string; name: string; partNumber: string };
  mbomItem?: { id: string; name: string; partNumber: string };
  description: string;
}

export function compareBOMs(ebom: BOMItem, mbom: BOMItem): BOMDiff[] {
  const diffs: BOMDiff[] = [];

  function flattenBOM(item: BOMItem, list: Map<string, BOMItem>) {
    list.set(item.id, item);
    item.children?.forEach((child) => flattenBOM(child, list));
  }

  const ebomMap = new Map<string, BOMItem>();
  const mbomMap = new Map<string, BOMItem>();
  flattenBOM(ebom, ebomMap);
  flattenBOM(mbom, mbomMap);

  // EBOM에 있지만 MBOM에 없는 항목
  for (const [id, item] of ebomMap) {
    if (!mbomMap.has(id)) {
      diffs.push({
        type: 'removed',
        severity: 'high',
        ebomItem: { id: item.id, name: item.name, partNumber: item.partNumber },
        description: `설계 BOM의 "${item.name}" (${item.partNumber})이 제조 BOM에서 누락됨`,
      });
    }
  }

  // MBOM에 있지만 EBOM에 없는 항목
  for (const [id, item] of mbomMap) {
    if (!ebomMap.has(id)) {
      diffs.push({
        type: 'added',
        severity: 'medium',
        mbomItem: { id: item.id, name: item.name, partNumber: item.partNumber },
        description: `제조 BOM에 "${item.name}" (${item.partNumber})이 추가됨 (설계 BOM에 없음)`,
      });
    }
  }

  // 양쪽 다 있지만 속성이 다른 항목
  for (const [id, ebomItem] of ebomMap) {
    const mbomItem = mbomMap.get(id);
    if (mbomItem) {
      if (ebomItem.partNumber !== mbomItem.partNumber) {
        diffs.push({
          type: 'modified',
          severity: 'high',
          ebomItem: { id: ebomItem.id, name: ebomItem.name, partNumber: ebomItem.partNumber },
          mbomItem: { id: mbomItem.id, name: mbomItem.name, partNumber: mbomItem.partNumber },
          description: `부품번호 불일치: EBOM "${ebomItem.partNumber}" vs MBOM "${mbomItem.partNumber}"`,
        });
      }
      if (ebomItem.name !== mbomItem.name) {
        diffs.push({
          type: 'modified',
          severity: 'low',
          ebomItem: { id: ebomItem.id, name: ebomItem.name, partNumber: ebomItem.partNumber },
          mbomItem: { id: mbomItem.id, name: mbomItem.name, partNumber: mbomItem.partNumber },
          description: `명칭 변경: EBOM "${ebomItem.name}" vs MBOM "${mbomItem.name}"`,
        });
      }
    }
  }

  return diffs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
}
