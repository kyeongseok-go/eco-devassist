import { useState } from 'react';
import { GitCompareArrows, AlertTriangle, Plus, Minus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { bomTree } from '../../data/mockBOM';
import { mbomTree, compareBOMs, type BOMDiff } from '../../data/mockMBOM';

const severityConfig = {
  high: { label: 'HIGH', color: 'text-status-critical', bg: 'bg-status-critical/10', icon: AlertTriangle },
  medium: { label: 'MEDIUM', color: 'text-status-high', bg: 'bg-status-high/10', icon: RefreshCw },
  low: { label: 'LOW', color: 'text-status-medium', bg: 'bg-status-medium/10', icon: RefreshCw },
};

const typeConfig = {
  added: { label: '추가됨', color: 'text-accent-green', icon: Plus },
  removed: { label: '누락됨', color: 'text-status-critical', icon: Minus },
  modified: { label: '변경됨', color: 'text-status-high', icon: RefreshCw },
};

export function BOMCompare() {
  const [diffs] = useState<BOMDiff[]>(() => compareBOMs(bomTree, mbomTree));

  const stats = {
    total: diffs.length,
    high: diffs.filter((d) => d.severity === 'high').length,
    medium: diffs.filter((d) => d.severity === 'medium').length,
    low: diffs.filter((d) => d.severity === 'low').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <GitCompareArrows className="w-4 h-4 text-accent-cyan" />
          EBOM vs MBOM 정합성 비교
        </h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-navy-500">EBOM: K-FCS-2024 (설계)</span>
          <span className="text-navy-600">vs</span>
          <span className="text-navy-500">MBOM: K-FCS-2024 (제조)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-navy-800 rounded-lg px-3 py-2 text-center">
          <span className="text-lg font-bold text-white">{stats.total}</span>
          <p className="text-[10px] text-navy-500">불일치 항목</p>
        </div>
        <div className="bg-navy-800 rounded-lg px-3 py-2 text-center">
          <span className="text-lg font-bold text-status-critical">{stats.high}</span>
          <p className="text-[10px] text-navy-500">High</p>
        </div>
        <div className="bg-navy-800 rounded-lg px-3 py-2 text-center">
          <span className="text-lg font-bold text-status-high">{stats.medium}</span>
          <p className="text-[10px] text-navy-500">Medium</p>
        </div>
        <div className="bg-navy-800 rounded-lg px-3 py-2 text-center">
          <span className="text-lg font-bold text-status-medium">{stats.low}</span>
          <p className="text-[10px] text-navy-500">Low</p>
        </div>
      </div>

      {/* Diffs */}
      {diffs.length === 0 ? (
        <div className="bg-accent-green/5 border border-accent-green/20 rounded-lg p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-accent-green mx-auto mb-2" />
          <span className="text-sm text-accent-green">EBOM과 MBOM이 완전히 일치합니다</span>
        </div>
      ) : (
        <div className="space-y-2">
          {diffs.map((diff, i) => {
            const sev = severityConfig[diff.severity];
            const tp = typeConfig[diff.type];
            const TypeIcon = tp.icon;
            return (
              <div key={`${diff.type}-${i}`} className="bg-navy-900 border border-navy-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <TypeIcon className={`w-3.5 h-3.5 ${tp.color}`} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev.color} ${sev.bg}`}>{sev.label}</span>
                  <span className={`text-[10px] font-medium ${tp.color}`}>{tp.label}</span>
                </div>
                <p className="text-xs text-white">{diff.description}</p>
                {diff.ebomItem && diff.mbomItem && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-navy-800 rounded px-2 py-1.5">
                      <span className="text-[10px] text-navy-500">EBOM</span>
                      <p className="text-xs text-gray-300 font-mono">{diff.ebomItem.partNumber}</p>
                    </div>
                    <div className="bg-navy-800 rounded px-2 py-1.5">
                      <span className="text-[10px] text-navy-500">MBOM</span>
                      <p className="text-xs text-gray-300 font-mono">{diff.mbomItem.partNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
