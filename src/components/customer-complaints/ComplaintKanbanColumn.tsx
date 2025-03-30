
import { CustomerComplaint } from "@/services/customerComplaintService";
import { ComplaintKanbanCard } from "./ComplaintKanbanCard";

interface ComplaintKanbanColumnProps {
  title: string;
  count: number;
  complaints: CustomerComplaint[];
  status: CustomerComplaint['detailed_status'];
  onStatusChange: (complaint: CustomerComplaint, status: CustomerComplaint['detailed_status']) => void;
  isDisabled: boolean;
}

export function ComplaintKanbanColumn({ 
  title, 
  count, 
  complaints,
  status,
  onStatusChange,
  isDisabled
}: ComplaintKanbanColumnProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'nova_reclamacao': return 'bg-blue-100 border-blue-300';
      case 'analise_reclamacao': return 'bg-purple-100 border-purple-300';
      case 'identificacao_causa': return 'bg-amber-100 border-amber-300';
      case 'acao': return 'bg-orange-100 border-orange-300';
      case 'acompanhamento': return 'bg-green-100 border-green-300';
      case 'conclusao': return 'bg-emerald-100 border-emerald-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`flex flex-col rounded-md border ${getStatusColor()}`}>
      <div className="p-3 border-b border-inherit">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs">
            {count}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {complaints.map((complaint) => (
            <ComplaintKanbanCard 
              key={complaint.id} 
              complaint={complaint} 
              onStatusChange={onStatusChange}
              isDisabled={isDisabled}
            />
          ))}
          {complaints.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma reclamação
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
