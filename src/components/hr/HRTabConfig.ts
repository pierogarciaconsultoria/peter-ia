
import React, { ReactNode } from "react";
import * as icons from "lucide-react";

// Define the type for tab groups
export type TabGroup = {
  id: string;
  name: string;
  icon: ReactNode;
  href?: string;
  subTabs?: {
    id: string;
    name: string;
    component: string;
  }[];
};

// Create icon components without using JSX directly
const createIcon = (Icon: React.ComponentType<any>) => {
  return React.createElement(Icon, { size: 20 });
};

export const hrTabGroups: TabGroup[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: createIcon(icons.LayoutDashboard),
    href: "/human-resources"
  },
  {
    id: "employees",
    name: "Colaboradores",
    icon: createIcon(icons.Users),
    subTabs: [
      { id: "directory", name: "Colaborador", component: "EmployeeDirectory" },
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
    icon: createIcon(icons.Award),
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
    icon: createIcon(icons.UserPlus),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento e Seleção", component: "RecruitmentSelection" },
      { id: "online-admission", name: "Admissão Online", component: "OnlineAdmission" }
    ]
  },
  {
    id: "structure",
    name: "Estrutura",
    icon: createIcon(icons.BarChartBig),
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
    icon: createIcon(icons.ClipboardList),
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
    icon: createIcon(icons.FileText),
    href: "/documents"
  },
  {
    id: "calendar",
    name: "Agenda",
    icon: createIcon(icons.CalendarDays),
    href: "/calendar"
  }
];
