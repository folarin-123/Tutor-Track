import React from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[var(--bg-page)] px-6 text-center text-[var(--text-primary)]">
          <div className="max-w-md">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-primary-600">Something went wrong</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">This page needs a quick reset.</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {this.state.error?.message || "The app hit an unexpected problem. Try refreshing or return home."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
              >
                Reload Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="rounded-full border border-[var(--border-default)] px-5 py-3 text-sm font-bold transition hover:bg-[var(--bg-surface-muted)]"
              >
                Back home
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
