
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  AlertOctagon, 
  Package, 
  Activity, 
  MessageSquareWarning, 
  UserCheck, 
  Ruler, 
  Search, 
  ThumbsUp, 
  Users, 
  PackageCheck, 
  CalendarCheck, 
  CalendarCheck2, 
  TriangleAlert, 
  LineChart,
  Award,
  UserPlus,
  BarChartBig,
  ClipboardList,
  Building2
} from "lucide-react";

// Define menu item type
export interface MenuItem {
  name: string;
  icon: ReactNode;
  path: string;
  subItems?: MenuItem[];
}

// Export the menu items for reuse
export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: <Home size={18} />,
    path: "/"
  },
  {
    name: "Documentos",
    icon: <FileText size={18} />,
    path: "/documents"
  },
  {
    name: "Não Conformidade",
    icon: <AlertOctagon size={18} />,
    path: "/non-compliance"
  },
  {
    name: "Produto Não Conforme",
    icon: <Package size={18} />,
    path: "/non-conforming-products"
  },
  {
    name: "Indicadores de Desempenho",
    icon: <Activity size={18} />,
    path: "/performance-indicators"
  },
  {
    name: "Reclamação de Cliente",
    icon: <MessageSquareWarning size={18} />,
    path: "/customer-complaints"
  },
  {
    name: "Avaliação de Fornecedores",
    icon: <UserCheck size={18} />,
    path: "/supplier-evaluation"
  },
  {
    name: "Calibração de Equipamentos",
    icon: <Ruler size={18} />,
    path: "/equipment-calibration"
  },
  {
    name: "Pesquisa de Satisfação",
    icon: <ThumbsUp size={18} />,
    path: "/satisfaction-survey"
  },
  {
    name: "Inspeção de Matéria Prima",
    icon: <PackageCheck size={18} />,
    path: "/raw-material-inspection"
  },
  {
    name: "Cronograma de Ação",
    icon: <CalendarCheck size={18} />,
    path: "/action-schedule"
  },
  {
    name: "Auditoria",
    icon: <CalendarCheck2 size={18} />,
    path: "/audit-schedule"
  },
  {
    name: "Gestão de Riscos",
    icon: <TriangleAlert size={18} />,
    path: "/risk-management"
  },
  {
    name: "Contexto da Organização",
    icon: <Search size={18} />,
    path: "/organization-context"
  },
  {
    name: "Análise Crítica",
    icon: <Search size={18} />,
    path: "/critical-analysis"
  },
  {
    name: "Gente e Gestão",
    icon: <Users size={18} />,
    path: "/human-resources",
    subItems: [
      {
        name: "Dashboard",
        icon: <Home size={18} />,
        path: "/human-resources"
      },
      {
        name: "Colaboradores",
        icon: <Users size={18} />,
        path: "/human-resources",
        subItems: [
          { name: "Colaborador", icon: <Users size={18} />, path: "/human-resources?tab=directory" },
          { name: "Integração", icon: <UserPlus size={18} />, path: "/human-resources?tab=onboarding" },
          { name: "Avaliação de Experiência", icon: <ClipboardList size={18} />, path: "/human-resources?tab=trial-evaluation" },
          { name: "Avaliação de Desempenho", icon: <Activity size={18} />, path: "/human-resources?tab=performance" },
          { name: "Ocorrências", icon: <AlertOctagon size={18} />, path: "/human-resources?tab=occurrences" },
          { name: "Atestados", icon: <FileText size={18} />, path: "/human-resources?tab=medical" },
          { name: "Entrevistas de Desligamento", icon: <MessageSquareWarning size={18} />, path: "/human-resources?tab=exit" },
        ]
      },
      {
        name: "Desenvolvimento",
        icon: <Award size={18} />,
        path: "/human-resources",
        subItems: [
          { name: "Planos de Desenvolvimento", icon: <Activity size={18} />, path: "/human-resources?tab=development-plans" },
          { name: "Treinamentos", icon: <Award size={18} />, path: "/human-resources?tab=training" },
          { name: "Pesquisa de Clima", icon: <ThumbsUp size={18} />, path: "/human-resources?tab=climate" },
          { name: "Feedback", icon: <MessageSquareWarning size={18} />, path: "/human-resources?tab=feedback" },
          { name: "Avaliação DISC", icon: <Activity size={18} />, path: "/human-resources?tab=disc-assessment" },
        ]
      },
      {
        name: "Recrutamento",
        icon: <UserPlus size={18} />,
        path: "/human-resources",
        subItems: [
          { name: "Recrutamento e Seleção", icon: <UserPlus size={18} />, path: "/human-resources?tab=recruitment-selection" },
          { name: "Admissão Online", icon: <UserCheck size={18} />, path: "/human-resources?tab=online-admission" },
        ]
      },
      {
        name: "Estrutura",
        icon: <BarChartBig size={18} />,
        path: "/human-resources",
        subItems: [
          { name: "Estrutura Organizacional", icon: <BarChartBig size={18} />, path: "/human-resources?tab=organizational-structure" },
          { name: "Departamentos", icon: <Building2 size={18} />, path: "/human-resources?tab=departments" },
          { name: "Cargos", icon: <UserCheck size={18} />, path: "/human-resources?tab=positions" },
          { name: "Plano Salarial", icon: <LineChart size={18} />, path: "/human-resources?tab=salary" },
        ]
      },
      {
        name: "Gestão",
        icon: <ClipboardList size={18} />,
        path: "/human-resources",
        subItems: [
          { name: "Movimentação de Pessoal", icon: <Users size={18} />, path: "/human-resources?tab=personnel" },
          { name: "Férias", icon: <CalendarCheck size={18} />, path: "/human-resources?tab=vacation" },
          { name: "Termômetro de Maturidade", icon: <Activity size={18} />, path: "/human-resources?tab=thermometer" },
          { name: "Quadro de Colaboradores", icon: <Users size={18} />, path: "/human-resources?tab=board" },
        ]
      },
      {
        name: "Ambiente",
        icon: <Building2 size={18} />,
        path: "/human-resources?tab=ambiente"
      }
    ]
  },
  {
    name: "Planejamento Estratégico",
    icon: <LineChart size={18} />,
    path: "/strategic-planning"
  }
];

export function MenuItems() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const renderSubMenu = (items: MenuItem[]) => (
    <ul className="ml-6 space-y-1 mt-1">
      {items.map((subItem) => (
        <li key={`${subItem.path}${subItem.name}`}>
          <Link 
            to={subItem.path} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", 
              (currentPath === subItem.path ||
                (subItem.path.includes('?tab=') && 
                 location.search.includes(subItem.path.split('?tab=')[1]))) 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {subItem.icon}
            {subItem.name}
          </Link>
          {subItem.subItems && renderSubMenu(subItem.subItems)}
        </li>
      ))}
    </ul>
  );
  
  return (
    <ul className="space-y-1">
      {menuItems.map(item => (
        <li key={item.path}>
          <div>
            <Link to={item.path} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", 
              currentPath === item.path ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            )}>
              {item.icon}
              {item.name}
            </Link>
            {item.subItems && renderSubMenu(item.subItems)}
          </div>
        </li>
      ))}
    </ul>
  );
}
