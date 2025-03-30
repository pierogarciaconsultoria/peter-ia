
import { useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { EmployeeDirectory } from "@/components/hr/EmployeeDirectory";
import { RecruitmentSelection } from "@/components/hr/RecruitmentSelection";
import { ApprovedPositions } from "@/components/hr/ApprovedPositions";
import { OnlineAdmission } from "@/components/hr/OnlineAdmission";
import { EmployeeOnboarding } from "@/components/hr/EmployeeOnboarding";
import { TrialEvaluation } from "@/components/hr/TrialEvaluation";
import { PerformanceEvaluation } from "@/components/hr/PerformanceEvaluation";
import { JobSalaryPlan } from "@/components/hr/JobSalaryPlan";
import { FeedbackManagement } from "@/components/hr/FeedbackManagement";
import { ClimateResearch } from "@/components/hr/ClimateResearch";
import { EmployeeBoard } from "@/components/hr/EmployeeBoard";
import { OccurrenceManagement } from "@/components/hr/OccurrenceManagement";
import { MedicalCertificateManagement } from "@/components/hr/MedicalCertificateManagement";
import { ExitInterviews } from "@/components/hr/ExitInterviews";
import { DevelopmentPlans } from "@/components/hr/DevelopmentPlans";
import { VacationManagement } from "@/components/hr/VacationManagement";
import { PersonnelMovement } from "@/components/hr/PersonnelMovement";
import { DepartmentManagement } from "@/components/hr/DepartmentManagement";
import { DiscAssessment } from "@/components/hr/disc-assessment/DiscAssessment";
import { OrgStructurePage } from "@/components/hr/organizational-structure/OrgStructurePage";
import { useLocation } from "react-router-dom";

type HRTabContentProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
};

export function HRTabContent({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string, 
  onTabChange: (tabId: string) => void 
}) {
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state.activeTab && activeTab !== location.state.activeTab) {
      onTabChange(location.state.activeTab);
      // After handling the state, clear it to prevent continual redirects
      window.history.replaceState({}, document.title);
    }
  }, [activeTab, onTabChange, location]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
      <TabsContent value="dashboard">
        <HRDashboard />
      </TabsContent>
      
      <TabsContent value="personnel-movement">
        <PersonnelMovement />
      </TabsContent>
      
      <TabsContent value="employees">
        <EmployeeDirectory />
      </TabsContent>

      <TabsContent value="recruitment">
        <RecruitmentSelection />
      </TabsContent>

      <TabsContent value="positions">
        <ApprovedPositions />
      </TabsContent>

      <TabsContent value="org-structure">
        <OrgStructurePage />
      </TabsContent>

      <TabsContent value="admission">
        <OnlineAdmission />
      </TabsContent>

      <TabsContent value="onboarding">
        <EmployeeOnboarding />
      </TabsContent>

      <TabsContent value="trial">
        <TrialEvaluation />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceEvaluation />
      </TabsContent>

      <TabsContent value="exit-interviews">
        <ExitInterviews />
      </TabsContent>

      <TabsContent value="development-plans">
        <DevelopmentPlans />
      </TabsContent>

      <TabsContent value="vacation">
        <VacationManagement />
      </TabsContent>

      <TabsContent value="job-plan">
        <JobSalaryPlan />
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackManagement />
      </TabsContent>

      <TabsContent value="climate">
        <ClimateResearch />
      </TabsContent>

      <TabsContent value="board">
        <EmployeeBoard />
      </TabsContent>

      <TabsContent value="occurrence">
        <OccurrenceManagement />
      </TabsContent>

      <TabsContent value="certificates">
        <MedicalCertificateManagement />
      </TabsContent>
      
      <TabsContent value="departments">
        <DepartmentManagement />
      </TabsContent>
      
      <TabsContent value="disc-assessment">
        <DiscAssessment />
      </TabsContent>
    </Tabs>
  );
}
