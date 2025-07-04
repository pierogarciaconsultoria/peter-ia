
import { HRDashboard } from "./HRDashboard";
import { DepartmentManagement } from "./DepartmentManagement";
import { ApprovedPositions } from "./ApprovedPositions";
import { JobSalaryPlan } from "./JobSalaryPlan";
import { RecruitmentSelection } from "./RecruitmentSelection";
import { AdmissionInterview } from "./AdmissionInterview";
import { OnlineAdmission } from "./OnlineAdmission";
import { EmployeeDirectory } from "./EmployeeDirectory";
import { EmployeeOnboarding } from "./EmployeeOnboarding";
import { NewTrialEvaluation } from "./NewTrialEvaluation";
import { PerformanceEvaluation } from "./PerformanceEvaluation";
import { EmployeeCostManagement } from "./employee-costs/EmployeeCostManagement";
import { DiscAssessment } from "./disc-assessment/DiscAssessment";
import { DevelopmentPlans } from "./DevelopmentPlans";
import { TrainingControl } from "./TrainingControl";
import { ClimateResearch } from "./ClimateResearch";
import { FeedbackManagement } from "./FeedbackManagement";
import { PersonnelMovement } from "./PersonnelMovement";
import { VacationManagement } from "./VacationManagement";
import { OccurrenceManagement } from "./OccurrenceManagement";
import { MedicalCertificateManagement } from "./MedicalCertificateManagement";
import { EmployeeBoard } from "./EmployeeBoard";
import { ExitInterviews } from "./ExitInterviews";
import { MaturityThermometer } from "./MaturityThermometer";

interface HRTabContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function HRTabContent({ activeTab, onTabChange }: HRTabContentProps) {
  // Renderizar o componente com base na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HRDashboard />;
      case "departments":
        return <DepartmentManagement />;
      case "positions":
        return <ApprovedPositions />;
      case "salary":
        return <JobSalaryPlan />;
      case "personnel":
        return <PersonnelMovement />;
      case "recruitment-selection":
        return <RecruitmentSelection />;
      case "interview":
        return <AdmissionInterview />;
      case "online-admission":
        return <OnlineAdmission />;
      case "directory":
        return <EmployeeDirectory />;
      case "onboarding":
        return <EmployeeOnboarding />;
      case "trial-evaluation":
        return <NewTrialEvaluation />;
      case "performance":
        return <PerformanceEvaluation />;
      case "employee-costs":
        return <EmployeeCostManagement />;
      case "vacation":
        return <VacationManagement />;
      case "occurrences":
        return <OccurrenceManagement />;
      case "medical":
        return <MedicalCertificateManagement />;
      case "board":
        return <EmployeeBoard />;
      case "thermometer":
        return <MaturityThermometer />;
      case "disc-assessment":
        return <DiscAssessment />;
      case "development-plans":
        return <DevelopmentPlans />;
      case "training":
        return <TrainingControl />;
      case "climate":
        return <ClimateResearch />;
      case "feedback":
        return <FeedbackManagement />;
      case "exit-interviews":
        return <ExitInterviews />;
      default:
        return <HRDashboard />;
    }
  };

  return <div className="w-full">{renderTabContent()}</div>;
}
