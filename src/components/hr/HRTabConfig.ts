
import { 
  DashboardIcon, 
  FileText, 
  Users, 
  CalendarDays, 
  Award, 
  ClipboardList 
} from "lucide-react";
import { ChartBarIcon, UserPlusIcon } from "lucide-react";
import React from "react";

// Define the type for the tab groups
type IconProps = { className: string };
type IconComponent = React.FC<IconProps>;

// Helper function to create icon elements
const createIcon = (Icon: IconComponent, className: string = "h-5 w-5") => {
  return React.createElement(Icon, { className });
};

export const hrTabGroups = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: createIcon(DashboardIcon),
    href: "/human-resources"
  },
  {
    id: "employees",
    name: "Colaboradores",
    icon: createIcon(Users),
    subTabs: [
      { id: "directory", name: "Diretório", component: "EmployeeDirectory" },
      { id: "onboarding", name: "Integração", component: "EmployeeOnboarding" },
      { id: "trial-evaluation", name: "Avaliação de Experiência", component: "NewTrialEvaluation" },
      { id: "performance", name: "Avaliação de Desempenho", component: "PerformanceEvaluation" },
      { id: "occurrences", name: "Ocorrências", component: "OccurrenceManagement" },
      { id: "medical", name: "Atestados", component: "MedicalCertificateManagement" },
      { id: "exit", name: "Entrevistas de Desligamento", component: "ExitInterviews" }
    ]
  },
  {
    id: "development",
    name: "Desenvolvimento",
    icon: createIcon(Award),
    subTabs: [
      { id: "development-plans", name: "Planos de Desenvolvimento", component: "DevelopmentPlans" },
      { id: "training", name: "Treinamentos", component: "TrainingControl" },
      { id: "climate", name: "Pesquisa de Clima", component: "ClimateResearch" },
      { id: "feedback", name: "Feedback", component: "FeedbackManagement" },
      { id: "disc-assessment", name: "Avaliação DISC", component: "DiscAssessment" }
    ]
  },
  {
    id: "recruitment",
    name: "Recrutamento",
    icon: createIcon(UserPlusIcon),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento e Seleção", component: "RecruitmentSelection" },
      { id: "online-admission", name: "Admissão Online", component: "OnlineAdmission" }
    ]
  },
  {
    id: "structure",
    name: "Estrutura",
    icon: createIcon(ChartBarIcon),
    subTabs: [
      { id: "organizational-structure", name: "Estrutura Organizacional", component: "DepartmentOrgChart" },
      { id: "departments", name: "Departamentos", component: "DepartmentManagement" },
      { id: "positions", name: "Cargos", component: "ApprovedPositions" },
      { id: "salary", name: "Plano Salarial", component: "JobSalaryPlan" }
    ]
  },
  {
    id: "management",
    name: "Gestão",
    icon: createIcon(ClipboardList),
    subTabs: [
      { id: "personnel", name: "Movimentação de Pessoal", component: "PersonnelMovement" },
      { id: "vacation", name: "Férias", component: "VacationManagement" },
      { id: "thermometer", name: "Termômetro de Maturidade", component: "MaturityThermometer" },
      { id: "board", name: "Quadro de Colaboradores", component: "EmployeeBoard" }
    ]
  },
  {
    id: "documents",
    name: "Documentos",
    icon: createIcon(FileText),
    href: "/documents"
  },
  {
    id: "calendar",
    name: "Agenda",
    icon: createIcon(CalendarDays),
    href: "/calendar"
  }
];
