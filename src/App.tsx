
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import PublicLandingPage from "@/pages/PublicLandingPage";
import Pricing from "@/pages/Pricing";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import BillingSettings from "@/pages/settings/BillingSettings";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./App.css";

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
