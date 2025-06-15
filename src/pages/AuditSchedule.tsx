import { AuditHeader } from "@/components/audit/AuditHeader";
import { NextAuditCard } from "@/components/audit/NextAuditCard";
import { AuditStatusCards } from "@/components/audit/AuditStatusCards";
import { AuditTabs } from "@/components/audit/AuditTabs";
import { useAuditSchedule } from "@/hooks/useAuditSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";
const AuditSchedule = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    audits,
    isLoading,
    nextAudit,
    daysRemaining,
    plannedAudits,
    inProgressAudits,
    completedAudits
  } = useAuditSchedule();
  return <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
          <AuditHeader />
          
          <Card className="border-blue-100">
            
            
          </Card>
          
          {/* Next Audit Countdown Card */}
          <NextAuditCard nextAudit={nextAudit} daysRemaining={daysRemaining} />
          
          <AuditStatusCards plannedAudits={plannedAudits} inProgressAudits={inProgressAudits} completedAudits={completedAudits} />
          
          <AuditTabs activeTab={activeTab} setActiveTab={setActiveTab} plannedAudits={plannedAudits} inProgressAudits={inProgressAudits} completedAudits={completedAudits} audits={audits} isLoading={isLoading} />
        </div>
      </div>
    </AuthenticationRequired>;
};
export default AuditSchedule;