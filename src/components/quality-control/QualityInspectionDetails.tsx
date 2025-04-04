
import { QualityInspection } from "@/services/qualityControlService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, X } from "lucide-react";

interface QualityInspectionDetailsProps {
  inspection: QualityInspection;
}

export function QualityInspectionDetails({ inspection }: QualityInspectionDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "with_observations":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Com Observações</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Produto:</p>
          <p className="text-lg">{inspection.product_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Lote:</p>
          <p className="text-lg">{inspection.batch_number}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Data de Inspeção:</p>
          <p className="text-lg">
            {format(new Date(inspection.inspection_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Status:</p>
          <p className="text-lg">{getStatusBadge(inspection.status)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Tipo de Inspeção:</p>
          <p className="text-lg capitalize">{inspection.inspection_type === 'process' ? 'Processo' : 'Final'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Inspetor:</p>
          <p className="text-lg">{inspection.inspector}</p>
        </div>
        {inspection.process_name && (
          <div className="col-span-2">
            <p className="text-sm font-medium">Processo:</p>
            <p className="text-lg">{inspection.process_name}</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critérios Avaliados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inspection.criteria_results.map((result, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{result.criteria_name}</h3>
                  {result.is_conforming ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" /> Conforme
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" /> Não Conforme
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Esperado</p>
                    <p>{result.expected_value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Obtido</p>
                    <p>{result.actual_value}</p>
                  </div>
                </div>
                {result.observation && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Observação</p>
                    <p className="text-sm">{result.observation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {inspection.observations && (
        <div>
          <h3 className="font-medium mb-2">Observações Gerais</h3>
          <p className="text-sm whitespace-pre-line">{inspection.observations}</p>
        </div>
      )}
    </div>
  );
}
