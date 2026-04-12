import { describe, it, expect } from 'vitest';
import type { BOMItem, ECO, TestCase } from '../types';

describe('Type definitions integrity', () => {
  it('BOMItem has required fields', () => {
    const item: BOMItem = {
      id: 'SYS-001',
      name: 'Test System',
      partNumber: 'TS-001',
      type: 'system',
      relatedSWModules: ['mod-1'],
    };
    expect(item.id).toBe('SYS-001');
    expect(item.type).toBe('system');
    expect(item.children).toBeUndefined();
  });

  it('BOMItem supports nested children', () => {
    const item: BOMItem = {
      id: 'SYS-001',
      name: 'Parent',
      partNumber: 'P-001',
      type: 'system',
      relatedSWModules: [],
      children: [
        { id: 'SUB-001', name: 'Child', partNumber: 'C-001', type: 'subsystem', relatedSWModules: ['mod-1'] },
      ],
    };
    expect(item.children).toHaveLength(1);
    expect(item.children![0].type).toBe('subsystem');
  });

  it('ECO has all required status values', () => {
    const statuses: ECO['status'][] = ['draft', 'review', 'approved', 'in-progress', 'completed'];
    expect(statuses).toHaveLength(5);
  });

  it('ECO has all required priority values', () => {
    const priorities: ECO['priority'][] = ['critical', 'high', 'medium', 'low'];
    expect(priorities).toHaveLength(4);
  });

  it('TestCase has all required type values', () => {
    const types: TestCase['type'][] = ['unit', 'boundary', 'exception', 'regression'];
    expect(types).toHaveLength(4);
  });
});
