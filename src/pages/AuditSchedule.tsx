
import { Navigation } from "@/components/Navigation";
import { AuditHeader } from "@/components/audit/AuditHeader";
import { NextAuditCard } from "@/components/audit/NextAuditCard";
import { AuditStatusCards } from "@/components/audit/AuditStatusCards";
import { AuditTabs } from "@/components/audit/AuditTabs";
import { useAuditSchedule } from "@/hooks/useAuditSchedule";

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-64'}`}>
        <div className="max-w-6xl mx-auto">
          <AuditHeader />
          
          {/* Next Audit Countdown Card */}
          <NextAuditCard 
            nextAudit={nextAudit} 
            daysRemaining={daysRemaining} 
          />
          
          <AuditStatusCards
            plannedAudits={plannedAudits}
            inProgressAudits={inProgressAudits}
            completedAudits={completedAudits}
          />
          
          <AuditTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            plannedAudits={plannedAudits}
            inProgressAudits={inProgressAudits}
            completedAudits={completedAudits}
            audits={audits}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default AuditSchedule;
