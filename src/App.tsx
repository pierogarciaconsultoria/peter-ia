
import React from "react"; 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import NonCompliance from "./pages/NonCompliance";
import NonConformingProducts from "./pages/NonConformingProducts";
import NotFound from "./pages/NotFound";

// Importando as novas páginas que serão criadas
import PerformanceIndicators from "./pages/PerformanceIndicators";
import CustomerComplaints from "./pages/CustomerComplaints";
import SupplierEvaluation from "./pages/SupplierEvaluation";
import EquipmentCalibration from "./pages/EquipmentCalibration";
import TrainingControl from "./pages/TrainingControl";
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

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/non-compliance" element={<NonCompliance />} />
              <Route path="/non-conforming-products" element={<NonConformingProducts />} />
              
              {/* Novas rotas */}
              <Route path="/performance-indicators" element={<PerformanceIndicators />} />
              <Route path="/customer-complaints" element={<CustomerComplaints />} />
              <Route path="/supplier-evaluation" element={<SupplierEvaluation />} />
              <Route path="/equipment-calibration" element={<EquipmentCalibration />} />
              <Route path="/training-control" element={<TrainingControl />} />
              <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
              <Route path="/raw-material-inspection" element={<RawMaterialInspection />} />
              <Route path="/action-schedule" element={<ActionSchedule />} />
              <Route path="/audit-schedule" element={<AuditSchedule />} />
              <Route path="/risk-management" element={<RiskManagement />} />
              <Route path="/organization-context" element={<OrganizationContext />} />
              <Route path="/critical-analysis" element={<CriticalAnalysis />} />
              <Route path="/human-resources" element={<HumanResources />} />
              <Route path="/strategic-planning" element={<StrategicPlanning />} />
              
              {/* Redirect old ambiente path to human resources */}
              <Route path="/ambiente" element={<Navigate to="/human-resources" state={{activeTab: "ambiente"}} />} />
              
              {/* Nova rota para o formulário externo de upload de documentos */}
              <Route path="/document-upload/:token" element={<DocumentUpload />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
