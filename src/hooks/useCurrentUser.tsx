
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

export const useCurrentUser = () => {
  const { user, userProfile, userCompany, isSuperAdmin, isCompanyAdmin, loading } = useAuth();

  const isMaster = useMemo(() => {
    return isSuperAdminInLovable() || isSuperAdmin;
  }, [isSuperAdmin]);

  const isAdmin = useMemo(() => {
    return isSuperAdminInLovable() || isSuperAdmin || isCompanyAdmin;
  }, [isSuperAdmin, isCompanyAdmin]);

  // Cache dos dados para evitar múltiplas consultas
  const cachedData = useMemo(() => ({
    user,
    userProfile,
    userCompany,
    isMaster,
    isAdmin,
    isLoading: loading,
    empresaId: userProfile?.company_id,
  }), [user, userProfile, userCompany, isMaster, isAdmin, loading]);

  return cachedData;
};
