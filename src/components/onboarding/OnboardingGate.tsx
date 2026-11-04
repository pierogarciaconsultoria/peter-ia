import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getOnboardingStatus } from "@/services/onboarding/onboardingService";

/**
 * Leva o admin da empresa ao onboarding no primeiro acesso.
 * Usuários comuns e super admin sem empresa seguem direto.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { empresaId, isAdmin, isMaster, isLoading } = useCurrentUser();
  const [pending, setPending] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!empresaId || !isAdmin || isMaster) {
      setPending(false);
      return;
    }
    getOnboardingStatus(empresaId)
      .then(status => setPending(!status.completed))
      .catch(() => setPending(false));
  }, [empresaId, isAdmin, isMaster, isLoading]);

  if (pending === null) return null;
  if (pending) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
