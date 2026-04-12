import { describe, it, expect } from 'vitest';
import { bomTree } from '../data/mockBOM';
import { swModules, getModuleById, getModulesByBOMItem } from '../data/mockSWModules';
import { mockECOs, getECOById } from '../data/mockECOs';
import { ecoHistory } from '../data/mockHistory';

describe('Mock BOM Data', () => {
  it('has root system node', () => {
    expect(bomTree.id).toBe('SYS-001');
    expect(bomTree.type).toBe('system');
    expect(bomTree.name).toContain('K-FCS');
  });

  it('has 3 subsystems', () => {
    expect(bomTree.children).toHaveLength(3);
    bomTree.children!.forEach((child) => {
      expect(child.type).toBe('subsystem');
    });
  });

  it('has 7 assemblies total', () => {
    let assemblyCount = 0;
    bomTree.children!.forEach((sub) => {
      if (sub.children) {
        assemblyCount += sub.children.length;
      }
    });
    expect(assemblyCount).toBe(7);
  });

  it('all BOM items have unique IDs', () => {
    const ids = new Set<string>();
    function collectIds(item: typeof bomTree) {
      ids.add(item.id);
      item.children?.forEach(collectIds);
    }
    collectIds(bomTree);
    expect(ids.size).toBe(1 + 3 + 7); // 1 system + 3 subsystems + 7 assemblies
  });

  it('all BOM items have partNumbers', () => {
    function checkPartNumbers(item: typeof bomTree) {
      expect(item.partNumber).toBeTruthy();
      item.children?.forEach(checkPartNumbers);
    }
    checkPartNumbers(bomTree);
  });
});

describe('Mock SW Modules', () => {
  it('has 11 modules', () => {
    expect(swModules).toHaveLength(11);
  });

  it('all modules have unique IDs', () => {
    const ids = new Set(swModules.map((m) => m.id));
    expect(ids.size).toBe(swModules.length);
  });

  it('all modules have code snippets', () => {
    swModules.forEach((m) => {
      expect(m.codeSnippet.length).toBeGreaterThan(10);
    });
  });

  it('all modules have valid languages', () => {
    const validLangs = ['C', 'C++', 'Python', 'Java', 'TypeScript'];
    swModules.forEach((m) => {
      expect(validLangs).toContain(m.language);
    });
  });

  it('getModuleById returns correct module', () => {
    const mod = getModuleById('ballistic-calc');
    expect(mod).toBeDefined();
    expect(mod!.name).toContain('탄도');
  });

  it('getModuleById returns undefined for invalid ID', () => {
    expect(getModuleById('nonexistent')).toBeUndefined();
  });

  it('getModulesByBOMItem returns related modules', () => {
    const modules = getModulesByBOMItem('ASM-001');
    expect(modules.length).toBeGreaterThan(0);
    modules.forEach((m) => {
      expect(m.relatedBOMItems).toContain('ASM-001');
    });
  });

  it('module dependencies reference existing modules', () => {
    const moduleIds = new Set(swModules.map((m) => m.id));
    swModules.forEach((m) => {
      m.dependencies.forEach((dep) => {
        expect(moduleIds.has(dep)).toBe(true);
      });
    });
  });
});

describe('Mock ECOs', () => {
  it('has 3 ECOs', () => {
    expect(mockECOs).toHaveLength(3);
  });

  it('has diverse statuses', () => {
    const statuses = new Set(mockECOs.map((e) => e.status));
    expect(statuses.size).toBeGreaterThanOrEqual(3);
  });

  it('has diverse priorities', () => {
    const priorities = new Set(mockECOs.map((e) => e.priority));
    expect(priorities.size).toBeGreaterThanOrEqual(3);
  });

  it('getECOById returns correct ECO', () => {
    const eco = getECOById('ECO-2026-001');
    expect(eco).toBeDefined();
    expect(eco!.title).toContain('사거리');
  });

  it('all ECOs have target BOM items', () => {
    mockECOs.forEach((e) => {
      expect(e.targetBOMItem).toBeTruthy();
    });
  });
});

describe('Mock ECO History', () => {
  it('has 5 history records', () => {
    expect(ecoHistory).toHaveLength(5);
  });

  it('all records have lessons learned', () => {
    ecoHistory.forEach((h) => {
      expect(h.lessonsLearned.length).toBeGreaterThan(10);
    });
  });

  it('all records have issues encountered', () => {
    ecoHistory.forEach((h) => {
      expect(h.issuesEncountered.length).toBeGreaterThan(10);
    });
  });

  it('all records have unique IDs', () => {
    const ids = new Set(ecoHistory.map((h) => h.id));
    expect(ids.size).toBe(ecoHistory.length);
  });
});
