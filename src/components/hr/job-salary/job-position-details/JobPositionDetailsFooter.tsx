
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Edit, 
  RefreshCw, 
  Share2 
} from "lucide-react";
import { JobPosition } from "../../types";

interface JobPositionDetailsFooterProps {
  jobPosition: JobPosition;
  onEdit: () => void;
  onApprove: () => void;
  onRevise: () => void;
  onDistribute: () => void;
}

export function JobPositionDetailsFooter({
  jobPosition,
  onEdit,
  onApprove,
  onRevise,
  onDistribute,
}: JobPositionDetailsFooterProps) {
  return (
    <div className="gap-2 flex-wrap">
      <Button variant="outline" onClick={onEdit} className="flex items-center">
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </Button>
      
      <Button 
        onClick={onApprove} 
        disabled={jobPosition.status === "approved"} 
        className="bg-green-600 hover:bg-green-700"
      >
        <Check className="mr-2 h-4 w-4" />
        Aprovar
      </Button>
      
      <Button 
        onClick={onRevise} 
        disabled={jobPosition.status === "in_review"} 
        variant="outline"
        className="text-amber-600 border-amber-600 hover:bg-amber-50"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Revisão
      </Button>
      
      <Button 
        onClick={onDistribute} 
        disabled={jobPosition.status === "distributed" || jobPosition.status !== "approved"} 
        variant="outline"
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Distribuir
      </Button>
    </div>
  );
}
