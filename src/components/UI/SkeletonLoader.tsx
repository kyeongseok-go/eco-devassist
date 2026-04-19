interface SkeletonProps {
  lines?: number;
  showHeader?: boolean;
  type?: 'card' | 'analysis' | 'code' | 'text';
}

function SkeletonLine({ width = '100%', height = '12px' }: { width?: string; height?: string }) {
  return (
    <div
      className="bg-navy-700/50 rounded animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonLoader({ lines = 4, showHeader = true, type = 'card' }: SkeletonProps) {
  if (type === 'analysis') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-accent-green/20 rounded animate-pulse" />
          <SkeletonLine width="120px" height="16px" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-navy-900 border border-navy-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <SkeletonLine width="200px" height="16px" />
              <SkeletonLine width="80px" height="20px" />
            </div>
            <SkeletonLine width="90%" />
            <SkeletonLine width="70%" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'code') {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-navy-700 flex justify-between">
          <SkeletonLine width="120px" height="14px" />
          <SkeletonLine width="180px" height="14px" />
        </div>
        <div className="p-4 space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonLine
              key={i}
              width={`${40 + Math.random() * 55}%`}
              height="14px"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 space-y-3">
      {showHeader && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-navy-700/50 rounded animate-pulse" />
          <SkeletonLine width="160px" height="16px" />
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={`${60 + Math.random() * 35}%`} />
      ))}
    </div>
  );
}

export function TypingIndicator({ text = 'AI가 분석 중입니다' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 bg-navy-900 border border-accent-green/20 rounded-lg p-4">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-accent-green">{text}</span>
    </div>
  );
}
