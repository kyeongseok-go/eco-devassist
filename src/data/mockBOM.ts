import type { BOMItem } from '../types';

export const bomTree: BOMItem = {
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
        {
          id: 'ASM-003',
          name: '사격통제 프로세서',
          partNumber: 'FCP-150',
          type: 'assembly',
          relatedSWModules: ['fire-control'],
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
        {
          id: 'ASM-004',
          name: '열상 센서 인터페이스',
          partNumber: 'TSI-500',
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
        {
          id: 'ASM-007',
          name: '통신 프로토콜 처리기',
          partNumber: 'CPH-620',
          type: 'assembly',
          relatedSWModules: ['comm-protocol'],
        },
      ],
    },
  ],
};
