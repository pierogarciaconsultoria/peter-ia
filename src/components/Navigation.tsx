
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, FileText, AlertOctagon, Package, Activity, MessageSquareWarning, UserCheck, Ruler, GraduationCap, PackageCheck, CalendarCheck, CalendarCheck2, TriangleAlert, Building, Search, ThumbsUp, Users } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems = [{
    name: "Dashboard",
    icon: <Home size={18} />,
    path: "/"
  }, {
    name: "Documentos",
    icon: <FileText size={18} />,
    path: "/documents"
  }, {
    name: "Não Conformidade",
    icon: <AlertOctagon size={18} />,
    path: "/non-compliance"
  }, {
    name: "Produto Não Conforme",
    icon: <Package size={18} />,
    path: "/non-conforming-products"
  }, {
    name: "Indicadores de Desempenho",
    icon: <Activity size={18} />,
    path: "/performance-indicators"
  }, {
    name: "Reclamação de Cliente",
    icon: <MessageSquareWarning size={18} />,
    path: "/customer-complaints"
  }, {
    name: "Avaliação de Fornecedores",
    icon: <UserCheck size={18} />,
    path: "/supplier-evaluation"
  }, {
    name: "Calibração de Equipamentos",
    icon: <Ruler size={18} />,
    path: "/equipment-calibration"
  }, {
    name: "Controle de Treinamentos",
    icon: <GraduationCap size={18} />,
    path: "/training-control"
  }, {
    name: "Pesquisa de Satisfação",
    icon: <ThumbsUp size={18} />,
    path: "/satisfaction-survey"
  }, {
    name: "Inspeção de Matéria Prima",
    icon: <PackageCheck size={18} />,
    path: "/raw-material-inspection"
  }, {
    name: "Cronograma de Ação",
    icon: <CalendarCheck size={18} />,
    path: "/action-schedule"
  }, {
    name: "Auditoria",
    icon: <CalendarCheck2 size={18} />,
    path: "/audit-schedule"
  }, {
    name: "Gestão de Riscos",
    icon: <TriangleAlert size={18} />,
    path: "/risk-management"
  }, {
    name: "Contexto da Organização",
    icon: <Building size={18} />,
    path: "/organization-context"
  }, {
    name: "Análise Crítica",
    icon: <Search size={18} />,
    path: "/critical-analysis"
  }, {
    name: "Gestão de Pessoas",
    icon: <Users size={18} />,
    path: "/human-resources"
  }];

  return <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* Sidebar navigation */}
      <div className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 ease-in-out md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Gestão</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Simplificando a conformidade
            </p>
          </div>
          
          <nav className="flex-1 px-4 pb-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(item => <li key={item.path}>
                  <Link to={item.path} className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted")}>
                    {item.icon}
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </nav>
          
          <div className="p-4 mt-auto">
            <Button variant="outline" className="w-full">
              <FileText size={16} className="mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>
      </div>
    </>;
}
