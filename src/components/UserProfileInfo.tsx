
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Shield } from "lucide-react";

export function UserProfileInfo() {
  const { user, userProfile, userCompany, isLoading, isMaster, isAdmin } = useCurrentUser();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuário não autenticado</CardTitle>
        </CardHeader>
        <CardContent>
          Faça login para ver suas informações.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Perfil do Usuário</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1">
          <p className="font-medium">
            {userProfile?.first_name} {userProfile?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isMaster && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Super Admin
            </Badge>
          )}
          
          {isAdmin && !isMaster && (
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Administrador
            </Badge>
          )}
          
          {userCompany && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {userCompany.name}
            </Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>ID: {user.id}</p>
          {userProfile?.created_at && (
            <p>Criado em: {new Date(userProfile.created_at).toLocaleDateString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
