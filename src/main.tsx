
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initializeSchemaContext } from '@/utils/schemaContext'

console.log('🎯 main.tsx: Arquivo carregado');

// Initialize schema context on startup
console.log('🔧 main.tsx: Inicializando contexto de schema');
try {
  initializeSchemaContext();
  console.log('✅ main.tsx: Contexto de schema inicializado com sucesso');
} catch (error) {
  console.error('❌ main.tsx: Erro ao inicializar contexto de schema:', error);
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

console.log('📊 main.tsx: QueryClient criado');

const rootElement = document.getElementById('root');
console.log('🎯 main.tsx: Root element encontrado:', !!rootElement);

if (!rootElement) {
  console.error('❌ main.tsx: Elemento root não encontrado!');
  throw new Error('Root element not found');
}

console.log('🚀 main.tsx: Iniciando renderização da aplicação');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

console.log('✅ main.tsx: Aplicação renderizada com sucesso');
