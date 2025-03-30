
import { Badge } from "@/components/ui/badge";
import { JobPosition } from "../../types";

interface JobPositionDetailsHeaderProps {
  jobPosition: JobPosition;
}

export function JobPositionDetailsHeader({ jobPosition }: JobPositionDetailsHeaderProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "in_review":
        return <Badge className="bg-amber-500">Em Revisão</Badge>;
      case "distributed":
        return <Badge className="bg-blue-500">Distribuído</Badge>;
      default:
        return <Badge variant="outline">Rascunho</Badge>;
    }
  };
  
  return (
    <div>
      <div className="text-xl">
        {jobPosition.code} - {jobPosition.title}
      </div>
      <div className="flex items-center gap-2 mt-2">
        {getStatusBadge(jobPosition.status)}
        <span className="text-sm text-muted-foreground">
          Revisão {jobPosition.revision}
        </span>
      </div>
    </div>
  );
}
