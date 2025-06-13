
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Audit, getAudits } from "@/services/auditService";
import { toast } from "sonner";
import { isAfter, differenceInDays } from "date-fns";

export const useAuditSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch audits using React Query
  const { data: audits = [], isLoading, refetch } = useQuery({
    queryKey: ['internal-audits'],
    queryFn: getAudits,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Error fetching audits:", error);
          toast.error("Falha ao carregar as auditorias internas");
        }
        setLoading(false);
      }
    }
  });
  
  // Find next scheduled audit
  const today = new Date();
  const upcomingAudits = Array.isArray(audits) ? audits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'planned';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime()) : [];

  const nextAudit = upcomingAudits.length > 0 ? upcomingAudits[0] : null;
  
  // Calculate days remaining for next audit
  const daysRemaining = nextAudit ? 
    differenceInDays(new Date(nextAudit.audit_date), today) : null;

  // Filter audits based on status - with safety checks
  const plannedAudits = Array.isArray(audits) ? audits.filter(audit => audit.status === 'planned') : [];
  const inProgressAudits = Array.isArray(audits) ? audits.filter(audit => audit.status === 'in_progress') : [];
  const completedAudits = Array.isArray(audits) ? audits.filter(audit => audit.status === 'completed') : [];

  // Detect if sidebar is collapsed
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    // Check sidebar state periodically
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  }, []);

  return {
    loading,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    audits: Array.isArray(audits) ? audits : [],
    isLoading,
    nextAudit,
    daysRemaining,
    plannedAudits,
    inProgressAudits,
    completedAudits
  };
};
