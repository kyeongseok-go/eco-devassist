import { describe, it, expect } from 'vitest';
import { buildImpactPrompt, buildCodePrompt, buildTestPrompt, buildReportPrompt, buildKnowledgePrompt } from '../services/promptTemplates';
import { bomTree } from '../data/mockBOM';
import { swModules } from '../data/mockSWModules';
import { ecoHistory } from '../data/mockHistory';
import type { ECO } from '../types';

const sampleECO: ECO = {
  id: 'ECO-TEST-001',
  title: 'Test ECO',
  status: 'approved',
  priority: 'high',
  requestDate: '2026-04-12',
  requester: 'Tester',
  targetBOMItem: 'ASM-001',
  changeType: 'parameter',
  changeDescription: '최대 사거리 40km → 52km 변경',
  reason: '신형 포탄 적용',
};

describe('Prompt Templates', () => {
  describe('buildImpactPrompt', () => {
    it('includes ECO information', () => {
      const prompt = buildImpactPrompt(sampleECO, bomTree, swModules, ecoHistory);
      expect(prompt).toContain('ECO-TEST-001');
      expect(prompt).toContain('ASM-001');
      expect(prompt).toContain('사거리');
    });

    it('includes BOM structure', () => {
      const prompt = buildImpactPrompt(sampleECO, bomTree, swModules, ecoHistory);
      expect(prompt).toContain('K-FCS');
      expect(prompt).toContain('SYS-001');
    });

    it('includes SW modules', () => {
      const prompt = buildImpactPrompt(sampleECO, bomTree, swModules, ecoHistory);
      expect(prompt).toContain('ballistic-calc');
      expect(prompt).toContain('fire-control');
    });

    it('includes history for RAG', () => {
      const prompt = buildImpactPrompt(sampleECO, bomTree, swModules, ecoHistory);
      expect(prompt).toContain('HIST-001');
      expect(prompt).toContain('lessonsLearned');
    });

    it('requests JSON response format', () => {
      const prompt = buildImpactPrompt(sampleECO, bomTree, swModules, ecoHistory);
      expect(prompt).toContain('JSON 형식');
      expect(prompt).toContain('affectedModules');
      expect(prompt).toContain('riskLevel');
    });
  });

  describe('buildCodePrompt', () => {
    it('includes current code snippet', () => {
      const module = swModules[0]; // ballistic-calc
      const prompt = buildCodePrompt(sampleECO, module, []);
      expect(prompt).toContain('MAX_RANGE');
      expect(prompt).toContain('calculate_trajectory');
    });

    it('includes ECO comment instruction', () => {
      const module = swModules[0];
      const prompt = buildCodePrompt(sampleECO, module, []);
      expect(prompt).toContain('ECO-ECO-TEST-001');
    });

    it('includes related module interfaces', () => {
      const module = swModules[0];
      const related = [swModules[2]]; // safety-interlock
      const prompt = buildCodePrompt(sampleECO, module, related);
      expect(prompt).toContain('안전 연동');
    });

    it('specifies safety requirements', () => {
      const module = swModules[0];
      const prompt = buildCodePrompt(sampleECO, module, []);
      expect(prompt).toContain('방어적 프로그래밍');
      expect(prompt).toContain('경계값 검사');
    });
  });

  describe('buildTestPrompt', () => {
    it('includes DO-178C reference', () => {
      const module = swModules[0];
      const prompt = buildTestPrompt(sampleECO, 'code here', module);
      expect(prompt).toContain('DO-178C');
    });

    it('requests all 4 test types', () => {
      const module = swModules[0];
      const prompt = buildTestPrompt(sampleECO, 'code', module);
      expect(prompt).toContain('단위 테스트');
      expect(prompt).toContain('경계값 테스트');
      expect(prompt).toContain('예외 테스트');
      expect(prompt).toContain('회귀 테스트');
    });
  });

  describe('buildReportPrompt', () => {
    it('includes all 6 report sections', () => {
      const prompt = buildReportPrompt(sampleECO, 'analysis', 'code', 'tests');
      expect(prompt).toContain('변경 개요');
      expect(prompt).toContain('영향 분석 요약');
      expect(prompt).toContain('SW 변경 상세');
      expect(prompt).toContain('검증 결과');
      expect(prompt).toContain('잔여 위험');
      expect(prompt).toContain('승인 내역');
    });
  });

  describe('buildKnowledgePrompt', () => {
    it('includes user question', () => {
      const prompt = buildKnowledgePrompt('사거리 변경 이슈?', ecoHistory);
      expect(prompt).toContain('사거리 변경 이슈?');
    });

    it('includes all history records', () => {
      const prompt = buildKnowledgePrompt('test', ecoHistory);
      ecoHistory.forEach((h) => {
        expect(prompt).toContain(h.id);
      });
    });
  });
});
