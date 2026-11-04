-- =============================================================================
-- Onboarding guiado e processos reais
-- - Tabela processes (o módulo de processos era simulado em memória)
-- - process_id em indicadores e riscos (início da espinha dorsal)
-- - companies.onboarding_completed_at e company_subsector
-- Idempotente. Pré-requisito: 20261030200000_phase0_core_schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.processes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name         text NOT NULL,
  description  text NOT NULL DEFAULT '',
  objective    text NOT NULL DEFAULT '',
  process_type text NOT NULL DEFAULT 'Negócio' CHECK (process_type IN ('Gestão', 'Negócio', 'Apoio')),
  owner_id     uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  status       text NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Em revisão', 'Obsoleto')),
  version      text NOT NULL DEFAULT '1.0',
  sort_order   integer NOT NULL DEFAULT 0,
  source       text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'template', 'ai')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
-- Um processo por nome em cada empresa (ignora maiúsculas e espaços nas pontas)
CREATE UNIQUE INDEX IF NOT EXISTS processes_company_name_idx ON public.processes (company_id, lower(btrim(name)));
SELECT public.apply_company_rls('processes');

ALTER TABLE public.performance_indicators
  ADD COLUMN IF NOT EXISTS process_id uuid REFERENCES public.processes (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS performance_indicators_process_idx ON public.performance_indicators (process_id);

ALTER TABLE public.risks
  ADD COLUMN IF NOT EXISTS process_id uuid REFERENCES public.processes (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS risks_process_idx ON public.risks (process_id);

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS company_subsector text;

-- Empresas que já têm identidade estratégica contam como onboarding feito
UPDATE public.companies c
   SET onboarding_completed_at = now()
 WHERE onboarding_completed_at IS NULL
   AND EXISTS (SELECT 1 FROM public.strategic_identities s WHERE s.company_id = c.id AND s.mission <> '');
