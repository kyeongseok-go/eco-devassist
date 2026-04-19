import { Check, ChevronRight } from 'lucide-react';
import type { TabType, AppState } from '../../types';

interface WorkflowStepperProps {
  activeTab: TabType;
  state: AppState;
  onStepClick: (tab: TabType) => void;
}

interface Step {
  id: TabType;
  label: string;
  shortLabel: string;
}

const steps: Step[] = [
  { id: 'dashboard', label: 'ECO 선택', shortLabel: '1' },
  { id: 'analysis', label: '영향 분석', shortLabel: '2' },
  { id: 'codegen', label: '코드 생성', shortLabel: '3' },
  { id: 'testgen', label: '테스트', shortLabel: '4' },
  { id: 'report', label: '보고서', shortLabel: '5' },
  { id: 'compliance', label: '규격 검증', shortLabel: '6' },
  { id: 'knowledge', label: '지식 검색', shortLabel: '7' },
];

function isStepCompleted(stepId: TabType, state: AppState): boolean {
  switch (stepId) {
    case 'dashboard':
      return state.selectedECO !== null;
    case 'analysis':
      return state.analysisResult !== null;
    case 'codegen':
      return state.generatedCode !== null;
    case 'testgen':
      return state.generatedTests !== null;
    case 'report':
      return state.generatedReport !== null;
    case 'knowledge':
      return false;
    default:
      return false;
  }
}

export function WorkflowStepper({ activeTab, state, onStepClick }: WorkflowStepperProps) {
  return (
    <div className="bg-navy-900/50 border-b border-navy-700/50 px-6 py-2.5">
      <div className="flex items-center justify-center gap-1">
        {steps.map((step, i) => {
          const isActive = activeTab === step.id;
          const isCompleted = isStepCompleted(step.id, state);
          const isPast = steps.findIndex((s) => s.id === activeTab) > i;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${isActive
                    ? 'bg-accent-green/15 text-accent-green ring-1 ring-accent-green/30'
                    : isCompleted
                      ? 'bg-accent-green/5 text-accent-green/70 hover:bg-accent-green/10'
                      : 'text-navy-500 hover:text-navy-400 hover:bg-navy-800/50'
                  }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0
                  ${isActive
                    ? 'bg-accent-green text-navy-950'
                    : isCompleted
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-navy-700 text-navy-500'
                  }`}
                >
                  {isCompleted && !isActive ? <Check className="w-3 h-3" /> : step.shortLabel}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className={`w-3.5 h-3.5 mx-0.5 shrink-0 ${isPast || isCompleted ? 'text-accent-green/30' : 'text-navy-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
