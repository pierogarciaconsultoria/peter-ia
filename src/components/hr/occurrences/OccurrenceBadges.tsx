
import { Badge } from "@/components/ui/badge";

export function OccurrenceBadges() {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Advertência</Badge>;
      case "disciplinary":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Disciplinar</Badge>;
      case "observation":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Observação</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pendente</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return {
    getTypeBadge,
    getStatusBadge
  };
}
