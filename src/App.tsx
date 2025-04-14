import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { Navigation } from "@/components/Navigation";
import { EmployeeOnboarding } from "@/components/hr/EmployeeOnboarding";
import { isLovableEditor } from "@/utils/lovableEditorDetection";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import ExternalAudit from "./pages/ExternalAudit";
import { CookieConsent } from "./components/CookieConsent";
import { PersonnelMovement } from "@/components/hr/PersonnelMovement";

import HumanResources from "./pages/HumanResources";
import ActionSchedule from "./pages/ActionSchedule";
import NonCompliance from "./pages/NonCompliance";
import NonConformingProducts from "./pages/NonConformingProducts";
import QualityControl from "./pages/QualityControl";
import PerformanceIndicators from "./pages/PerformanceIndicators";
import RiskManagement from "./pages/RiskManagement";
import SatisfactionSurvey from "./pages/SatisfactionSurvey";
import Documents from "./pages/Documents";
import ProcessoPage from "./pages/ProcessoPage";
import ProcessFormPage from "./pages/ProcessFormPage";
import OrganizationContext from "./pages/OrganizationContext";
import StrategicPlanning from "./pages/StrategicPlanning";
import AuditSchedule from "./pages/AuditSchedule";
import CustomerComplaints from "./pages/CustomerComplaints";
import SupplierEvaluation from "./pages/SupplierEvaluation";
import EquipmentCalibration from "./pages/EquipmentCalibration";
import RawMaterialInspection from "./pages/RawMaterialInspection";
import TrainingControl from "./pages/TrainingControl";
import Reunioes from "./pages/Reunioes";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const isEditor = isLovableEditor();

  useEffect(() => {
    if (isEditor) {
      console.log("Acesso total concedido - usuário está no Lovable Editor");
    }
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isEditor]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard requireAdmin bypassForMasterAdmin={false}>
                <Admin />
              </AuthGuard>
            }
          />
          <Route
            path="/onboarding"
            element={
              <AuthGuard requireAdmin>
                <EmployeeOnboarding />
              </AuthGuard>
            }
          />

          <Route
            path="/external-audit"
            element={
              <AuthGuard>
                <ExternalAudit />
              </AuthGuard>
            }
          />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />

          <Route
            path="/processo"
            element={
              <AuthGuard>
                <ProcessoPage />
              </AuthGuard>
            }
          />
          <Route
            path="/processo/:id"
            element={
              <AuthGuard>
                <ProcessFormPage />
              </AuthGuard>
            }
          />
          <Route
            path="/strategic-planning"
            element={
              <AuthGuard>
                <StrategicPlanning />
              </AuthGuard>
            }
          />
          <Route
            path="/organization-context"
            element={
              <AuthGuard>
                <OrganizationContext />
              </AuthGuard>
            }
          />
          <Route
            path="/critical-analysis"
            element={
              <AuthGuard>
                <Dashboard /> {/* Temporary until this page exists */}
              </AuthGuard>
            }
          />
          <Route
            path="/human-resources"
            element={
              <AuthGuard>
                <HumanResources />
              </AuthGuard>
            }
          />
          <Route
            path="/reunioes"
            element={
              <AuthGuard>
                <Reunioes />
              </AuthGuard>
            }
          />
          <Route
            path="/action-schedule"
            element={
              <AuthGuard>
                <ActionSchedule />
              </AuthGuard>
            }
          />
          <Route
            path="/non-compliance"
            element={
              <AuthGuard>
                <NonCompliance />
              </AuthGuard>
            }
          />
          <Route
            path="/non-conforming-products"
            element={
              <AuthGuard>
                <NonConformingProducts />
              </AuthGuard>
            }
          />
          <Route
            path="/quality-control"
            element={
              <AuthGuard>
                <QualityControl />
              </AuthGuard>
            }
          />
          <Route
            path="/audit-schedule"
            element={
              <AuthGuard>
                <AuditSchedule />
              </AuthGuard>
            }
          />
          <Route
            path="/performance-indicators"
            element={
              <AuthGuard>
                <PerformanceIndicators />
              </AuthGuard>
            }
          />
          <Route
            path="/customer-complaints"
            element={
              <AuthGuard>
                <CustomerComplaints />
              </AuthGuard>
            }
          />
          <Route
            path="/supplier-evaluation"
            element={
              <AuthGuard>
                <SupplierEvaluation />
              </AuthGuard>
            }
          />
          <Route
            path="/equipment-calibration"
            element={
              <AuthGuard>
                <EquipmentCalibration />
              </AuthGuard>
            }
          />
          <Route
            path="/raw-material-inspection"
            element={
              <AuthGuard>
                <RawMaterialInspection />
              </AuthGuard>
            }
          />
          <Route
            path="/risk-management"
            element={
              <AuthGuard>
                <RiskManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/satisfaction-survey"
            element={
              <AuthGuard>
                <SatisfactionSurvey />
              </AuthGuard>
            }
          />
          <Route
            path="/documents"
            element={
              <AuthGuard>
                <Documents />
              </AuthGuard>
            }
          />
          <Route
            path="/help"
            element={
              <AuthGuard>
                <Dashboard /> {/* Temporary until this page exists */}
              </AuthGuard>
            }
          />
          <Route
            path="/training-control"
            element={
              <AuthGuard>
                <TrainingControl />
              </AuthGuard>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isDesktop && <Navigation />}
        <CookieConsent />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
