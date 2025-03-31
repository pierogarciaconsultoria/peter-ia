
import { HRDashboard } from "./HRDashboard";
import { EmployeeDirectory } from "./EmployeeDirectory";
import { EmployeeOnboarding } from "./EmployeeOnboarding";
import { TrialEvaluation } from "./TrialEvaluation";
import { NewTrialEvaluation } from "./NewTrialEvaluation";
import { PerformanceEvaluation } from "./PerformanceEvaluation";
import { OccurrenceManagement } from "./OccurrenceManagement";
import { MedicalCertificateManagement } from "./MedicalCertificateManagement";
import { ExitInterviews } from "./ExitInterviews";
import { DevelopmentPlans } from "./DevelopmentPlans";
import { TrainingControl } from "../TrainingControl";
import { ClimateResearch } from "./ClimateResearch";
import { FeedbackManagement } from "./FeedbackManagement";
import { DiscAssessment } from "./disc-assessment/DiscAssessment";
import { RecruitmentSelection } from "./RecruitmentSelection";
import { OnlineAdmission } from "./OnlineAdmission";
import { DepartmentOrgChart } from "./DepartmentOrgChart";
import { DepartmentManagement } from "./DepartmentManagement";
import { ApprovedPositions } from "./ApprovedPositions";
import { JobSalaryPlan } from "./JobSalaryPlan";
import { PersonnelMovement } from "./PersonnelMovement";
import { VacationManagement } from "./VacationManagement";
import { MaturityThermometer } from "./MaturityThermometer";
import { EmployeeBoard } from "./EmployeeBoard";

interface HRTabContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function HRTabContent({ activeTab }: HRTabContentProps) {
  const getTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HRDashboard />;
      case "directory":
        return <EmployeeDirectory />;
      case "onboarding":
        return <EmployeeOnboarding />;
      case "trial-evaluation":
        return <NewTrialEvaluation />;
      case "performance":
        return <PerformanceEvaluation />;
      case "occurrences":
        return <OccurrenceManagement />;
      case "medical":
        return <MedicalCertificateManagement />;
      case "exit":
        return <ExitInterviews />;
      case "development-plans":
        return <DevelopmentPlans />;
      case "training":
        return <TrainingControl />;
      case "climate":
        return <ClimateResearch />;
      case "feedback":
        return <FeedbackManagement />;
      case "disc-assessment":
        return <DiscAssessment />;
      case "recruitment-selection":
        return <RecruitmentSelection />;
      case "online-admission":
        return <OnlineAdmission />;
      case "organizational-structure":
        return <DepartmentOrgChart />;
      case "departments":
        return <DepartmentManagement />;
      case "positions":
        return <ApprovedPositions />;
      case "salary":
        return <JobSalaryPlan />;
      case "personnel":
        return <PersonnelMovement />;
      case "vacation":
        return <VacationManagement />;
      case "thermometer":
        return <MaturityThermometer />;
      case "board":
        return <EmployeeBoard />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="pt-4">
      {getTabContent()}
    </div>
  );
}
