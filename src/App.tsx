
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AuthGuard } from "@/components/AuthGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/NotFound";
import { useAdminCreation } from "@/hooks/useAdminCreation";
import { SecurityProvider } from "@/security/SecurityContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from './integrations/supabase/client';
import { isProductionEnvironment } from './utils/lovableEditorDetection';

// Import pages 
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import DocumentUpload from '@/pages/DocumentUpload';
import Documents from '@/pages/Documents';
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
import ExternalDiscAssessment from '@/pages/ExternalDiscAssessment';
import Tasks from '@/pages/Tasks';
import LandingPage from '@/pages/LandingPage';
import { Toaster as SonnerToaster } from 'sonner';

import './App.css';

function App() {
  // We're not using shadcn/ui toast here since we're using sonner toast in checkSupabaseConnection
  // Remove the useToast hook import for shadcn as it's not being used here
  
  // Test Supabase connection once on startup
  useEffect(() => {
    let connectionChecked = false;
    
    const checkSupabaseConnection = async () => {
      if (connectionChecked) return;
      
      try {
        const { data, error } = await supabase.from('connection_test').select('*').limit(1);
        
        if (error) {
          console.error('Database connection error:', error);
          if (isProductionEnvironment()) {
            toast.error("Erro de conexão com o banco de dados", {
              description: "Verifique sua conexão com a internet",
            });
          }
        } else {
          console.log('Database connection successful');
          connectionChecked = true;
        }
      } catch (err) {
        console.error('Failed to test database connection:', err);
      }
    };
    
    checkSupabaseConnection();
    
    // Setup reconnection check on window focus
    const handleFocus = () => {
      // Only recheck connection if previously failed
      if (!connectionChecked) {
        checkSupabaseConnection();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  
  // Initialize admin account
  useAdminCreation();

  return (
    <AuthProvider>
      <SecurityProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* Página inicial sem requisitos de login */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/landing" element={<Navigate to="/" replace />} />
              
              {/* Rotas de autenticação */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/external-disc-assessment/:token" element={<Navigate to="/auth" replace />} />
              
              {/* Rotas protegidas por autenticação com AuthGuard */}
              <Route element={<AuthGuard><Navigation /></AuthGuard>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Navigate to="/dashboard" replace />} />
                <Route path="documents" element={<Navigate to="/dashboard" replace />} />
                <Route path="document-upload" element={<Navigate to="/dashboard" replace />} />
                
                {/* Corrigir a rota de recursos humanos para aceitar query params */}
                <Route path="human-resources" element={<HumanResources />} />
                
                <Route path="process-form" element={<ProcessFormPage />} />
                <Route path="processo" element={<ProcessoPage />} />
                <Route path="processo/:id" element={<ProcessFormPage />} />
                <Route path="non-compliance" element={<NonCompliance />} />
                <Route path="action-schedule" element={<ActionSchedule />} />
                <Route path="audit-schedule" element={<AuditSchedule />} />
                <Route path="external-audit" element={<ExternalAudit />} />
                <Route path="strategic-planning" element={<StrategicPlanning />} />
                <Route path="strategic-planning/:tab" element={<StrategicPlanning />} />
                <Route path="critical-analysis" element={<CriticalAnalysis />} />
                <Route path="organization-context" element={<OrganizationContext />} />
                <Route path="risk-management" element={<RiskManagement />} />
                <Route path="customer-complaints" element={<CustomerComplaints />} />
                <Route path="performance-indicators" element={<PerformanceIndicators />} />
                <Route path="quality-control" element={<QualityControl />} />
                <Route path="supplier-evaluation" element={<SupplierEvaluation />} />
                <Route path="reunioes" element={<Reunioes />} />
                <Route path="training-control" element={<TrainingControl />} />
                <Route path="non-conforming-products" element={<NonConformingProducts />} />
                <Route path="equipment-calibration" element={<EquipmentCalibration />} />
                <Route path="raw-material-inspection" element={<RawMaterialInspection />} />
                <Route path="satisfaction-survey" element={<SatisfactionSurvey />} />
                <Route path="ambiente" element={<Ambiente />} />
                <Route path="tasks" element={<Tasks />} />
                
                {/* Admin route - agora carrega corretamente o componente Admin */}
                <Route path="admin" element={<Admin />} />
              </Route>

              {/* Catch-all route for pages not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
            <SonnerToaster position="top-right" />
          </Router>
        </SidebarProvider>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;
