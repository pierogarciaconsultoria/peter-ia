
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, AlertTriangle, ShieldCheck, User } from "lucide-react";

export function RiskDetailsDialog({ risk, open, onOpenChange }) {
  if (!risk) return null;
  
  const getLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case "crítico": return "bg-red-100 text-red-800";
      case "alto": return "bg-orange-100 text-orange-800";
      case "médio": return "bg-yellow-100 text-yellow-800";
      case "baixo": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "aberto": return "bg-red-100 text-red-800";
      case "em tratamento": return "bg-blue-100 text-blue-800";
      case "monitorando": return "bg-purple-100 text-purple-800";
      case "tratado": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{risk.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className={getLevelColor(risk.level)}>
              {risk.level}
            </Badge>
            <Badge variant="outline" className={getStatusColor(risk.status)}>
              {risk.status}
            </Badge>
            <Badge variant="outline">
              {risk.process}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Descrição</h3>
            <p className="text-sm text-muted-foreground">
              {risk.description || "Falha em equipamento crítico de produção que pode levar à interrupção do processo produtivo."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Causas Potenciais</h3>
              <p className="text-sm text-muted-foreground">
                {risk.causes || "1. Falta de manutenção preventiva\n2. Desgaste natural do equipamento\n3. Uso inadequado"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Consequências</h3>
              <p className="text-sm text-muted-foreground">
                {risk.consequences || "1. Parada da produção\n2. Perda de material\n3. Atraso na entrega para clientes"}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-8 w-8 mb-2 text-amber-500" />
                <h3 className="font-medium">Probabilidade</h3>
                <p>{risk.probability}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-8 w-8 mb-2 text-red-500" />
                <h3 className="font-medium">Impacto</h3>
                <p>{risk.impact}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="h-8 w-8 mb-2 text-blue-500" />
                <h3 className="font-medium">Nível de Risco</h3>
                <p>{risk.level}</p>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-1">Plano de Tratamento</h3>
            <p className="text-sm text-muted-foreground">
              {risk.treatment || "Implementar programa de manutenção preventiva regular. Treinar operadores sobre uso correto do equipamento. Manter peças de reposição em estoque."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Responsável:</span>
              <span className="text-sm text-muted-foreground">{risk.responsible || "João Silva"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Prazo:</span>
              <span className="text-sm text-muted-foreground">{risk.deadline || "30/09/2023"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última atualização: {risk.updatedAt || "15/08/2023"}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
