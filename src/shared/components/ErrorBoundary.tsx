import React from "react";

type Props = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("UI crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6 text-center text-slate-500">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
