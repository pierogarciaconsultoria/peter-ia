
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import PublicLandingPage from "@/pages/PublicLandingPage";
import Pricing from "@/pages/Pricing";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import BillingSettings from "@/pages/settings/BillingSettings";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import Dashboard from "@/pages/Dashboard";
import HumanResources from "@/pages/HumanResources";
import TrainingControl from "@/pages/TrainingControl";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./App.css";

// Import all the pages that correspond to the menu items
import ProcessPage from "@/pages/ProcessPage";
import StrategicPlanning from "@/pages/StrategicPlanning";
import OrganizationContext from "@/pages/OrganizationContext";
import CriticalAnalysis from "@/pages/CriticalAnalysis";
import Reunioes from "@/pages/Reunioes";
import ActionSchedule from "@/pages/ActionSchedule";
import NonCompliance from "@/pages/NonCompliance";
import NonConformingProducts from "@/pages/NonConformingProducts";
import QualityControl from "@/pages/QualityControl";
import ExternalAudit from "@/pages/ExternalAudit";
import PerformanceIndicators from "@/pages/PerformanceIndicators";
import CustomerComplaints from "@/pages/CustomerComplaints";
import SupplierEvaluation from "@/pages/SupplierEvaluation";
import EquipmentCalibration from "@/pages/EquipmentCalibration";
import RawMaterialInspection from "@/pages/RawMaterialInspection";
import AuditSchedule from "@/pages/AuditSchedule";
import RiskManagement from "@/pages/RiskManagement";
import SatisfactionSurvey from "@/pages/SatisfactionSurvey";
import Documents from "@/pages/Documents";
import AdminPage from "@/pages/AdminPage";
import HelpPage from "@/pages/HelpPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<PublicLandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } 
          />
          
          {/* HR Routes */}
          <Route 
            path="/human-resources" 
            element={
              <AuthGuard>
                <HumanResources />
              </AuthGuard>
            } 
          />
          
          {/* All other module routes */}
          <Route path="/processo" element={<AuthGuard><ProcessPage /></AuthGuard>} />
          <Route path="/strategic-planning" element={<AuthGuard><StrategicPlanning /></AuthGuard>} />
          <Route path="/organization-context" element={<AuthGuard><OrganizationContext /></AuthGuard>} />
          <Route path="/critical-analysis" element={<AuthGuard><CriticalAnalysis /></AuthGuard>} />
          <Route path="/reunioes" element={<AuthGuard><Reunioes /></AuthGuard>} />
          <Route path="/action-schedule" element={<AuthGuard><ActionSchedule /></AuthGuard>} />
          <Route path="/non-compliance" element={<AuthGuard><NonCompliance /></AuthGuard>} />
          <Route path="/non-conforming-products" element={<AuthGuard><NonConformingProducts /></AuthGuard>} />
          <Route path="/quality-control" element={<AuthGuard><QualityControl /></AuthGuard>} />
          <Route path="/external-audit" element={<AuthGuard><ExternalAudit /></AuthGuard>} />
          <Route path="/performance-indicators" element={<AuthGuard><PerformanceIndicators /></AuthGuard>} />
          <Route path="/customer-complaints" element={<AuthGuard><CustomerComplaints /></AuthGuard>} />
          <Route path="/supplier-evaluation" element={<AuthGuard><SupplierEvaluation /></AuthGuard>} />
          <Route path="/equipment-calibration" element={<AuthGuard><EquipmentCalibration /></AuthGuard>} />
          <Route path="/raw-material-inspection" element={<AuthGuard><RawMaterialInspection /></AuthGuard>} />
          <Route path="/audit-schedule" element={<AuthGuard><AuditSchedule /></AuthGuard>} />
          <Route path="/risk-management" element={<AuthGuard><RiskManagement /></AuthGuard>} />
          <Route path="/satisfaction-survey" element={<AuthGuard><SatisfactionSurvey /></AuthGuard>} />
          <Route path="/documents" element={<AuthGuard><Documents /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard><AdminPage /></AuthGuard>} />
          <Route path="/help" element={<AuthGuard><HelpPage /></AuthGuard>} />
          
          {/* Subscription management */}
          <Route 
            path="/subscription/success" 
            element={
              <AuthGuard>
                <SubscriptionSuccess />
              </AuthGuard>
            } 
          />
          <Route 
            path="/settings/billing" 
            element={
              <AuthGuard>
                <BillingSettings />
              </AuthGuard>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/companies" 
            element={
              <AuthGuard requireSuperAdmin>
                <CompanyManagement />
              </AuthGuard>
            } 
          />
          
          {/* Fallback to the Home page */}
          <Route path="*" element={<PublicLandingPage />} />
        </Routes>
        
        <Toaster />
        <SonnerToaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
