import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../hooks/useAppState';
import type { ECO, AnalysisResult, TestCase } from '../types';

describe('useAppState hook', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useAppState());
    const [state] = result.current;
    expect(state.ecos.length).toBeGreaterThan(0);
    expect(state.selectedECO).toBeNull();
    expect(state.activeTab).toBe('dashboard');
    expect(state.analysisResult).toBeNull();
    expect(state.generatedCode).toBeNull();
    expect(state.generatedTests).toBeNull();
    expect(state.generatedReport).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.selectedModuleId).toBeNull();
  });

  it('SELECT_ECO sets selectedECO', () => {
    const { result } = renderHook(() => useAppState());
    const eco: ECO = {
      id: 'TEST-001', title: 'Test', status: 'draft', priority: 'low',
      requestDate: '2026-01-01', requester: 'Tester', targetBOMItem: 'ASM-001',
      changeType: 'parameter', changeDescription: 'Test change', reason: 'Test reason',
    };
    act(() => {
      result.current[1]({ type: 'SELECT_ECO', payload: eco });
    });
    expect(result.current[0].selectedECO).toEqual(eco);
  });

  it('SET_TAB changes active tab', () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current[1]({ type: 'SET_TAB', payload: 'analysis' });
    });
    expect(result.current[0].activeTab).toBe('analysis');
  });

  it('SET_LOADING toggles loading state', () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current[1]({ type: 'SET_LOADING', payload: true });
    });
    expect(result.current[0].isLoading).toBe(true);
    act(() => {
      result.current[1]({ type: 'SET_LOADING', payload: false });
    });
    expect(result.current[0].isLoading).toBe(false);
  });

  it('SET_ANALYSIS sets analysis result and clears loading', () => {
    const { result } = renderHook(() => useAppState());
    const analysis: AnalysisResult = {
      affectedModules: [{ moduleId: 'mod-1', moduleName: 'Test', riskLevel: 'High', reason: 'test', estimatedEffort: '2일' }],
      similarECOs: [],
      totalEstimatedDays: 5,
      warnings: ['warning1'],
      recommendations: ['rec1'],
    };
    act(() => {
      result.current[1]({ type: 'SET_LOADING', payload: true });
      result.current[1]({ type: 'SET_ANALYSIS', payload: analysis });
    });
    expect(result.current[0].analysisResult).toEqual(analysis);
    expect(result.current[0].isLoading).toBe(false);
  });

  it('SET_CODE sets generated code and clears loading', () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current[1]({ type: 'SET_LOADING', payload: true });
      result.current[1]({ type: 'SET_CODE', payload: 'int main() {}' });
    });
    expect(result.current[0].generatedCode).toBe('int main() {}');
    expect(result.current[0].isLoading).toBe(false);
  });

  it('SET_TESTS sets generated tests and clears loading', () => {
    const { result } = renderHook(() => useAppState());
    const tests: TestCase[] = [
      { id: 'TC-001', type: 'unit', description: 'test', input: 'in', expectedResult: 'out', priority: 'High' },
    ];
    act(() => {
      result.current[1]({ type: 'SET_TESTS', payload: tests });
    });
    expect(result.current[0].generatedTests).toEqual(tests);
  });

  it('SET_REPORT sets generated report and clears loading', () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current[1]({ type: 'SET_REPORT', payload: '# Report' });
    });
    expect(result.current[0].generatedReport).toBe('# Report');
  });

  it('CREATE_ECO adds new ECO to list', () => {
    const { result } = renderHook(() => useAppState());
    const initialCount = result.current[0].ecos.length;
    const newEco: ECO = {
      id: 'NEW-001', title: 'New ECO', status: 'draft', priority: 'medium',
      requestDate: '2026-04-12', requester: 'Tester', targetBOMItem: 'ASM-001',
      changeType: 'software', changeDescription: 'New change', reason: 'New reason',
    };
    act(() => {
      result.current[1]({ type: 'CREATE_ECO', payload: newEco });
    });
    expect(result.current[0].ecos).toHaveLength(initialCount + 1);
    expect(result.current[0].ecos[initialCount]).toEqual(newEco);
  });

  it('UPDATE_ECO_STATUS changes ECO status', () => {
    const { result } = renderHook(() => useAppState());
    const firstEcoId = result.current[0].ecos[0].id;
    act(() => {
      result.current[1]({ type: 'UPDATE_ECO_STATUS', payload: { id: firstEcoId, status: 'completed' } });
    });
    const updated = result.current[0].ecos.find((e) => e.id === firstEcoId);
    expect(updated?.status).toBe('completed');
  });

  it('SELECT_MODULE sets selected module ID', () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current[1]({ type: 'SELECT_MODULE', payload: 'ballistic-calc' });
    });
    expect(result.current[0].selectedModuleId).toBe('ballistic-calc');
  });

  it('immutability: state objects are new references after dispatch', () => {
    const { result } = renderHook(() => useAppState());
    const prevState = result.current[0];
    act(() => {
      result.current[1]({ type: 'SET_TAB', payload: 'codegen' });
    });
    expect(result.current[0]).not.toBe(prevState);
  });
});
