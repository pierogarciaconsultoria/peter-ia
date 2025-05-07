
import { Badge } from "@/components/ui/badge";

type EmployeeStatusProps = {
  status: string;
};

export function EmployeeStatus({ status }: EmployeeStatusProps) {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
    case "inactive":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>;
    case "on_leave":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em licença</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
