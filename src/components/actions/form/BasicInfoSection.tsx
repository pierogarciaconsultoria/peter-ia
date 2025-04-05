
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { actionSourceValues } from "../schema/actionFormSchema";
import { Control } from "react-hook-form";
import { ActionFormValues } from "../schema/actionFormSchema";

interface BasicInfoSectionProps {
  control: Control<ActionFormValues>;
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
}
