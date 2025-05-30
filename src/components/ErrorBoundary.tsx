
import React, { Component, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: Math.random().toString(36).substr(2, 9)
    };
    
    console.log('🛡️ ErrorBoundary: Inicializado com ID:', this.state.errorId);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('🚨 ErrorBoundary: Erro capturado:', error);
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary: Error details:', {
      errorId: this.state.errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      error,
      errorInfo
    });

    // Reportar erro para serviços de monitoramento se estiver em produção
    if (process.env.NODE_ENV === 'production') {
      // Aqui você pode integrar com Sentry, LogRocket, etc.
      console.log('📊 ErrorBoundary: Reportando erro para monitoramento');
    }
  }

  handleRetry = () => {
    console.log('🔄 ErrorBoundary: Tentando recuperação...');
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: Math.random().toString(36).substr(2, 9)
    });
  };

  handleReload = () => {
    console.log('🔄 ErrorBoundary: Recarregando página...');
    window.location.reload();
  };

  handleGoHome = () => {
    console.log('🏠 ErrorBoundary: Redirecionando para home...');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      console.log('🚨 ErrorBoundary: Renderizando fallback UI');
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAuthError = this.state.error?.message?.includes('auth') || 
                         this.state.error?.message?.includes('permission') ||
                         this.state.error?.message?.includes('JWT') ||
                         this.state.error?.stack?.includes('AuthContext');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-700">
                {isAuthError ? 'Erro de Autenticação' : 'Oops! Algo deu errado'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                {isAuthError 
                  ? 'Ocorreu um problema com a autenticação. Tente fazer login novamente.'
                  : 'Ocorreu um erro inesperado na aplicação. Tente recarregar a página.'
                }
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Debug Info (ID: {this.state.errorId})
                    </span>
                  </div>
                  <p className="text-sm font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-red-600">
                        Ver stack trace
                      </summary>
                      <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                {isAuthError ? (
                  <>
                    <Button 
                      onClick={this.handleGoHome} 
                      className="w-full"
                      variant="destructive"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Fazer Login Novamente
                    </Button>
                    <Button 
                      onClick={this.handleRetry} 
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={this.handleRetry} 
                      className="w-full"
                      variant="destructive"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={this.handleReload} 
                        variant="outline"
                        className="flex-1"
                      >
                        Recarregar
                      </Button>
                      <Button 
                        onClick={this.handleGoHome} 
                        variant="outline"
                        className="flex-1"
                      >
                        Ir para Home
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              {process.env.NODE_ENV === 'production' && (
                <p className="text-xs text-gray-500 text-center">
                  ID do erro: {this.state.errorId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
