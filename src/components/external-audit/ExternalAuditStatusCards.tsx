
import React from "react";
import { 
  Calendar, 
  ClipboardCheck, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { ExternalAudit } from "@/services/externalAuditService";

interface ExternalAuditStatusCardsProps {
  audits: ExternalAudit[];
}

export function ExternalAuditStatusCards({ audits }: ExternalAuditStatusCardsProps) {
  const scheduled = audits.filter(audit => audit.status === 'scheduled').length;
  const inProgress = audits.filter(audit => audit.status === 'in_progress').length;
  const completed = audits.filter(audit => audit.status === 'completed').length;
  const canceled = audits.filter(audit => audit.status === 'canceled').length;

  const cards = [
    {
      title: "Agendadas",
      value: scheduled,
      icon: Calendar,
      color: "bg-blue-100 text-blue-800",
      iconColor: "text-blue-500"
    },
    {
      title: "Em Andamento",
      value: inProgress,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-500"
    },
    {
      title: "Concluídas",
      value: completed,
      icon: ClipboardCheck,
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-500"
    },
    {
      title: "Canceladas",
      value: canceled,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800",
      iconColor: "text-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg shadow-sm ${card.color} flex items-center justify-between`}
        >
          <div>
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
          <card.icon className={`h-8 w-8 ${card.iconColor}`} />
        </div>
      ))}
    </div>
  );
}
