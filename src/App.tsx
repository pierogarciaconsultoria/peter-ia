
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SecurityProvider } from "@/security/SecurityContext";
import { Navigation } from "@/components/Navigation";
import { AuthGuard } from "@/components/AuthGuard";
import NotFound from "@/pages/NotFound";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster as SonnerToaster } from 'sonner';
import { useEffect } from "react";
import { toast } from "sonner";
import { testConnection } from './integrations/supabase/client';
import { isProductionEnvironment } from './utils/lovableEditorDetection';

// Import pages 
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import HumanResources from '@/pages/HumanResources';
import ProcessFormPage from '@/pages/ProcessFormPage';
import ProcessoPage from '@/pages/ProcessoPage';
import NonCompliance from '@/pages/NonCompliance';
import ActionSchedule from '@/pages/ActionSchedule';
import AuditSchedule from '@/pages/AuditSchedule';
import ExternalAudit from '@/pages/ExternalAudit';
import StrategicPlanning from '@/pages/StrategicPlanning';
import CriticalAnalysis from '@/pages/CriticalAnalysis';
import OrganizationContext from '@/pages/OrganizationContext';
import RiskManagement from '@/pages/RiskManagement';
import CustomerComplaints from '@/pages/CustomerComplaints';
import PerformanceIndicators from '@/pages/PerformanceIndicators';
import QualityControl from '@/pages/QualityControl';
import SupplierEvaluation from '@/pages/SupplierEvaluation';
import Reunioes from '@/pages/Reunioes';
import TrainingControl from '@/pages/TrainingControl';
import NonConformingProducts from '@/pages/NonConformingProducts';
import EquipmentCalibration from '@/pages/EquipmentCalibration';
import RawMaterialInspection from '@/pages/RawMaterialInspection';
import SatisfactionSurvey from '@/pages/SatisfactionSurvey';
import Admin from '@/pages/Admin';
import Ambiente from '@/pages/Ambiente';
import Tasks from '@/pages/Tasks';
import ExitInterviewPage from "./pages/ExitInterviewPage";
import IntelligentAnalysisPage from "@/pages/IntelligentAnalysisPage";

import './App.css';

function AppContent() {
  console.log('🚀 AppContent: Componente inicializado - Peter.IA');
  
  // Test Supabase connection once on startup with better error handling
  useEffect(() => {
    console.log('🔧 AppContent: useEffect para conexão Supabase iniciado');
    let connectionChecked = false;
    
    const checkSupabaseConnection = async () => {
      if (connectionChecked) {
        console.log('🔍 AppContent: Conexão já verificada, pulando');
        return;
      }
      
      console.log('🔌 AppContent: Testando conexão com Supabase...');
      try {
        const result = await testConnection();
        
        if (!result.success) {
          console.warn('⚠️ AppContent: Problema de conexão com banco de dados:', result.error);
          if (isProductionEnvironment()) {
            toast.warning("Modo offline", {
              description: "Algumas funcionalidades podem estar limitadas",
            });
          }
        } else {
          console.log('✅ AppContent: Conexão com banco de dados bem-sucedida');
          connectionChecked = true;
        }
      } catch (err) {
        console.warn('⚠️ AppContent: Erro ao testar conexão:', err);
        // Não mostrar erro em desenvolvimento para não atrapalhar o workflow
        if (isProductionEnvironment()) {
          toast.warning("Conectividade limitada", {
            description: "Verifique sua conexão com a internet",
          });
        }
      }
    };
    
    // Delay inicial para evitar race conditions
    setTimeout(checkSupabaseConnection, 1000);
    
    // Setup reconnection check on window focus (com debounce)
    let focusTimeout: NodeJS.Timeout;
    const handleFocus = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        if (!connectionChecked) {
          console.log('🔄 AppContent: Reconectando após falha anterior');
          checkSupabaseConnection();
        }
      }, 2000);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearTimeout(focusTimeout);
    };
  }, []);

  console.log('🎨 AppContent: Renderizando rotas Peter.IA');

  return (
    <SidebarProvider>
      <SecurityProvider>
        <Router>
          <Routes>
            {/* Página inicial sem requisitos de login */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/landing" element={<Navigate to="/" replace />} />
            
            {/* Rota de autenticação */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Rota pública para entrevista de desligamento */}
            <Route path="/exit-interview/:token" element={<ExitInterviewPage />} />
            
            {/* Layout compartilhado com Navigation para rotas protegidas */}
            <Route element={
              <AuthGuard>
                <Navigation />
              </AuthGuard>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Redirecionamento da ISO 9001 para Dashboard */}
              <Route path="/iso-9001" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
              <Route path="/documents" element={<Navigate to="/dashboard" replace />} />
              <Route path="/document-upload" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/human-resources" element={<HumanResources />} />
              
              <Route path="/process-form" element={<ProcessFormPage />} />
              <Route path="/processo" element={<ProcessoPage />} />
              <Route path="/processo/:id" element={<ProcessFormPage />} />
              <Route path="/non-compliance" element={<NonCompliance />} />
              <Route path="/action-schedule" element={<ActionSchedule />} />
              <Route path="/audit-schedule" element={<AuditSchedule />} />
              <Route path="/external-audit" element={<ExternalAudit />} />
              <Route path="/strategic-planning" element={<StrategicPlanning />} />
              <Route path="/strategic-planning/:tab" element={<StrategicPlanning />} />
              <Route path="/critical-analysis" element={<CriticalAnalysis />} />
              <Route path="/organization-context" element={<OrganizationContext />} />
              <Route path="/risk-management" element={<RiskManagement />} />
              <Route path="/customer-complaints" element={<CustomerComplaints />} />
              <Route path="/performance-indicators" element={<PerformanceIndicators />} />
              <Route path="/quality-control" element={<QualityControl />} />
              <Route path="/supplier-evaluation" element={<SupplierEvaluation />} />
              <Route path="/reunioes" element={<Reunioes />} />
              <Route path="/training-control" element={<TrainingControl />} />
              <Route path="/non-conforming-products" element={<NonConformingProducts />} />
              <Route path="/equipment-calibration" element={<EquipmentCalibration />} />
              <Route path="/raw-material-inspection" element={<RawMaterialInspection />} />
              <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
              <Route path="/ambiente" element={<Ambiente />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/analise-inteligente" element={<IntelligentAnalysisPage />} />
            </Route>
            
            {/* Catch-all route for pages not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <SonnerToaster position="top-right" />
        </Router>
      </SecurityProvider>
    </SidebarProvider>
  );
}

function App() {
  console.log('📁 App: Aplicação Peter.IA carregada');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
