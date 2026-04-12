import { useState } from 'react';
import { ChevronRight, ChevronDown, Box, Cpu, Wrench, CircuitBoard } from 'lucide-react';
import type { BOMItem } from '../../types';
import { bomTree } from '../../data/mockBOM';

interface BOMNodeProps {
  item: BOMItem;
  level: number;
  selectedBOMId: string | null;
  onSelect: (id: string) => void;
}

const typeIcons = {
  system: Box,
  subsystem: Cpu,
  assembly: Wrench,
  part: CircuitBoard,
};

const typeColors = {
  system: 'text-accent-green',
  subsystem: 'text-accent-cyan',
  assembly: 'text-status-medium',
  part: 'text-navy-500',
};

function BOMNode({ item, level, selectedBOMId, onSelect }: BOMNodeProps) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = typeIcons[item.type];
  const isSelected = selectedBOMId === item.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded cursor-pointer hover:bg-navy-800 transition-colors ${isSelected ? 'bg-navy-800 ring-1 ring-accent-green/30' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          onSelect(item.id);
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3.5 h-3.5 text-navy-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-navy-500 shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <Icon className={`w-3.5 h-3.5 shrink-0 ${typeColors[item.type]}`} />
        <span className={`text-xs truncate ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
          {item.name}
        </span>
      </div>
      {expanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <BOMNode key={child.id} item={child} level={level + 1} selectedBOMId={selectedBOMId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  selectedBOMId: string | null;
  onSelectBOM: (id: string) => void;
}

export function Sidebar({ selectedBOMId, onSelectBOM }: SidebarProps) {
  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-700 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-navy-700">
        <h2 className="text-xs font-semibold text-navy-500 uppercase tracking-wider">BOM 구조</h2>
        <p className="text-[10px] text-navy-600 mt-0.5">K-FCS 화력통제시스템</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <BOMNode item={bomTree} level={0} selectedBOMId={selectedBOMId} onSelect={onSelectBOM} />
      </div>
      <div className="px-4 py-2 border-t border-navy-700">
        <div className="flex items-center gap-4 text-[10px] text-navy-600">
          <span className="flex items-center gap-1"><Box className="w-2.5 h-2.5 text-accent-green" /> 체계</span>
          <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5 text-accent-cyan" /> 부체계</span>
          <span className="flex items-center gap-1"><Wrench className="w-2.5 h-2.5 text-status-medium" /> 조립체</span>
        </div>
      </div>
    </aside>
  );
}
