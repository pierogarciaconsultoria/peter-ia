
import { HRDashboard } from "./HRDashboard";
import { EmployeeDirectory } from "./EmployeeDirectory";
import { EmployeeOnboarding } from "./EmployeeOnboarding";
import { TrialEvaluation } from "./TrialEvaluation";
import NewTrialEvaluation from "./NewTrialEvaluation"; // Fixed import
import { PerformanceEvaluation } from "./PerformanceEvaluation";
import { OccurrenceManagement } from "./OccurrenceManagement";
import { MedicalCertificateManagement } from "./MedicalCertificateManagement";
import { ExitInterviews } from "./ExitInterviews";
import { DevelopmentPlans } from "./DevelopmentPlans";
import { TrainingControl } from "./TrainingControl"; 
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
import { AmbienteContent } from "./AmbienteContent";
import { EmployeeCostManagement } from "./employee-costs/EmployeeCostManagement";
import { ClimateSurvey } from "./climate-survey/ClimateSurvey";

interface HRTabContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Sample positions data for DepartmentOrgChart
const samplePositions = [
  {
    id: "ceo",
    title: "CEO",
    department: "Executive",
    level: "Senior",
    isDepartmentHead: true
  },
  {
    id: "cto",
    title: "CTO",
    department: "Technology",
    level: "Senior",
    parentPosition: "ceo",
    isDepartmentHead: true
  },
  {
    id: "cfo",
    title: "CFO",
    department: "Finance",
    level: "Senior",
    parentPosition: "ceo",
    isDepartmentHead: true
  },
  {
    id: "dev-lead",
    title: "Development Lead",
    department: "Technology",
    level: "Senior",
    parentPosition: "cto"
  }
];

export function HRTabContent({ activeTab, onTabChange }: HRTabContentProps) {
  const getTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HRDashboard />;
      case "directory":
        return <EmployeeDirectory />;
      case "employee-costs":
        return <EmployeeCostManagement />;
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
        return <ClimateSurvey />;
      case "feedback":
        return <FeedbackManagement />;
      case "disc-assessment":
        return <DiscAssessment />;
      case "recruitment-selection":
        return <RecruitmentSelection />;
      case "online-admission":
        return <OnlineAdmission />;
      case "organizational-structure":
        return <DepartmentOrgChart positions={samplePositions} />;
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
      case "ambiente":
        return <AmbienteContent />;
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
