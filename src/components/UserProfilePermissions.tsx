
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, LockIcon } from "lucide-react";

export function UserProfilePermissions() {
  const { permissoes, isLoading, podeVisualizar } = useUserPermissions();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[220px]" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockIcon className="h-5 w-5" />
          <span>Permissões do Usuário</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {permissoes.length === 0 ? (
          <p className="text-muted-foreground italic">
            Nenhuma permissão específica encontrada para este usuário.
          </p>
        ) : (
          <div className="space-y-4">
            {permissoes.map((permissao) => (
              <div key={permissao.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{permissao.nome}</h3>
                  <Badge variant="outline">{permissao.chave}</Badge>
                </div>
                
                {permissao.descricao && (
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    {permissao.descricao}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    {permissao.pode_visualizar ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Visualizar
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {permissao.pode_editar ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Editar
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {permissao.pode_excluir ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Excluir
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {permissao.pode_criar ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Criar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
