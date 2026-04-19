import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-navy-900 border border-status-critical/30 rounded-lg p-6 max-w-md text-center">
            <AlertTriangle className="w-10 h-10 text-status-critical mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">
              {this.props.fallbackTitle || '오류가 발생했습니다'}
            </h3>
            <p className="text-xs text-navy-500 mb-4">
              {this.state.error?.message || 'AI 응답을 처리하는 중 문제가 발생했습니다.'}
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-navy-800 text-accent-green text-sm rounded hover:bg-navy-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
