import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Componente Template: ErrorBoundary
 * Atrapa los errores de renderizado de React en cualquier componente hijo
 * y muestra una pantalla amigable (y de debug) en lugar de una pantalla en blanco.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el próximo renderizado muestre la interfaz alternativa.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capturamos el stack trace
    this.setState({
      error,
      errorInfo
    });
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <h1 className="error-boundary__title">¡La aplicación se rompió!</h1>
            <p className="error-boundary__subtitle">Se ha capturado un error en la capa de vista de React.</p>
            <div className="error-boundary__details">
              <strong>{this.state.error && this.state.error.toString()}</strong>
              <pre className="error-boundary__stacktrace">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
            <button
              className="error-boundary__button"
              onClick={() => window.location.reload()}
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
