import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  AlertOctagon, 
  Package, 
  Activity, 
  MessageSquareWarning, 
  UserCheck, 
  Ruler, 
  GraduationCap, 
  Search, 
  ThumbsUp, 
  Users, 
  PackageCheck, 
  CalendarCheck, 
  CalendarCheck2, 
  TriangleAlert, 
  LineChart,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/auth");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  // Extract user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata) return "U";
    
    const firstName = user.user_metadata.first_name || "";
    const lastName = user.user_metadata.last_name || "";
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
  };

  const menuItems = [
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
      name: "Controle de Treinamentos",
      icon: <GraduationCap size={18} />,
      path: "/training-control"
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
      path: "/human-resources"
    },
    {
      name: "Planejamento Estratégico",
      icon: <LineChart size={18} />,
      path: "/strategic-planning"
    }
  ];

  return <>
      {/* Mobile menu button - fixed position aligned with the top header */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* User menu (top right) - adjusted for better alignment */}
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 p-0" /* Fixed size and padding for consistent alignment */
              >
                <Avatar>
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56" /* Fixed width for dropdown menu */
              sideOffset={8} /* Added offset to position menu properly */
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Administração</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
            Login
          </Button>
        )}
      </div>
      
      {/* Sidebar navigation */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 ease-in-out md:translate-x-0", 
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
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
                  <Link to={item.path} className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", 
                    location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  )}>
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
