import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
interface AuditHeaderProps {
  onNewAudit?: () => void;
}
export const AuditHeader = ({
  onNewAudit
}: AuditHeaderProps) => {
  return <div className="flex items-center justify-between mb-6">
      <div>
        
        
      </div>
      <div className="flex gap-2">
        
        {onNewAudit && <Button onClick={onNewAudit}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Auditoria
          </Button>}
      </div>
    </div>;
};