import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    // Also log to console for dev
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h1 style={{ color: '#b00020' }}>Ứng dụng gặp lỗi khi khởi chạy</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff6f6', padding: 20, borderRadius: 8 }}>
            {String(this.state.error)}
            {this.state.info ? '\n' + this.state.info.componentStack : ''}
          </pre>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
