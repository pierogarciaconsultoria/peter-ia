
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
    href?: string;
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
    href: "/human-resources",
    component: "HRDashboard"
  },
  {
    id: "structure",
    name: "Estrutura",
    icon: createIcon(icons.BarChartBig),
    subTabs: [
      { id: "organizational-structure", name: "Estrutura Organizacional", component: "DepartmentOrgChart", icon: createIcon(icons.BarChartBig), href: "/human-resources?activeTab=organizational-structure" },
      { id: "departments", name: "Departamentos", component: "DepartmentManagement", icon: createIcon(icons.Building2), href: "/human-resources?activeTab=departments" },
      { id: "positions", name: "Quadro Aprovado", component: "ApprovedPositions", icon: createIcon(icons.Users), href: "/human-resources?activeTab=positions" },
      { id: "salary", name: "Plano de Cargos e Salários", component: "JobSalaryPlan", icon: createIcon(icons.DollarSign), href: "/human-resources?activeTab=salary" }
    ]
  },
  {
    id: "recruitment",
    name: "Recrutamento",
    icon: createIcon(icons.UserPlus),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento e Seleção", component: "RecruitmentSelection", icon: createIcon(icons.UserPlus), href: "/human-resources?activeTab=recruitment-selection" },
      { id: "online-admission", name: "Admissão Online", component: "OnlineAdmission", icon: createIcon(icons.UserPlus), href: "/human-resources?activeTab=online-admission" }
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
        icon: createIcon(icons.UserCircle),
        href: "/human-resources?activeTab=directory"
      },
      { 
        id: "onboarding", 
        name: "Integração", 
        component: "EmployeeOnboarding",
        icon: createIcon(icons.UserPlus),
        href: "/human-resources?activeTab=onboarding"
      },
      { 
        id: "trial-evaluation", 
        name: "Avaliação de Experiência", 
        component: "NewTrialEvaluation",
        icon: createIcon(icons.ClipboardCheck),
        href: "/human-resources?activeTab=trial-evaluation"
      },
      { 
        id: "performance", 
        name: "Avaliação de Desempenho", 
        component: "PerformanceEvaluation",
        icon: createIcon(icons.BarChart2),
        href: "/human-resources?activeTab=performance"
      },
      { 
        id: "employee-costs", 
        name: "Gestão de Custos", 
        component: "EmployeeCostManagement",
        icon: createIcon(icons.DollarSign),
        href: "/human-resources?activeTab=employee-costs"
      }
    ]
  },
  {
    id: "development",
    name: "Desenvolvimento",
    icon: createIcon(icons.Award),
    subTabs: [
      { id: "development-plans", name: "Planos de Desenvolvimento", component: "DevelopmentPlans", icon: createIcon(icons.Award), href: "/human-resources?activeTab=development-plans" },
      { id: "training", name: "Treinamentos", component: "TrainingControl", icon: createIcon(icons.Award), href: "/human-resources?activeTab=training" },
      { id: "disc-assessment", name: "Avaliação DISC", component: "DiscAssessment", icon: createIcon(icons.Award), href: "/human-resources?activeTab=disc-assessment" },
      { id: "climate", name: "Pesquisa de Clima", component: "ClimateResearch", icon: createIcon(icons.Award), href: "/human-resources?activeTab=climate" },
      { id: "feedback", name: "Feedback", component: "FeedbackManagement", icon: createIcon(icons.Award), href: "/human-resources?activeTab=feedback" }
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
        icon: createIcon(icons.Users),
        href: "/human-resources?activeTab=personnel"
      },
      { 
        id: "vacation", 
        name: "Férias", 
        component: "VacationManagement",
        icon: createIcon(icons.Calendar),
        href: "/human-resources?activeTab=vacation"
      },
      { 
        id: "occurrences", 
        name: "Ocorrências", 
        component: "OccurrenceManagement",
        icon: createIcon(icons.AlertCircle),
        href: "/human-resources?activeTab=occurrences"
      },
      { 
        id: "medical", 
        name: "Atestados", 
        component: "MedicalCertificateManagement",
        icon: createIcon(icons.FileHeart),
        href: "/human-resources?activeTab=medical"
      },
      { 
        id: "board", 
        name: "Mural do Colaborador", 
        component: "EmployeeBoard",
        icon: createIcon(icons.FileText),
        href: "/human-resources?activeTab=board"
      },
      { 
        id: "thermometer", 
        name: "Termômetro de Maturidade", 
        component: "MaturityThermometer",
        icon: createIcon(icons.Thermometer),
        href: "/human-resources?activeTab=thermometer"
      }
    ]
  },
  {
    id: "exit",
    name: "Desligamento",
    icon: createIcon(icons.LogOut),
    component: "ExitInterviews",
    href: "/human-resources?activeTab=exit"
  },
  {
    id: "ambiente",
    name: "Ambiente",
    icon: createIcon(icons.Building2),
    component: "AmbienteContent",
    href: "/human-resources?activeTab=ambiente"
  }
];
