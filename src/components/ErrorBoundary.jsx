import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[React ErrorBoundary caught error]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center rounded-2xl bg-white/40 dark:bg-black/30 border border-slate-200 dark:border-secondary/20 my-4">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Something went wrong while rendering this section.
          </p>
          {this.state.error && (
            <pre className="mt-2 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono text-left overflow-auto max-h-40 rounded-xl">
              {this.state.error.toString()}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-1.5 rounded-full bg-secondary text-white text-xs font-bold shadow"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
