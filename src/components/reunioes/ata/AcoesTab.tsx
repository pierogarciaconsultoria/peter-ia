
import { Acao } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatarDataSimples } from "../utils/formatters";

interface AcoesTabProps {
  acoes: Acao[];
}

export function getBadgeStatus(status: string) {
  switch (status) {
    case "pendente":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
    case "em_andamento":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em andamento</Badge>;
    case "concluido":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
    case "cancelado":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function AcoesTab({ acoes }: AcoesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano de Ação</CardTitle>
      </CardHeader>
      <CardContent>
        {acoes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma ação registrada para esta reunião.
          </p>
        ) : (
          <div className="space-y-4">
            {acoes.map((acao) => (
              <div key={acao.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{acao.titulo}</h4>
                  {getBadgeStatus(acao.status || '')}
                </div>
                
                {acao.descricao && (
                  <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                    {acao.descricao}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Responsável:</span>
                    <span>{acao.responsavel?.name || "Não atribuído"}</span>
                  </div>
                  
                  {acao.prazo && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Prazo:</span>
                      <span>{formatarDataSimples(acao.prazo)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
