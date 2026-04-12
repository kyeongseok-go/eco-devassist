import type { ECO } from '../types';

export const mockECOs: ECO[] = [
  {
    id: 'ECO-2026-001',
    title: '탄도 계산 모듈 최대 사거리 변경 (40km → 52km)',
    status: 'approved',
    priority: 'high',
    requestDate: '2026-03-15',
    requester: '김탄도',
    targetBOMItem: 'ASM-001',
    changeType: 'parameter',
    changeDescription: 'K-FCS 화력통제시스템의 탄도 계산 모듈(BCM-200)에서 최대 사거리 파라미터를 40km에서 52km로 변경. 신형 포탄(K-307 확장사거리탄) 적용에 따른 성능 개선.',
    reason: '신형 K-307 확장사거리탄 적용으로 인한 사거리 확장 요구. 기존 40km 사거리를 52km로 확장하여 작전 범위 30% 증대.',
  },
  {
    id: 'ECO-2026-002',
    title: '열상 센서 인터페이스 해상도 업그레이드',
    status: 'review',
    priority: 'medium',
    requestDate: '2026-03-20',
    requester: '정영상',
    targetBOMItem: 'ASM-004',
    changeType: 'design',
    changeDescription: '열상 센서 해상도를 640x480에서 1280x1024로 업그레이드. 새로운 열상 카메라 모듈(TSI-500R2) 적용에 따른 인터페이스 수정.',
    reason: '표적 탐지 거리 2배 향상 요구. 기존 센서의 해상도 한계로 인한 원거리 표적 식별률 저하 문제 해결.',
  },
  {
    id: 'ECO-2026-003',
    title: '통신 암호화 알고리즘 교체 (AES-128 → AES-256)',
    status: 'draft',
    priority: 'critical',
    requestDate: '2026-04-01',
    requester: '한통신',
    targetBOMItem: 'ASM-006',
    changeType: 'software',
    changeDescription: '전술 데이터링크의 암호화 알고리즘을 AES-128에서 AES-256-GCM으로 교체. 국방부 보안 정책 변경에 따른 필수 업데이트.',
    reason: '국방부 암호화 규격 변경 (KCMVP 인증 요구사항). 기존 AES-128이 2026년 6월부터 비인증 처리 예정.',
  },
];

export function getECOById(id: string): ECO | undefined {
  return mockECOs.find((e) => e.id === id);
}
