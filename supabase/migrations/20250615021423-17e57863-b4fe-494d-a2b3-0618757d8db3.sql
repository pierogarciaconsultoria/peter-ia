
-- Cria tabela de Plano de Auditoria
CREATE TABLE public.audit_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  responsible TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  audited_areas TEXT NOT NULL,
  team TEXT, -- nomes separados por vírgula ou pode ser array futuramente
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'planejada', 'em_andamento', 'finalizada')),
  summary TEXT,
  observations TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Habilita RLS (acesso por empresa)
ALTER TABLE public.audit_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Só usuários da empresa podem ver planos de auditoria" ON public.audit_plans
  FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Só usuários da empresa podem inserir planos de auditoria" ON public.audit_plans
  FOR INSERT WITH CHECK (company_id = public.get_user_company_safe());

CREATE POLICY "Só usuários da empresa podem editar planos de auditoria" ON public.audit_plans
  FOR UPDATE USING (company_id = public.get_user_company_safe());

CREATE POLICY "Só usuários da empresa podem excluir planos de auditoria" ON public.audit_plans
  FOR DELETE USING (company_id = public.get_user_company_safe());

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_audit_plan_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_audit_plans
BEFORE UPDATE ON public.audit_plans
FOR EACH ROW EXECUTE FUNCTION public.set_audit_plan_updated_at();
