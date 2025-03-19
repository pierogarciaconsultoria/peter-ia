
import { z } from "zod";

export const indicatorSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  process: z.string().min(1, "Processo é obrigatório"),
  goal_type: z.enum(["higher_better", "lower_better", "target"]),
  goal_value: z.coerce.number().min(0, "Meta deve ser um número positivo"),
  calculation_type: z.enum(["sum", "average"]),
  unit: z.string().optional(),
});

export type IndicatorFormValues = z.infer<typeof indicatorSchema>;
