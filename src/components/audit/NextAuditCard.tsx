
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, CalendarDays } from "lucide-react";
import { Audit } from "@/services/auditService";

interface NextAuditCardProps {
  nextAudit: Audit | null;
  daysRemaining: number | null;
}

export const NextAuditCard = ({ nextAudit, daysRemaining }: NextAuditCardProps) => {
  if (!nextAudit) return null;

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Próxima Auditoria Interna
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Título</h3>
            <p className="text-base font-medium">{nextAudit.title}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
            <p className="text-base font-medium flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-blue-600" />
              {format(new Date(nextAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
              <p className="text-base font-bold text-amber-600">
                {daysRemaining === 1 ? 'Falta 1 dia' : `Faltam ${daysRemaining} dias`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
