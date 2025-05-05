
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AuthGuard } from "@/components/AuthGuard";
import { PermissionGuard } from "@/components/PermissionGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Navigation } from "@/components/Navigation";

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
import { Toaster as SonnerToaster } from 'sonner';

import './App.css';

function App() {
  const { toast } = useToast();

  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/external-disc-assessment/:token" element={<ExternalDiscAssessment />} />

            {/* Protected routes with Navigation component */}
            <Route element={<AuthGuard />}>
              <Route element={<Navigation />}>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/document-upload" element={<DocumentUpload />} />
                <Route path="/human-resources/*" element={<HumanResources />} />
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
                
                {/* Admin route protected with permission guard */}
                <Route path="/admin/*" element={
                  <PermissionGuard requiredRole="admin">
                    <Admin />
                  </PermissionGuard>
                } />
              </Route>
            </Route>
          </Routes>
          
          <Toaster />
          <SonnerToaster position="top-right" />
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
