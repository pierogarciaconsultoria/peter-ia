import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createAction, updateAction } from "@/services/actionService";
import { Action5W2H, ActionStatus, ActionPriority, ProcessArea, ActionSource } from "@/types/actions";
import { ScrollArea } from "@/components/ui/scroll-area";

const processAreaValues = ['manufacturing', 'quality', 'management', 'hr', 'sales', 'supply_chain', 'other'] as const;
const actionSourceValues = [
  'planning', 'audit', 'internal_audit', 'external_audit', 'non_conformity',
  'corrective_action', 'critical_analysis', 'management_review', 'customer_satisfaction',
  'supplier_evaluation', 'customer_complaint', 'performance_indicator',
  'improvement_opportunity', 'strategic_planning', 'risk_management', 'other'
] as const;

const actionSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  source: z.enum(actionSourceValues),
  what: z.string().min(3, "O que deve ser feito deve ter pelo menos 3 caracteres"),
  why: z.string().min(3, "Por que deve ser feito deve ter pelo menos 3 caracteres"),
  where: z.string().min(2, "Onde deve ser feito deve ter pelo menos 2 caracteres"),
  responsible: z.string().min(2, "Quem é responsável deve ter pelo menos 2 caracteres"),
  involved_people: z.string().optional(),
  due_date: z.string().min(1, "Data de conclusão é obrigatória"),
  start_date: z.string().optional(),
  how: z.string().min(3, "Como deve ser feito deve ter pelo menos 3 caracteres"),
  how_much: z.number().nullable(),
  currency: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed", "delayed", "cancelled"] as const),
  priority: z.enum(["low", "medium", "high", "critical"] as const),
  process_area: z.enum(processAreaValues),
  comments: z.string().optional(),
});

type ActionFormValues = z.infer<typeof actionSchema>;

type ActionFormProps = {
  action?: Action5W2H;
  onClose: () => void;
  afterSubmit: () => void;
};

export function ActionForm({ action, onClose, afterSubmit }: ActionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: action ? {
      ...action,
      how_much: action.how_much || null,
      involved_people: action.involved_people || "",
      source: (action.source || "planning") as ActionFormValues["source"],
      process_area: action.process_area as ActionFormValues["process_area"],
    } : {
      title: "",
      source: "planning",
      what: "",
      why: "",
      where: "",
      responsible: "",
      involved_people: "",
      due_date: new Date().toISOString().split("T")[0],
      start_date: new Date().toISOString().split("T")[0],
      how: "",
      how_much: null,
      currency: "BRL",
      status: "planned",
      priority: "medium",
      process_area: "quality",
      comments: "",
    }
  });
  
  async function onSubmit(values: ActionFormValues) {
    setIsSubmitting(true);
    
    try {
      if (action?.id) {
        await updateAction(action.id, values as unknown as Partial<Action5W2H>);
        toast({
          title: "Ação atualizada",
          description: "A ação foi atualizada com sucesso",
        });
      } else {
        const newAction = {
          ...values,
          start_date: values.start_date,
          how_much: values.how_much,
          currency: values.currency || "BRL",
          comments: values.comments || ""
        };
        
        await createAction(newAction as unknown as Omit<Action5W2H, 'id' | 'created_at' | 'updated_at' | 'completed_at'>);
        toast({
          title: "Ação criada",
          description: "A ação foi criada com sucesso",
        });
      }
      
      afterSubmit();
      onClose();
    } catch (error) {
      console.error("Error saving action:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a ação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{action ? "Editar Ação" : "Nova Ação"}</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para {action ? "atualizar" : "criar"} uma ação baseada na metodologia 5W2H.
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh] pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da ação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem da Ação</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="planning">Planejamento</option>
                      <option value="audit">Auditoria</option>
                      <option value="internal_audit">Auditoria Interna</option>
                      <option value="external_audit">Auditoria Externa</option>
                      <option value="non_conformity">Não Conformidade</option>
                      <option value="corrective_action">Ação Corretiva</option>
                      <option value="critical_analysis">Análise Crítica</option>
                      <option value="management_review">Análise Crítica da Direção</option>
                      <option value="customer_satisfaction">Pesquisa de Satisfação de Cliente</option>
                      <option value="supplier_evaluation">Avaliação de Provedor Externo</option>
                      <option value="customer_complaint">Reclamação de Cliente</option>
                      <option value="performance_indicator">Indicador de Desempenho</option>
                      <option value="improvement_opportunity">Oportunidade de Melhoria</option>
                      <option value="strategic_planning">Planejamento Estratégico</option>
                      <option value="risk_management">Gestão de Riscos</option>
                      <option value="other">Outro</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="what"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O que? (What)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="O que deve ser feito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="why"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Por que? (Why)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Por que deve ser feito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="where"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onde? (Where)</FormLabel>
                    <FormControl>
                      <Input placeholder="Onde deve ser feito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quem? (Who)</FormLabel>
                    <FormControl>
                      <Input placeholder="Quem é responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="involved_people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Envolvidos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Pessoas envolvidas na execução da ação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quando começar? (When)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quando terminar? (When)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="how"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Como? (How)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Como deve ser feito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="how_much"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quanto custa? (How Much)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="BRL">R$ (BRL)</option>
                        <option value="USD">$ (USD)</option>
                        <option value="EUR">€ (EUR)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="planned">Planejada</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="delayed">Atrasada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="process_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Processo</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="manufacturing">Produção</option>
                        <option value="quality">Qualidade</option>
                        <option value="management">Gestão</option>
                        <option value="hr">Recursos Humanos</option>
                        <option value="sales">Vendas</option>
                        <option value="supply_chain">Cadeia de Suprimentos</option>
                        <option value="other">Outro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentários Adicionais</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações ou comentários adicionais" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : action ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </DialogContent>
  );
}
