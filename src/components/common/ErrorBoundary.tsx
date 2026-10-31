import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Sparkles } from 'lucide-react';

export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallback?: ReactNode;
  onReset?: () => void;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary] Caught error in ${this.props.sectionName || 'Component'}:`, error, errorInfo);
  }

  resetError = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { fallbackTitle, fallbackSubtitle, sectionName } = this.props;

      return (
        <div className="w-full my-6 p-6 sm:p-10 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-lg text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-4 border border-[#E8DEC8] shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F4EEE6] text-[#645D56] mb-3">
            {sectionName ? `${sectionName} Fault Recovery` : 'Artisan Studio Notice'}
          </span>

          <h3 className="font-serif text-2xl font-bold text-[#28231F] mb-2">
            {fallbackTitle || 'Crafting Encountered an Interruption'}
          </h3>

          <p className="text-sm text-[#645D56] max-w-md mx-auto mb-6 leading-relaxed">
            {fallbackSubtitle ||
              'A rendering flaw occurred in this section. Your order and studio data remain securely preserved.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.resetError}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Rendering</span>
            </button>

            <button
              onClick={() => {
                this.resetError();
                window.location.reload();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4EEE6] hover:bg-[#EAE0D2] text-[#28231F] border border-[#DDD1BE] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#A86F47]" />
              <span>Reload Experience</span>
            </button>
          </div>

          {/* Diagnostic disclosure */}
          {this.state.error && (
            <details className="mt-6 text-left p-3.5 bg-[#F6EDE6]/60 rounded-xl border border-[#E8DEC8] text-xs text-[#645D56]">
              <summary className="cursor-pointer font-semibold text-[#A86F47] select-none">
                Technical Diagnostics (Click to expand)
              </summary>
              <div className="mt-2 font-mono text-[11px] overflow-x-auto text-red-900 bg-white/70 p-2.5 rounded-lg border border-red-200">
                <p className="font-bold">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-1 whitespace-pre-wrap text-[10px] text-gray-700">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized Fallback for WebGL 3D Craft Studio
 */
export const Studio3DErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      sectionName="3D Interactive Craft Studio"
      fallbackTitle="WebGL Craft Renderer Paused"
      fallbackSubtitle="The 3D interactive kiln experienced a graphics buffer refresh. You can reinitialize the wheel or inspect tactile specifications directly."
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Specialized Fallback for SuperAdmin Panel
 */
export const AdminErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      sectionName="SuperAdmin Governance Desk"
      fallbackTitle="Governance Console Recovery"
      fallbackSubtitle="The administrative panel encountered a data calculation error. All database records and financial ledgers remain safe."
    >
      {children}
    </ErrorBoundary>
  );
};