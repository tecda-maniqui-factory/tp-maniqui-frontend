import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

/**
 * Propiedades del componente {@link ErrorBoundary}.
 */
export interface ErrorBoundaryProps {
  /** Los elementos hijos que serán monitoreados por el límite de error. */
  children: ReactNode;
}

/**
 * Estado interno del componente {@link ErrorBoundary}.
 */
export interface ErrorBoundaryState {
  /** Indica si se ha capturado un error en alguno de los componentes hijos. */
  hasError: boolean;
  /** El objeto de error capturado. */
  error: Error | null;
  /** Información adicional sobre la pila de componentes en la que ocurrió el error. */
  errorInfo: ErrorInfo | null;
}

/**
 * Componente Template: ErrorBoundary
 * 
 * Límite de error (Error Boundary) basado en clases de React.
 * Captura de forma robusta cualquier error en el ciclo de vida o durante el renderizado
 * de los componentes descendientes. En lugar de colapsar toda la aplicación y mostrar una pantalla
 * en blanco, renderiza una interfaz amigable de recuperación y depuración mostrando detalles del
 * error y permitiendo recargar la aplicación de forma segura.
 * 
 * @example
 * ```tsx
 * // Envoltura del enrutador o componentes clave
 * <ErrorBoundary>
 *   <DashboardPage />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
