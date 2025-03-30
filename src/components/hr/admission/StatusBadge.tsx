
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "documentos_pendentes":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Documentos Pendentes</Badge>;
    case "documentos_enviados":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Documentos Enviados</Badge>;
    case "exame_medico":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Exame Médico</Badge>;
    case "contrato_assinado":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Contrato Assinado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
