
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

  return (
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
          <AuditHeader />
          
          <Card className="border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <InfoIcon className="mr-2 h-4 w-4 text-blue-500" />
                Relação com Requisitos ISO 9001:2015
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Este módulo atende aos seguintes requisitos da ISO 9001:2015:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                  <div>
                    <p className="font-medium">9.2 - Auditoria Interna</p>
                    <p className="text-xs text-muted-foreground">Implementação e monitoramento de auditorias internas</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => window.location.href = '/'}
                  >
                    Ver Requisito
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
      </div>
    </AuthenticationRequired>
  );
};

export default AuditSchedule;
