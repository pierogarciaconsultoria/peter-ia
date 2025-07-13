-- Fase 1: Adicionar colunas responsible_id às tabelas que usam texto livre para responsáveis

-- Action Plans - adicionar responsible_id
ALTER TABLE public.action_plans 
ADD COLUMN responsible_id UUID REFERENCES public.employees(id);

-- Action Items - adicionar responsible_id  
ALTER TABLE public.action_items
ADD COLUMN responsible_id UUID REFERENCES public.employees(id);

-- Audit Plans - adicionar responsible_id
ALTER TABLE public.audit_plans
ADD COLUMN responsible_id UUID REFERENCES public.employees(id);

-- Audits - adicionar responsible_id
ALTER TABLE public.audits
ADD COLUMN responsible_id UUID REFERENCES public.employees(id);

-- Customer Complaints - adicionar assigned_to_id
ALTER TABLE public.customer_complaints
ADD COLUMN assigned_to_id UUID REFERENCES public.employees(id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_action_plans_responsible_id ON public.action_plans(responsible_id);
CREATE INDEX IF NOT EXISTS idx_action_items_responsible_id ON public.action_items(responsible_id);
CREATE INDEX IF NOT EXISTS idx_audit_plans_responsible_id ON public.audit_plans(responsible_id);
CREATE INDEX IF NOT EXISTS idx_audits_responsible_id ON public.audits(responsible_id);
CREATE INDEX IF NOT EXISTS idx_customer_complaints_assigned_to_id ON public.customer_complaints(assigned_to_id);

-- Função para migrar dados de texto para UUID (opcional, para uso futuro)
CREATE OR REPLACE FUNCTION public.migrate_responsible_text_to_id()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  employee_uuid UUID;
BEGIN
  -- Migrar action_plans
  FOR rec IN SELECT id, responsible FROM public.action_plans WHERE responsible IS NOT NULL AND responsible_id IS NULL
  LOOP
    SELECT id INTO employee_uuid FROM public.employees WHERE name ILIKE rec.responsible LIMIT 1;
    IF employee_uuid IS NOT NULL THEN
      UPDATE public.action_plans SET responsible_id = employee_uuid WHERE id = rec.id;
    END IF;
  END LOOP;
  
  -- Migrar action_items
  FOR rec IN SELECT id, responsible FROM public.action_items WHERE responsible IS NOT NULL AND responsible_id IS NULL
  LOOP
    SELECT id INTO employee_uuid FROM public.employees WHERE name ILIKE rec.responsible LIMIT 1;
    IF employee_uuid IS NOT NULL THEN
      UPDATE public.action_items SET responsible_id = employee_uuid WHERE id = rec.id;
    END IF;
  END LOOP;
  
  -- Migrar audit_plans
  FOR rec IN SELECT id, responsible FROM public.audit_plans WHERE responsible IS NOT NULL AND responsible_id IS NULL
  LOOP
    SELECT id INTO employee_uuid FROM public.employees WHERE name ILIKE rec.responsible LIMIT 1;
    IF employee_uuid IS NOT NULL THEN
      UPDATE public.audit_plans SET responsible_id = employee_uuid WHERE id = rec.id;
    END IF;
  END LOOP;
  
  -- Migrar audits
  FOR rec IN SELECT id, responsible FROM public.audits WHERE responsible IS NOT NULL AND responsible_id IS NULL
  LOOP
    SELECT id INTO employee_uuid FROM public.employees WHERE name ILIKE rec.responsible LIMIT 1;
    IF employee_uuid IS NOT NULL THEN
      UPDATE public.audits SET responsible_id = employee_uuid WHERE id = rec.id;
    END IF;
  END LOOP;
  
  -- Migrar customer_complaints
  FOR rec IN SELECT id, assigned_to FROM public.customer_complaints WHERE assigned_to IS NOT NULL AND assigned_to_id IS NULL
  LOOP
    SELECT id INTO employee_uuid FROM public.employees WHERE name ILIKE rec.assigned_to LIMIT 1;
    IF employee_uuid IS NOT NULL THEN
      UPDATE public.customer_complaints SET assigned_to_id = employee_uuid WHERE id = rec.id;
    END IF;
  END LOOP;
END;
$$;