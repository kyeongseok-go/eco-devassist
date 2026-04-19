import { LayoutDashboard, Search, Code2, TestTube2, FileText, BookOpen, ShieldCheck } from 'lucide-react';
import type { TabType } from '../../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'ECO 대시보드', icon: LayoutDashboard },
  { id: 'analysis', label: '영향 분석', icon: Search },
  { id: 'codegen', label: '코드 생성', icon: Code2 },
  { id: 'testgen', label: '테스트 생성', icon: TestTube2 },
  { id: 'report', label: '보고서', icon: FileText },
  { id: 'knowledge', label: '지식 검색', icon: BookOpen },
  { id: 'compliance', label: 'MISRA-C 검증', icon: ShieldCheck },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="bg-navy-900 border-b border-navy-700 px-4 flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? 'border-accent-green text-accent-green'
                : 'border-transparent text-navy-500 hover:text-gray-300 hover:border-navy-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
