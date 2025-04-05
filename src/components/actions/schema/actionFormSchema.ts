
import { z } from "zod";
import { ActionSource, ActionStatus, ActionPriority, ProcessArea } from "@/types/actions";

// Convert the union types to arrays for easier manipulation
export const processAreaValues: ProcessArea[] = [
  'manufacturing', 'quality', 'management', 'hr', 'sales', 'supply_chain', 'other',
  'Comercial', 'Financeiro', 'Produção', 'Qualidade', 'RH', 'TI', 'Logística', 
  'Compras', 'Treinamento', 'Administrativo'
];

export const actionSourceValues: ActionSource[] = [
  'planning', 'audit', 'internal_audit', 'external_audit', 'non_conformity',
  'corrective_action', 'critical_analysis', 'management_review', 'customer_satisfaction',
  'supplier_evaluation', 'customer_complaint', 'performance_indicator',
  'improvement_opportunity', 'strategic_planning', 'risk_management', 'other'
];

export const actionStatusValues: ActionStatus[] = [
  "planned", "in_progress", "completed", "delayed", "cancelled"
];

export const actionPriorityValues: ActionPriority[] = [
  "low", "medium", "high", "critical"
];

export const actionSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  source: z.enum(actionSourceValues as [ActionSource, ...ActionSource[]]),
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
  status: z.enum(actionStatusValues as [ActionStatus, ...ActionStatus[]]),
  priority: z.enum(actionPriorityValues as [ActionPriority, ...ActionPriority[]]),
  process_area: z.enum(processAreaValues as [ProcessArea, ...ProcessArea[]]),
  comments: z.string().optional(),
});

export type ActionFormValues = z.infer<typeof actionSchema>;

export const getDefaultValues = (action?: any) => {
  if (action) {
    return {
      ...action,
      how_much: action.how_much || null,
      involved_people: action.involved_people || "",
    };
  }
  
  return {
    title: "",
    source: "planning" as ActionSource,
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
    status: "planned" as ActionStatus,
    priority: "medium" as ActionPriority,
    process_area: "quality" as ProcessArea,
    comments: "",
  };
};
