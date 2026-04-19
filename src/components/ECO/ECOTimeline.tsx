import { GitCommitHorizontal, AlertTriangle, Lightbulb } from 'lucide-react';
import { ecoHistory } from '../../data/mockHistory';

export function ECOTimeline() {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3 px-1">
        변경 이력 타임라인
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-navy-700" />

        {ecoHistory.map((h) => (
          <div key={h.id} className="relative flex gap-3 pb-4">
            {/* Dot */}
            <div className="relative z-10 mt-1.5">
              <GitCommitHorizontal className="w-[30px] h-[30px] text-accent-green bg-navy-950 rounded-full p-1" />
            </div>

            {/* Content */}
            <div className="flex-1 bg-navy-900 border border-navy-700 rounded-lg p-3 hover:border-navy-600 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-navy-600">{h.id}</span>
                <span className="text-[10px] text-navy-600">{h.date}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan">{h.targetPart}</span>
              </div>
              <h4 className="text-xs font-medium text-white mb-1.5">{h.title}</h4>
              <p className="text-[10px] text-navy-500 mb-2 line-clamp-2">{h.changeDescription}</p>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-status-high mt-0.5 shrink-0" />
                  <p className="text-[10px] text-navy-500 line-clamp-2">{h.issuesEncountered}</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="w-3 h-3 text-accent-green mt-0.5 shrink-0" />
                  <p className="text-[10px] text-navy-500 line-clamp-2">{h.lessonsLearned}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
