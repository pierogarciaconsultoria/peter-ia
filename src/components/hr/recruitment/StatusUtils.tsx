
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Encerrado</Badge>;
    case "finalista":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Finalista</Badge>;
    case "entrevista":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Entrevista</Badge>;
    case "teste técnico":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Teste Técnico</Badge>;
    case "teste":
      return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Fase de Testes</Badge>;
    case "finalizado":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Finalizado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
