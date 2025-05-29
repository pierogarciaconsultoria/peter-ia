
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
    name: "Estrutura Organizacional",
    icon: createIcon(icons.BarChartBig),
    subTabs: [
      { id: "departments", name: "Departamentos", component: "DepartmentManagement", icon: createIcon(icons.Building2), href: "/human-resources?activeTab=departments" },
      { id: "positions", name: "Quadro de Posições Aprovadas", component: "ApprovedPositions", icon: createIcon(icons.Users), href: "/human-resources?activeTab=positions" },
      { id: "salary", name: "Plano de Cargos e Salários", component: "JobSalaryPlan", icon: createIcon(icons.DollarSign), href: "/human-resources?activeTab=salary" },
      { id: "organizational-structure", name: "Organograma", component: "DepartmentOrgChart", icon: createIcon(icons.BarChartBig), href: "/human-resources?activeTab=organizational-structure" },
      { id: "personnel", name: "Movimentação de Pessoal", component: "PersonnelMovement", icon: createIcon(icons.Users), href: "/human-resources?activeTab=personnel" }
    ]
  },
  {
    id: "recruitment",
    name: "Recrutamento",
    icon: createIcon(icons.UserPlus),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento e Seleção", component: "RecruitmentSelection", icon: createIcon(icons.UserPlus), href: "/human-resources?activeTab=recruitment-selection" },
      { id: "interview", name: "Entrevista de admissão", component: "AdmissionInterview", icon: createIcon(icons.FileText), href: "/human-resources?activeTab=interview" },
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
        name: "Custos de Pessoal", 
        component: "EmployeeCostManagement",
        icon: createIcon(icons.DollarSign),
        href: "/human-resources?activeTab=employee-costs"
      }
    ]
  },
  {
    id: "daily-management",
    name: "Gestão Operacional",
    icon: createIcon(icons.Calendar),
    subTabs: [
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
        name: "Atestados Médicos", 
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
      }
    ]
  },
  {
    id: "development",
    name: "Desenvolvimento Profissional",
    icon: createIcon(icons.Award),
    subTabs: [
      { id: "disc-assessment", name: "Avaliação de Perfil DISC", component: "DiscAssessment", icon: createIcon(icons.Award), href: "/human-resources?activeTab=disc-assessment" },
      { id: "development-plans", name: "Planos de Desenvolvimento Individual", component: "DevelopmentPlans", icon: createIcon(icons.Award), href: "/human-resources?activeTab=development-plans" },
      { id: "training", name: "Treinamentos", component: "TrainingControl", icon: createIcon(icons.Award), href: "/human-resources?activeTab=training" },
      { id: "climate", name: "Pesquisa de Clima Organizacional", component: "ClimateResearch", icon: createIcon(icons.Award), href: "/human-resources?activeTab=climate" },
      { id: "feedback", name: "Feedback", component: "FeedbackManagement", icon: createIcon(icons.Award), href: "/human-resources?activeTab=feedback" }
    ]
  },
  {
    id: "exit",
    name: "Desligamento",
    icon: createIcon(icons.LogOut),
    subTabs: [
      { id: "exit-interviews", name: "Entrevistas de Desligamento", component: "ExitInterviews", icon: createIcon(icons.FileText), href: "/human-resources?activeTab=exit-interviews" }
    ]
  }
];
