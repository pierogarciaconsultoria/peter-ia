
import React, { ReactNode } from "react";
import * as icons from "lucide-react";

// Define the type for tab groups
export type TabGroup = {
  id: string;
  name: string;
  icon: ReactNode;
  href?: string;
  component?: string;
  subTabs?: {
    id: string;
    name: string;
    component: string;
    icon?: ReactNode;
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
    id: "structure",
    name: "Estrutura",
    icon: createIcon(icons.BarChartBig),
    subTabs: [
      { id: "organizational-structure", name: "Estrutura Organizacional", component: "DepartmentOrgChart", icon: createIcon(icons.BarChartBig) },
      { id: "departments", name: "Departamentos", component: "DepartmentManagement", icon: createIcon(icons.Building2) },
      { id: "positions", name: "Quadro Aprovado", component: "ApprovedPositions", icon: createIcon(icons.Users) },
      { id: "salary", name: "Plano de Cargos e Salários", component: "JobSalaryPlan", icon: createIcon(icons.DollarSign) }
    ]
  },
  {
    id: "recruitment",
    name: "Recrutamento",
    icon: createIcon(icons.UserPlus),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento e Seleção", component: "RecruitmentSelection", icon: createIcon(icons.UserPlus) },
      { id: "online-admission", name: "Admissão Online", component: "OnlineAdmission", icon: createIcon(icons.UserPlus) }
    ]
  },
  {
    id: "employees",
    name: "Colaboradores",
    icon: createIcon(icons.Users),
    subTabs: [
      { 
        id: "directory", 
        name: "Colaboradores", 
        component: "EmployeeDirectory",
        icon: createIcon(icons.UserCircle)
      },
      { 
        id: "onboarding", 
        name: "Integração", 
        component: "EmployeeOnboarding",
        icon: createIcon(icons.UserPlus)
      },
      { 
        id: "trial-evaluation", 
        name: "Avaliação de Experiência", 
        component: "NewTrialEvaluation",
        icon: createIcon(icons.ClipboardCheck)
      },
      { 
        id: "performance", 
        name: "Avaliação de Desempenho", 
        component: "PerformanceEvaluation",
        icon: createIcon(icons.BarChart2)
      },
      { 
        id: "employee-costs", 
        name: "Gestão de Custos", 
        component: "EmployeeCostManagement",
        icon: createIcon(icons.DollarSign)
      }
    ]
  },
  {
    id: "development",
    name: "Desenvolvimento",
    icon: createIcon(icons.Award),
    subTabs: [
      { id: "development-plans", name: "Planos de Desenvolvimento", component: "DevelopmentPlans", icon: createIcon(icons.Award) },
      { id: "training", name: "Treinamentos", component: "TrainingControl", icon: createIcon(icons.Award) },
      { id: "disc-assessment", name: "Avaliação DISC", component: "DiscAssessment", icon: createIcon(icons.Award) },
      { id: "climate", name: "Pesquisa de Clima", component: "ClimateResearch", icon: createIcon(icons.Award) },
      { id: "feedback", name: "Feedback", component: "FeedbackManagement", icon: createIcon(icons.Award) }
    ]
  },
  {
    id: "management",
    name: "Gestão",
    icon: createIcon(icons.BriefcaseBusiness),
    subTabs: [
      { 
        id: "personnel", 
        name: "Movimentação de Pessoal", 
        component: "PersonnelMovement", 
        icon: createIcon(icons.Users) 
      },
      { 
        id: "vacation", 
        name: "Férias", 
        component: "VacationManagement", 
        icon: createIcon(icons.Calendar) 
      },
      { 
        id: "occurrences", 
        name: "Ocorrências", 
        component: "OccurrenceManagement", 
        icon: createIcon(icons.AlertCircle) 
      },
      { 
        id: "medical", 
        name: "Atestados", 
        component: "MedicalCertificateManagement", 
        icon: createIcon(icons.FileHeart) 
      },
      { 
        id: "board", 
        name: "Mural do Colaborador", 
        component: "EmployeeBoard", 
        icon: createIcon(icons.FileText) 
      },
      { 
        id: "thermometer", 
        name: "Termômetro de Maturidade", 
        component: "MaturityThermometer", 
        icon: createIcon(icons.Thermometer) 
      }
    ]
  },
  {
    id: "exit",
    name: "Desligamento",
    icon: createIcon(icons.LogOut),
    component: "ExitInterviews"
  },
  {
    id: "ambiente",
    name: "Ambiente",
    icon: createIcon(icons.Building2),
    component: "AmbienteContent"
  }
];
