
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
  const tabComponents: Record<string, React.ReactNode> = {
    "dashboard": <HRDashboard />,
    "departments": <DepartmentManagement />,
    "positions": <ApprovedPositions />,
    "salary": <JobSalaryPlan />,
    "personnel": <PersonnelMovement />,
    "recruitment-selection": <RecruitmentSelection />,
    "interview": <AdmissionInterview />,
    "online-admission": <OnlineAdmission />,
    "directory": <EmployeeDirectory />,
    "onboarding": <EmployeeOnboarding />,
    "trial-evaluation": <NewTrialEvaluation />,
    "performance": <PerformanceEvaluation />,
    "employee-costs": <EmployeeCostManagement />,
    "vacation": <VacationManagement />,
    "occurrences": <OccurrenceManagement />,
    "medical": <MedicalCertificateManagement />,
    "board": <EmployeeBoard />,
    "thermometer": <MaturityThermometer />,
    "disc-assessment": <DiscAssessment />,
    "development-plans": <DevelopmentPlans />,
    "training": <TrainingControl />,
    "climate": <ClimateResearch />,
    "feedback": <FeedbackManagement />,
    "exit-interviews": <ExitInterviews />,
  };

  const renderTabContent = () => {
    return tabComponents[activeTab] || <HRDashboard />;
  };

  return <div className="w-full">{renderTabContent()}</div>;
}
