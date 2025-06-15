
-- Adicionar colunas de relacionamento à quality_policy
ALTER TABLE public.quality_policy
  ADD COLUMN related_action_plans UUID[] DEFAULT '{}'::uuid[],
  ADD COLUMN related_indicators UUID[] DEFAULT '{}'::uuid[];
