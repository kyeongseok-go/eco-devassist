import { useState } from 'react';
import { Plus, AlertTriangle, Clock, CheckCircle2, FileEdit, Eye, History, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ECO, ECOStatus, ECOPriority, Action, TabType } from '../../types';
import { ECOCreateModal } from './ECOCreateModal';
import { ECOTimeline } from './ECOTimeline';
import { swModules } from '../../data/mockSWModules';

const statusConfig: Record<ECOStatus, { label: string; color: string; bg: string; hex: string }> = {
  draft: { label: '초안', color: 'text-status-draft', bg: 'bg-status-draft/10', hex: '#78909c' },
  review: { label: '검토중', color: 'text-status-review', bg: 'bg-status-review/10', hex: '#ffd600' },
  approved: { label: '승인', color: 'text-status-approved', bg: 'bg-status-approved/10', hex: '#448aff' },
  'in-progress': { label: '진행중', color: 'text-status-inprogress', bg: 'bg-status-inprogress/10', hex: '#ff9100' },
  completed: { label: '완료', color: 'text-status-completed', bg: 'bg-status-completed/10', hex: '#00e676' },
};

const priorityConfig: Record<ECOPriority, { label: string; color: string; bg: string; hex: string }> = {
  critical: { label: 'CRITICAL', color: 'text-status-critical', bg: 'bg-status-critical/10', hex: '#ff1744' },
  high: { label: 'HIGH', color: 'text-status-high', bg: 'bg-status-high/10', hex: '#ff9100' },
  medium: { label: 'MEDIUM', color: 'text-status-medium', bg: 'bg-status-medium/10', hex: '#ffd600' },
  low: { label: 'LOW', color: 'text-status-low', bg: 'bg-status-low/10', hex: '#00e676' },
};

interface ECODashboardProps {
  ecos: ECO[];
  selectedECO: ECO | null;
  dispatch: React.Dispatch<Action>;
}

export function ECODashboard({ ecos, selectedECO, dispatch }: ECODashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const stats = {
    total: ecos.length,
    critical: ecos.filter((e) => e.priority === 'critical').length,
    inProgress: ecos.filter((e) => e.status === 'in-progress' || e.status === 'approved').length,
    completed: ecos.filter((e) => e.status === 'completed').length,
  };

  const statusChartData = Object.entries(
    ecos.reduce<Record<string, number>>((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: statusConfig[status as ECOStatus]?.label || status,
    value: count,
    color: statusConfig[status as ECOStatus]?.hex || '#666',
  }));

  const priorityChartData = Object.entries(
    ecos.reduce<Record<string, number>>((acc, e) => {
      acc[e.priority] = (acc[e.priority] || 0) + 1;
      return acc;
    }, {})
  ).map(([priority, count]) => ({
    name: priorityConfig[priority as ECOPriority]?.label || priority,
    value: count,
    color: priorityConfig[priority as ECOPriority]?.hex || '#666',
  }));

  const moduleChangeData = swModules
    .map((m) => ({
      name: m.name.replace(/ 모듈| 인터페이스/g, ''),
      변경횟수: m.testCases.length,
      의존성: m.dependencies.length,
    }))
    .sort((a, b) => b.변경횟수 - a.변경횟수)
    .slice(0, 6);

  const chartTooltipStyle = {
    contentStyle: { background: '#0f1629', border: '1px solid #1e2d5a', borderRadius: '6px', fontSize: '11px', color: '#e0e0ee' },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={FileEdit} label="전체 ECO" value={stats.total} color="text-white" />
        <StatCard icon={AlertTriangle} label="Critical" value={stats.critical} color="text-status-critical" />
        <StatCard icon={Clock} label="진행중" value={stats.inProgress} color="text-status-inprogress" />
        <StatCard icon={CheckCircle2} label="완료" value={stats.completed} color="text-status-completed" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Status Donut */}
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">상태별 분포</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30} paddingAngle={3}>
                {statusChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusChartData.map((d) => (
              <span key={d.name} className="flex items-center gap-1 text-[10px] text-navy-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Priority Bar */}
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">우선순위 분포</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityChartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#b0b0c0' }} width={65} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {priorityChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module Changes */}
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">모듈별 변경 빈도</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={moduleChangeData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#b0b0c0' }} width={75} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="변경횟수" fill="#00e676" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">ECO 목록</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-green text-navy-950 text-sm font-medium rounded hover:bg-accent-green-dim transition-colors"
        >
          <Plus className="w-4 h-4" />
          신규 ECO 생성
        </button>
      </div>

      {/* ECO Cards */}
      <div className="space-y-3">
        {ecos.map((eco) => {
          const sc = statusConfig[eco.status];
          const pc = priorityConfig[eco.priority];
          const isSelected = selectedECO?.id === eco.id;
          return (
            <div
              key={eco.id}
              className={`bg-navy-900 border rounded-lg p-4 cursor-pointer transition-all hover:border-navy-600 ${
                isSelected ? 'border-accent-green ring-1 ring-accent-green/20' : 'border-navy-700'
              }`}
              onClick={() => dispatch({ type: 'SELECT_ECO', payload: eco })}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-navy-500">{eco.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pc.color} ${pc.bg}`}>
                    {pc.label}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${sc.color} ${sc.bg}`}>
                    {sc.label}
                  </span>
                </div>
                <span className="text-xs text-navy-500">{eco.requestDate}</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">{eco.title}</h3>
              <p className="text-xs text-navy-500 line-clamp-2">{eco.changeDescription}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-navy-600">
                <span>요청자: {eco.requester}</span>
                <span>대상: {eco.targetBOMItem}</span>
                <span>유형: {eco.changeType}</span>
              </div>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-navy-700 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_TAB', payload: 'analysis' as TabType }); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-800 text-accent-green text-xs rounded hover:bg-navy-700 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> AI 영향 분석
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_TAB', payload: 'codegen' as TabType }); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-800 text-accent-cyan text-xs rounded hover:bg-navy-700 transition-colors"
                  >
                    <FileEdit className="w-3 h-3" /> AI 코드 생성
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline Toggle */}
      <div>
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="flex items-center gap-2 text-sm text-navy-500 hover:text-gray-300 transition-colors"
        >
          <History className="w-4 h-4" />
          과거 ECO 변경 이력
          {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showTimeline && (
          <div className="mt-3">
            <ECOTimeline />
          </div>
        )}
      </div>

      {showCreateModal && (
        <ECOCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(eco) => {
            dispatch({ type: 'CREATE_ECO', payload: eco });
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof FileEdit; label: string; value: number; color: string }) {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-navy-500">{label}</span>
      </div>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
