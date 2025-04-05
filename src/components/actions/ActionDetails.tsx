import { Action5W2H } from "@/types/actions";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActionDetailsProps = {
  action: Action5W2H;
  onClose: () => void;
  onEdit: () => void;
};

export function ActionDetails({ action, onClose, onEdit }: ActionDetailsProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatCurrency = (value: number | null, currency: string = "BRL") => {
    if (value === null) return "N/A";
    
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    });
    
    return formatter.format(value);
  };
  
  const getProcessText = (process: string) => {
    switch (process) {
      case "manufacturing": return "Produção";
      case "quality": return "Qualidade";
      case "management": return "Gestão";
      case "hr": return "Recursos Humanos";
      case "sales": return "Vendas";
      case "supply_chain": return "Cadeia de Suprimentos";
      case "Comercial": return "Comercial";
      case "Financeiro": return "Financeiro";
      case "Produção": return "Produção";
      case "Qualidade": return "Qualidade";
      case "RH": return "RH";
      case "TI": return "TI";
      case "Logística": return "Logística";
      case "Compras": return "Compras";
      case "Treinamento": return "Treinamento";
      case "Administrativo": return "Administrativo";
      case "other": return "Outro";
      default: return process;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "planned": return "Planejada";
      case "in_progress": return "Em Andamento";
      case "completed": return "Concluída";
      case "delayed": return "Atrasada";
      case "cancelled": return "Cancelada";
      default: return status;
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low": return "Baixa";
      case "medium": return "Média";
      case "high": return "Alta";
      case "critical": return "Crítica";
      default: return priority;
    }
  };
  
  const getSourceText = (source: string) => {
    switch (source) {
      case "planning": return "Planejamento";
      case "audit": return "Auditoria";
      case "internal_audit": return "Auditoria Interna";
      case "external_audit": return "Auditoria Externa";
      case "non_conformity": return "Não Conformidade";
      case "corrective_action": return "Ação Corretiva";
      case "critical_analysis": return "Análise Crítica";
      case "management_review": return "Análise Crítica da Direção";
      case "customer_satisfaction": return "Pesquisa de Satisfação";
      case "supplier_evaluation": return "Avaliação de Fornecedor";
      case "customer_complaint": return "Reclamação de Cliente";
      case "performance_indicator": return "Indicador de Desempenho";
      case "improvement_opportunity": return "Oportunidade de Melhoria";
      case "strategic_planning": return "Planejamento Estratégico";
      case "risk_management": return "Gestão de Riscos";
      case "other": return "Outro";
      default: return source;
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-xl">{action.title}</DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh] pr-4">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status:</p>
              <p className="font-medium">{getStatusText(action.status)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Prioridade:</p>
              <p className="font-medium">{getPriorityText(action.priority)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Origem:</p>
              <p className="font-medium">{getSourceText(action.source || "other")}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Metodologia 5W2H</h3>
            
            <div className="bg-muted p-4 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">O que? (What)</h4>
                  <p className="text-sm whitespace-pre-wrap">{action.what}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Por que? (Why)</h4>
                  <p className="text-sm whitespace-pre-wrap">{action.why}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Onde? (Where)</h4>
                  <p className="text-sm">{action.where}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Quem? (Who)</h4>
                  <p className="text-sm">{action.responsible}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Envolvidos</h4>
                <p className="text-sm">{action.involved_people || "N/A"}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Quando começar? (When)</h4>
                  <p className="text-sm">{formatDate(action.start_date)}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Quando terminar? (When)</h4>
                  <p className="text-sm">{formatDate(action.due_date)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Como? (How)</h4>
                <p className="text-sm whitespace-pre-wrap">{action.how}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Quanto custa? (How Much)</h4>
                <p className="text-sm">{formatCurrency(action.how_much, action.currency)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Área de Processo:</p>
              <p>{getProcessText(action.process_area)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Criado em:</p>
              <p>{formatDate(action.created_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Última atualização:</p>
              <p>{action.updated_at ? formatDate(action.updated_at) : "N/A"}</p>
            </div>
          </div>
          
          {action.comments && (
            <div className="space-y-2">
              <h4 className="font-medium">Comentários:</h4>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{action.comments}</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={onEdit}>
          Editar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
