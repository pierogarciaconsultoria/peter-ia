-- =============================================================================
-- Planejamento Estratégico - Fase 1
-- Tabelas reais para Identidade, SWOT, BSC (ligado a indicadores), Canvas
-- e histórico da Análise Inteligente. Todas com isolamento por empresa (RLS).
--
-- Pré-requisito: tabela public.user_profiles (id = auth.uid(), company_id).
-- =============================================================================

-- Helper de empresa do usuário (cria apenas se ainda não existir no projeto)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_user_company_safe'
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.get_user_company_safe()
      RETURNS uuid
      LANGUAGE plpgsql STABLE SECURITY DEFINER
      SET search_path = public
      AS $body$
      DECLARE v_company uuid;
      BEGIN
        SELECT company_id INTO v_company FROM public.user_profiles WHERE id = auth.uid();
        RETURN v_company;
      END;
      $body$;
    $fn$;
  END IF;
END $$;

-- Trigger genérico de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- Identidade estratégica (uma por empresa)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strategic_identities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe(),
  mission     text NOT NULL DEFAULT '',
  vision      text NOT NULL DEFAULT '',
  "values"    text[] NOT NULL DEFAULT '{}',
  source      text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai', 'questionnaire')),
  created_by  uuid DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id)
);

-- -----------------------------------------------------------------------------
-- Itens SWOT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.swot_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe(),
  category     text NOT NULL CHECK (category IN ('strength', 'weakness', 'opportunity', 'threat')),
  description  text NOT NULL,
  impact_level smallint NOT NULL DEFAULT 3 CHECK (impact_level BETWEEN 1 AND 5),
  source       text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  created_by   uuid DEFAULT auth.uid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS swot_items_company_idx ON public.swot_items (company_id, category);

-- -----------------------------------------------------------------------------
-- BSC: objetivos por perspectiva e medidas ligadas a indicadores reais
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bsc_objectives (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe(),
  perspective  text NOT NULL CHECK (perspective IN ('financial', 'customer', 'internal_process', 'learning_growth')),
  title        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  sort_order   integer NOT NULL DEFAULT 0,
  source       text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  created_by   uuid DEFAULT auth.uid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bsc_objectives_company_idx ON public.bsc_objectives (company_id, perspective);

CREATE TABLE IF NOT EXISTS public.bsc_measures (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL DEFAULT public.get_user_company_safe(),
  objective_id  uuid NOT NULL REFERENCES public.bsc_objectives (id) ON DELETE CASCADE,
  name          text NOT NULL,
  target        numeric NOT NULL DEFAULT 0,
  unit          text NOT NULL DEFAULT '',
  -- Valor manual, usado apenas quando a medida não está ligada a um indicador
  current_value numeric,
  -- Ligação com performance_indicators: o valor atual passa a vir das medições
  indicator_id  uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bsc_measures_objective_idx ON public.bsc_measures (objective_id);

-- FK para performance_indicators só se a tabela existir neste banco
DO $$
BEGIN
  IF to_regclass('public.performance_indicators') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bsc_measures_indicator_fk') THEN
    ALTER TABLE public.bsc_measures
      ADD CONSTRAINT bsc_measures_indicator_fk
      FOREIGN KEY (indicator_id) REFERENCES public.performance_indicators (id) ON DELETE SET NULL;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Business Model Canvas (um por empresa)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_model_canvas (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id             uuid NOT NULL DEFAULT public.get_user_company_safe(),
  key_partners           text NOT NULL DEFAULT '',
  key_activities         text NOT NULL DEFAULT '',
  key_resources          text NOT NULL DEFAULT '',
  value_propositions     text NOT NULL DEFAULT '',
  customer_relationships text NOT NULL DEFAULT '',
  channels               text NOT NULL DEFAULT '',
  customer_segments      text NOT NULL DEFAULT '',
  cost_structure         text NOT NULL DEFAULT '',
  revenue_streams        text NOT NULL DEFAULT '',
  source                 text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id)
);

-- -----------------------------------------------------------------------------
-- Histórico da Análise Inteligente (gravado pela edge function)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_analysis (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid NOT NULL,
  analysis_type  text NOT NULL DEFAULT 'complete',
  input_data     jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_suggestions jsonb NOT NULL DEFAULT '{}'::jsonb,
  status         text NOT NULL DEFAULT 'generated',
  created_by     uuid DEFAULT auth.uid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS company_analysis_company_idx ON public.company_analysis (company_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- Triggers de updated_at
-- -----------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['strategic_identities','swot_items','bsc_objectives','bsc_measures','business_model_canvas','company_analysis'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- RLS: cada empresa só enxerga e altera os próprios registros
-- -----------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['strategic_identities','swot_items','bsc_objectives','bsc_measures','business_model_canvas','company_analysis'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_company" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_select_company" ON public.%I FOR SELECT TO authenticated USING (company_id = public.get_user_company_safe())', t, t);
    EXECUTE format('CREATE POLICY "%s_insert_company" ON public.%I FOR INSERT TO authenticated WITH CHECK (company_id = public.get_user_company_safe())', t, t);
    EXECUTE format('CREATE POLICY "%s_update_company" ON public.%I FOR UPDATE TO authenticated USING (company_id = public.get_user_company_safe()) WITH CHECK (company_id = public.get_user_company_safe())', t, t);
    EXECUTE format('CREATE POLICY "%s_delete_company" ON public.%I FOR DELETE TO authenticated USING (company_id = public.get_user_company_safe())', t, t);
  END LOOP;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.strategic_identities, public.swot_items, public.bsc_objectives,
  public.bsc_measures, public.business_model_canvas, public.company_analysis
TO authenticated;
