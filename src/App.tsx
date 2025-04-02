
import React from "react"; 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";

// Pages
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import NonCompliance from "./pages/NonCompliance";
import NonConformingProducts from "./pages/NonConformingProducts";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ProcessoPage from "./pages/ProcessoPage";
import ProcessFormPage from "./pages/ProcessFormPage";

// Importando as demais páginas
import PerformanceIndicators from "./pages/PerformanceIndicators";
import CustomerComplaints from "./pages/CustomerComplaints";
import SupplierEvaluation from "./pages/SupplierEvaluation";
import EquipmentCalibration from "./pages/EquipmentCalibration";
import RawMaterialInspection from "./pages/RawMaterialInspection";
import ActionSchedule from "./pages/ActionSchedule";
import AuditSchedule from "./pages/AuditSchedule";
import RiskManagement from "./pages/RiskManagement";
import OrganizationContext from "./pages/OrganizationContext";
import CriticalAnalysis from "./pages/CriticalAnalysis";
import SatisfactionSurvey from "./pages/SatisfactionSurvey";
import HumanResources from "./pages/HumanResources";
import StrategicPlanning from "./pages/StrategicPlanning";
import DocumentUpload from "./pages/DocumentUpload";
import TrainingControl from "./pages/TrainingControl";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing page como rota inicial */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Dashboard interno como /dashboard */}
                <Route path="/dashboard" element={<Index />} />
                
                {/* Página de autenticação pública */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Rota para upload externo de documentos */}
                <Route path="/document-upload/:token" element={<DocumentUpload />} />
                
                {/* Página de administração (não requer mais ser admin) */}
                <Route path="/admin" element={<Admin />} />
                
                {/* Rotas de Processo */}
                <Route path="/processo" element={<ProcessoPage />} />
                <Route path="/processo/novo" element={<ProcessFormPage />} />
                
                {/* Rotas que não requerem mais autenticação */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/non-compliance" element={<NonCompliance />} />
                <Route path="/non-conforming-products" element={<NonConformingProducts />} />
                
                {/* Demais rotas sem proteção */}
                <Route path="/performance-indicators" element={<PerformanceIndicators />} />
                <Route path="/customer-complaints" element={<CustomerComplaints />} />
                <Route path="/supplier-evaluation" element={<SupplierEvaluation />} />
                <Route path="/equipment-calibration" element={<EquipmentCalibration />} />
                <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
                <Route path="/raw-material-inspection" element={<RawMaterialInspection />} />
                <Route path="/action-schedule" element={<ActionSchedule />} />
                <Route path="/audit-schedule" element={<AuditSchedule />} />
                <Route path="/risk-management" element={<RiskManagement />} />
                <Route path="/organization-context" element={<OrganizationContext />} />
                <Route path="/critical-analysis" element={<CriticalAnalysis />} />
                <Route path="/human-resources" element={<HumanResources />} />
                <Route path="/strategic-planning" element={<StrategicPlanning />} />
                <Route path="/training-control" element={<TrainingControl />} />
                
                {/* Redirect ambiente path */}
                <Route path="/ambiente" element={<Navigate to="/human-resources" state={{activeTab: "ambiente"}} />} />
                
                {/* Página 404 para rotas não encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
