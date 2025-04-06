import React from "react"; 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";

// Pages
import PublicLandingPage from "./pages/PublicLandingPage";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import NonCompliance from "./pages/NonCompliance";
import NonConformingProducts from "./pages/NonConformingProducts";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ProcessoPage from "./pages/ProcessoPage";
import ProcessFormPage from "./pages/ProcessFormPage";
import QualityControl from "./pages/QualityControl";

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
                {/* Rotas públicas - não requerem autenticação */}
                <Route path="/landing" element={<PublicLandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/document-upload/:token" element={<DocumentUpload />} />
                
                {/* Dashboard interno como rota inicial - requer autenticação */}
                <Route path="/" element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } />
                
                {/* Rota de administração - requer ser admin, mas permite bypass para master admin */}
                <Route path="/admin" element={
                  <AuthGuard requireSuperAdmin>
                    <Admin />
                  </AuthGuard>
                } />
                
                {/* Rotas protegidas - requerem autenticação */}
                <Route path="/processo" element={
                  <AuthGuard>
                    <ProcessoPage />
                  </AuthGuard>
                } />
                <Route path="/processo/novo" element={
                  <AuthGuard>
                    <ProcessFormPage />
                  </AuthGuard>
                } />
                <Route path="/quality-control" element={
                  <AuthGuard>
                    <QualityControl />
                  </AuthGuard>
                } />
                <Route path="/documents" element={
                  <AuthGuard>
                    <Documents />
                  </AuthGuard>
                } />
                <Route path="/non-compliance" element={
                  <AuthGuard>
                    <NonCompliance />
                  </AuthGuard>
                } />
                <Route path="/non-conforming-products" element={
                  <AuthGuard>
                    <NonConformingProducts />
                  </AuthGuard>
                } />
                <Route path="/performance-indicators" element={
                  <AuthGuard>
                    <PerformanceIndicators />
                  </AuthGuard>
                } />
                <Route path="/customer-complaints" element={
                  <AuthGuard>
                    <CustomerComplaints />
                  </AuthGuard>
                } />
                <Route path="/supplier-evaluation" element={
                  <AuthGuard>
                    <SupplierEvaluation />
                  </AuthGuard>
                } />
                <Route path="/equipment-calibration" element={
                  <AuthGuard>
                    <EquipmentCalibration />
                  </AuthGuard>
                } />
                <Route path="/satisfaction-survey" element={
                  <AuthGuard>
                    <SatisfactionSurvey />
                  </AuthGuard>
                } />
                <Route path="/raw-material-inspection" element={
                  <AuthGuard>
                    <RawMaterialInspection />
                  </AuthGuard>
                } />
                <Route path="/action-schedule" element={
                  <AuthGuard>
                    <ActionSchedule />
                  </AuthGuard>
                } />
                <Route path="/audit-schedule" element={
                  <AuthGuard>
                    <AuditSchedule />
                  </AuthGuard>
                } />
                <Route path="/risk-management" element={
                  <AuthGuard>
                    <RiskManagement />
                  </AuthGuard>
                } />
                <Route path="/organization-context" element={
                  <AuthGuard>
                    <OrganizationContext />
                  </AuthGuard>
                } />
                <Route path="/critical-analysis" element={
                  <AuthGuard>
                    <CriticalAnalysis />
                  </AuthGuard>
                } />
                <Route path="/human-resources" element={
                  <AuthGuard>
                    <HumanResources />
                  </AuthGuard>
                } />
                <Route path="/strategic-planning" element={
                  <AuthGuard>
                    <StrategicPlanning />
                  </AuthGuard>
                } />
                <Route path="/training-control" element={
                  <AuthGuard>
                    <TrainingControl />
                  </AuthGuard>
                } />
                
                {/* Redirect ambiente path */}
                <Route path="/ambiente" element={
                  <AuthGuard>
                    <Navigate to="/human-resources" state={{activeTab: "ambiente"}} />
                  </AuthGuard>
                } />
                
                {/* Mantenha a rota /dashboard para compatibilidade */}
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                
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
