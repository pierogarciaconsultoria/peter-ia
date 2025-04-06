
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

// Adicione as novas importações para as páginas de privacidade e perfil
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import ExternalAudit from "./pages/ExternalAudit";
import { CookieConsent } from "./components/CookieConsent";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

          {/* Rota para a página de auditoria externa */}
          <Route
            path="/external-audit"
            element={
              <AuthGuard>
                <ExternalAudit />
              </AuthGuard>
            }
          />

          {/* Rota para a página de política de privacidade */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Rota para a página de perfil protegida por autenticação */}
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />
        </Routes>
        {isDesktop && <Navigation />}
        <CookieConsent />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
