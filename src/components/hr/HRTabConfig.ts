
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
    id: "organization",
    name: "Organização",
    icon: createIcon(icons.Building2),
    subTabs: [
      { id: "departments", name: "Departamentos", component: "DepartmentManagement", icon: createIcon(icons.Building), href: "/human-resources?activeTab=departments" },
      { id: "positions", name: "Posições Aprovadas", component: "ApprovedPositions", icon: createIcon(icons.Users), href: "/human-resources?activeTab=positions" },
      { id: "salary", name: "Cargos e Salários", component: "JobSalaryPlan", icon: createIcon(icons.DollarSign), href: "/human-resources?activeTab=salary" }
    ]
  },
  {
    id: "talent",
    name: "Talentos",
    icon: createIcon(icons.UserPlus),
    subTabs: [
      { id: "recruitment-selection", name: "Recrutamento", component: "RecruitmentSelection", icon: createIcon(icons.Search), href: "/human-resources?activeTab=recruitment-selection" },
      { id: "interview", name: "Entrevistas", component: "AdmissionInterview", icon: createIcon(icons.MessageSquare), href: "/human-resources?activeTab=interview" },
      { id: "online-admission", name: "Admissão Online", component: "OnlineAdmission", icon: createIcon(icons.Globe), href: "/human-resources?activeTab=online-admission" }
    ]
  },
  {
    id: "people",
    name: "Pessoas",
    icon: createIcon(icons.Users),
    subTabs: [
      { id: "directory", name: "Colaboradores", component: "EmployeeDirectory", icon: createIcon(icons.UserCircle), href: "/human-resources?activeTab=directory" },
      { id: "onboarding", name: "Integração", component: "EmployeeOnboarding", icon: createIcon(icons.UserCheck), href: "/human-resources?activeTab=onboarding" },
      { id: "personnel", name: "Movimentação", component: "PersonnelMovement", icon: createIcon(icons.ArrowRightLeft), href: "/human-resources?activeTab=personnel" },
      { id: "employee-costs", name: "Custos", component: "EmployeeCostManagement", icon: createIcon(icons.Calculator), href: "/human-resources?activeTab=employee-costs" }
    ]
  },
  {
    id: "performance",
    name: "Performance",
    icon: createIcon(icons.TrendingUp),
    subTabs: [
      { id: "trial-evaluation", name: "Experiência", component: "NewTrialEvaluation", icon: createIcon(icons.ClipboardCheck), href: "/human-resources?activeTab=trial-evaluation" },
      { id: "performance", name: "Desempenho", component: "PerformanceEvaluation", icon: createIcon(icons.BarChart3), href: "/human-resources?activeTab=performance" },
      { id: "disc-assessment", name: "Perfil DISC", component: "DiscAssessment", icon: createIcon(icons.Target), href: "/human-resources?activeTab=disc-assessment" },
      { id: "development-plans", name: "Desenvolvimento", component: "DevelopmentPlans", icon: createIcon(icons.GraduationCap), href: "/human-resources?activeTab=development-plans" }
    ]
  },
  {
    id: "operations",
    name: "Operações",
    icon: createIcon(icons.Settings),
    subTabs: [
      { id: "vacation", name: "Férias", component: "VacationManagement", icon: createIcon(icons.Calendar), href: "/human-resources?activeTab=vacation" },
      { id: "occurrences", name: "Ocorrências", component: "OccurrenceManagement", icon: createIcon(icons.AlertTriangle), href: "/human-resources?activeTab=occurrences" },
      { id: "medical", name: "Atestados", component: "MedicalCertificateManagement", icon: createIcon(icons.FileHeart), href: "/human-resources?activeTab=medical" },
      { id: "training", name: "Treinamentos", component: "TrainingControl", icon: createIcon(icons.BookOpen), href: "/human-resources?activeTab=training" }
    ]
  },
  {
    id: "insights",
    name: "Insights",
    icon: createIcon(icons.BarChart),
    subTabs: [
      { id: "climate", name: "Clima Organizacional", component: "ClimateResearch", icon: createIcon(icons.Thermometer), href: "/human-resources?activeTab=climate" },
      { id: "feedback", name: "Feedback", component: "FeedbackManagement", icon: createIcon(icons.MessageCircle), href: "/human-resources?activeTab=feedback" },
      { id: "board", name: "Mural", component: "EmployeeBoard", icon: createIcon(icons.Newspaper), href: "/human-resources?activeTab=board" },
      { id: "exit-interviews", name: "Desligamento", component: "ExitInterviews", icon: createIcon(icons.LogOut), href: "/human-resources?activeTab=exit-interviews" }
    ]
  }
];
