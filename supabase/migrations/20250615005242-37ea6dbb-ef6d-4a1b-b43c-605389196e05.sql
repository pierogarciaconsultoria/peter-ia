
-- Tabela para critérios de qualidade
CREATE TABLE public.quality_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  expected_value TEXT NOT NULL,
  tolerance TEXT,
  measurement_unit TEXT,
  category TEXT NOT NULL,
  company_segment TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Tabela para inspeções de qualidade
CREATE TABLE public.quality_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  inspection_date TIMESTAMPTZ NOT NULL,
  product_name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  inspector TEXT NOT NULL,
  status TEXT NOT NULL, -- Enum: 'approved', 'rejected', 'with_observations'
  inspection_type TEXT NOT NULL, -- Enum: 'process', 'final'
  process_name TEXT,
  criteria_results JSONB NOT NULL, -- Lista de critérios e resultados
  observations TEXT
);

-- Política RLS para permitir acesso somente a usuários logados (ajuste conforme necessário)
ALTER TABLE public.quality_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura aos usuários" ON public.quality_criteria
  FOR SELECT USING (true);
CREATE POLICY "Permitir escrita aos usuários" ON public.quality_criteria
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização aos usuários" ON public.quality_criteria
  FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão aos usuários" ON public.quality_criteria
  FOR DELETE USING (true);

ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura aos usuários" ON public.quality_inspections
  FOR SELECT USING (true);
CREATE POLICY "Permitir escrita aos usuários" ON public.quality_inspections
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização aos usuários" ON public.quality_inspections
  FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão aos usuários" ON public.quality_inspections
  FOR DELETE USING (true);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.update_quality_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_quality_criteria
BEFORE UPDATE ON public.quality_criteria
FOR EACH ROW EXECUTE FUNCTION public.update_quality_updated_at();

CREATE TRIGGER set_updated_at_quality_inspections
BEFORE UPDATE ON public.quality_inspections
FOR EACH ROW EXECUTE FUNCTION public.update_quality_updated_at();
