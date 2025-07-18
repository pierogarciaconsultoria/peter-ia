
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Settings, Building2, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { isLovableEditor, isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

export function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin, isSuperAdmin, isCompanyAdmin, userCompany } = useAuth();
  
  // Check if access is via Lovable editor with super admin privileges
  const isMasterAdminAccess = isSuperAdminInLovable();
  const isInLovableEditor = isLovableEditor();

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
    if (isMasterAdminAccess) return "SA"; // Super Admin
    if (!user?.user_metadata) return "U";
    
    const firstName = user.user_metadata.first_name || "";
    const lastName = user.user_metadata.last_name || "";
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
  };

  // NOVO: Mostrar status do usuário atual
  const getUserDisplayInfo = () => {
    if (isMasterAdminAccess) {
      return {
        name: "Super Admin (Lovable)",
        email: "Acesso via Lovable Editor",
        showWarning: true
      };
    }
    
    if (user?.user_metadata) {
      return {
        name: `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim(),
        email: user.email || '',
        showWarning: false
      };
    }
    
    return {
      name: "Usuário não identificado",
      email: "",
      showWarning: false
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className="fixed top-5 right-5 z-50">
      {user || isMasterAdminAccess ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={isMasterAdminAccess ? "destructive" : "ghost"} 
              size="icon" 
              className="rounded-full h-10 w-10 p-0"
            >
              <Avatar>
                <AvatarFallback className={isMasterAdminAccess ? "bg-destructive text-destructive-foreground" : ""}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-card text-card-foreground"
            alignOffset={0}
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                {userInfo.showWarning ? (
                  <>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-medium text-destructive">Acesso Super Admin</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Acesso total via Lovable Editor</p>
                    <p className="text-xs text-yellow-600">Usuário atual tem poderes de Super Admin</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                    {userCompany && (
                      <div className="flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs font-medium">{userCompany.name}</p>
                      </div>
                    )}
                    {(isAdmin || isMasterAdminAccess) && (
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3 text-primary" />
                        <p className="text-xs text-primary font-medium">
                          {isMasterAdminAccess ? 'Super Admin (Lovable)' : 
                           isSuperAdmin ? 'Super Admin' : 
                           isCompanyAdmin ? 'Admin da Empresa' : ''}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {!isMasterAdminAccess && (
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
              )}
              {(isAdmin || isMasterAdminAccess) && (
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Administração</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            {!isMasterAdminAccess && (
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            )}
            
            {isMasterAdminAccess && (
              <DropdownMenuItem onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('master_admin');
                localStorage.removeItem('lovableEditorAccess');
                localStorage.removeItem('lovableSuperAdminAccess');
                sessionStorage.removeItem('lovableEditorAccessNotified');
                window.location.href = url.toString();
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair do Modo Super Admin</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
          Entrar
        </Button>
      )}
    </div>
  );
};
