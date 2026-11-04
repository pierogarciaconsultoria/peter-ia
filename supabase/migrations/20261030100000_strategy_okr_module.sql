-- =============================================================================
-- Estratégia e Metas (OKR + KPI) - evolução do Planejamento Estratégico
--
-- Reaproveita: strategic_identities, bsc_objectives (objetivos), bsc_measures
-- (resultados-chave), performance_indicators (KPIs), indicator_measurements,
-- quality_actions (iniciativas).
-- Cria: strategy_pillars, cycles, check_ins.
--
-- performance_indicators, indicator_measurements e quality_actions são criadas
-- aqui SOMENTE se ainda não existirem (o Cloud foi resetado), com as colunas
-- que o frontend já usa. Se já existirem, apenas recebem as colunas novas.
-- Pré-requisito: 20261030000000_strategic_planning_tables.sql aplicada.
-- =============================================================================

-- Helper: usuário é admin da empresa ou super admin
CREATE OR REPLACE FUNCTION public.is_company_admin_safe()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v boolean;
BEGIN
  SELECT coalesce(is_super_admin, false) OR coalesce(is_company_admin, false)
    INTO v FROM public.user_profiles WHERE id = auth.uid();
  RETURN coalesce(v, false);
END;
$$;

-- -----------------------------------------------------------------------------
-- 1. Estratégia: objetivo final e horizonte na identidade estratégica
-- -----------------------------------------------------------------------------
ALTER TABLE public.strategic_identities
  ADD COLUMN IF NOT EXISTS ultimate_goal text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS horizon_date date;

-- -----------------------------------------------------------------------------
-- 2. Pilares estratégicos (até 5 por empresa)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strategy_pillars (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe(),
  name         text NOT NULL,
  description  text NOT NULL DEFAULT '',
  position     integer NOT NULL DEFAULT 0,
  -- Perspectiva BSC equivalente (opcional, mantém a linguagem ISO/BSC)
  bsc_perspective text CHECK (bsc_perspective IN ('financial', 'customer', 'internal_process', 'learning_growth')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS strategy_pillars_company_idx ON public.strategy_pillars (company_id, position);

CREATE OR REPLACE FUNCTION public.enforce_max_pillars()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM public.strategy_pillars WHERE company_id = NEW.company_id) >= 5 THEN
    RAISE EXCEPTION 'Limite de 5 pilares estratégicos por empresa atingido' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS enforce_max_pillars ON public.strategy_pillars;
CREATE TRIGGER enforce_max_pillars BEFORE INSERT ON public.strategy_pillars
  FOR EACH ROW EXECUTE FUNCTION public.enforce_max_pillars();

-- -----------------------------------------------------------------------------
-- 3. Ciclos (anual e trimestral)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cycles (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id             uuid NOT NULL DEFAULT public.get_user_company_safe(),
  name                   text NOT NULL,
  type                   text NOT NULL CHECK (type IN ('annual', 'quarterly')),
  start_date             date NOT NULL,
  end_date               date NOT NULL CHECK (end_date >= start_date),
  status                 text NOT NULL DEFAULT 'active' CHECK (status IN ('planned', 'active', 'closed')),
  check_in_frequency_days integer NOT NULL DEFAULT 7 CHECK (check_in_frequency_days BETWEEN 1 AND 90),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cycles_company_idx ON public.cycles (company_id, start_date DESC);

-- Garante um ciclo anual para a empresa informada e devolve o id
CREATE OR REPLACE FUNCTION public.ensure_default_cycle(p_company uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid; v_year int := extract(year FROM current_date)::int;
BEGIN
  SELECT id INTO v_id FROM public.cycles
   WHERE company_id = p_company AND type = 'annual' AND status <> 'closed'
     AND current_date BETWEEN start_date AND end_date
   ORDER BY start_date DESC LIMIT 1;
  IF v_id IS NULL THEN
    INSERT INTO public.cycles (company_id, name, type, start_date, end_date, status)
    VALUES (p_company, 'Ano ' || v_year, 'annual', make_date(v_year, 1, 1), make_date(v_year, 12, 31), 'active')
    RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END;
$$;

-- Ciclo anual padrão para cada empresa já cadastrada (se a tabela companies existir)
DO $$
DECLARE c record;
BEGIN
  IF to_regclass('public.companies') IS NOT NULL THEN
    FOR c IN EXECUTE 'SELECT id FROM public.companies' LOOP
      PERFORM public.ensure_default_cycle(c.id);
    END LOOP;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Objetivos (OKR) sobre bsc_objectives
-- -----------------------------------------------------------------------------
ALTER TABLE public.bsc_objectives
  ALTER COLUMN perspective DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS cycle_id            uuid REFERENCES public.cycles (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pillar_id           uuid REFERENCES public.strategy_pillars (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS owner_id            uuid,
  ADD COLUMN IF NOT EXISTS parent_objective_id uuid REFERENCES public.bsc_objectives (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  ADD COLUMN IF NOT EXISTS score               numeric CHECK (score IS NULL OR (score BETWEEN 0 AND 1)),
  ADD COLUMN IF NOT EXISTS learnings           text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS bsc_objectives_cycle_idx ON public.bsc_objectives (company_id, cycle_id);

-- Objetivos já existentes entram no ciclo anual padrão da sua empresa
DO $$
DECLARE o record;
BEGIN
  FOR o IN SELECT DISTINCT company_id FROM public.bsc_objectives WHERE cycle_id IS NULL LOOP
    UPDATE public.bsc_objectives
       SET cycle_id = public.ensure_default_cycle(o.company_id)
     WHERE company_id = o.company_id AND cycle_id IS NULL;
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Resultados-chave sobre bsc_measures: valor inicial, dono e progresso
-- -----------------------------------------------------------------------------
ALTER TABLE public.bsc_measures
  ADD COLUMN IF NOT EXISTS start_value numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS owner_id    uuid;

-- progresso = (atual - inicial) / (meta - inicial), limitado a [0, 1]
ALTER TABLE public.bsc_measures DROP COLUMN IF EXISTS progress;
ALTER TABLE public.bsc_measures
  ADD COLUMN progress numeric GENERATED ALWAYS AS (
    CASE
      WHEN target = start_value THEN NULL
      ELSE LEAST(1, GREATEST(0, (coalesce(current_value, start_value) - start_value) / (target - start_value)))
    END
  ) STORED;

CREATE OR REPLACE FUNCTION public.enforce_max_key_results()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM public.bsc_measures WHERE objective_id = NEW.objective_id) >= 5 THEN
    RAISE EXCEPTION 'Um objetivo pode ter no máximo 5 resultados-chave' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS enforce_max_key_results ON public.bsc_measures;
CREATE TRIGGER enforce_max_key_results BEFORE INSERT ON public.bsc_measures
  FOR EACH ROW EXECUTE FUNCTION public.enforce_max_key_results();

-- -----------------------------------------------------------------------------
-- 6. KPIs: performance_indicators / indicator_measurements
-- -----------------------------------------------------------------------------
DO $$
DECLARE created_pi boolean := false; created_im boolean := false;
BEGIN
  IF to_regclass('public.performance_indicators') IS NULL THEN
    CREATE TABLE public.performance_indicators (
      id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id       uuid NOT NULL DEFAULT public.get_user_company_safe(),
      name             text NOT NULL,
      description      text,
      process          text NOT NULL DEFAULT 'Geral',
      goal_type        text NOT NULL DEFAULT 'higher_better' CHECK (goal_type IN ('higher_better', 'lower_better', 'target')),
      goal_value       numeric NOT NULL DEFAULT 0,
      calculation_type text NOT NULL DEFAULT 'average' CHECK (calculation_type IN ('sum', 'average')),
      unit             text,
      created_at       timestamptz NOT NULL DEFAULT now(),
      updated_at       timestamptz NOT NULL DEFAULT now()
    );
    created_pi := true;
  END IF;

  IF to_regclass('public.indicator_measurements') IS NULL THEN
    CREATE TABLE public.indicator_measurements (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id   uuid NOT NULL DEFAULT public.get_user_company_safe(),
      indicator_id uuid NOT NULL REFERENCES public.performance_indicators (id) ON DELETE CASCADE,
      month        smallint NOT NULL CHECK (month BETWEEN 1 AND 12),
      year         smallint NOT NULL CHECK (year BETWEEN 2000 AND 2100),
      value        numeric NOT NULL,
      notes        text,
      created_at   timestamptz NOT NULL DEFAULT now(),
      updated_at   timestamptz NOT NULL DEFAULT now(),
      UNIQUE (indicator_id, year, month)
    );
    created_im := true;
  END IF;

  IF created_pi THEN
    ALTER TABLE public.performance_indicators ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "performance_indicators_select_company" ON public.performance_indicators FOR SELECT TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "performance_indicators_insert_company" ON public.performance_indicators FOR INSERT TO authenticated WITH CHECK (company_id = public.get_user_company_safe());
    CREATE POLICY "performance_indicators_update_company" ON public.performance_indicators FOR UPDATE TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "performance_indicators_delete_company" ON public.performance_indicators FOR DELETE TO authenticated USING (company_id = public.get_user_company_safe());
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.performance_indicators TO authenticated;
  END IF;
  IF created_im THEN
    ALTER TABLE public.indicator_measurements ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "indicator_measurements_select_company" ON public.indicator_measurements FOR SELECT TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "indicator_measurements_insert_company" ON public.indicator_measurements FOR INSERT TO authenticated WITH CHECK (company_id = public.get_user_company_safe());
    CREATE POLICY "indicator_measurements_update_company" ON public.indicator_measurements FOR UPDATE TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "indicator_measurements_delete_company" ON public.indicator_measurements FOR DELETE TO authenticated USING (company_id = public.get_user_company_safe());
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.indicator_measurements TO authenticated;
  END IF;
END $$;

ALTER TABLE public.performance_indicators ADD COLUMN IF NOT EXISTS owner_id uuid;
ALTER TABLE public.indicator_measurements ADD COLUMN IF NOT EXISTS target numeric;

-- FK de bsc_measures.indicator_id (a migration anterior só cria se a tabela existia)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bsc_measures_indicator_fk') THEN
    ALTER TABLE public.bsc_measures
      ADD CONSTRAINT bsc_measures_indicator_fk
      FOREIGN KEY (indicator_id) REFERENCES public.performance_indicators (id) ON DELETE SET NULL;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 7. Iniciativas: quality_actions ligadas a resultado-chave
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.quality_actions') IS NULL THEN
    CREATE TABLE public.quality_actions (
      id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id      uuid NOT NULL DEFAULT public.get_user_company_safe(),
      title           text NOT NULL,
      what            text NOT NULL DEFAULT '',
      why             text NOT NULL DEFAULT '',
      "where"         text NOT NULL DEFAULT '',
      how             text NOT NULL DEFAULT '',
      responsible     text NOT NULL DEFAULT '',
      responsible_id  uuid,
      involved_people text,
      how_much        numeric NOT NULL DEFAULT 0,
      currency        text DEFAULT 'BRL',
      due_date        date NOT NULL,
      start_date      date,
      completed_at    timestamptz,
      status          text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'delayed', 'cancelled')),
      priority        text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
      process_area    text NOT NULL DEFAULT 'management',
      source          text NOT NULL DEFAULT 'planning',
      comments        text,
      created_at      timestamptz NOT NULL DEFAULT now(),
      updated_at      timestamptz NOT NULL DEFAULT now()
    );
    ALTER TABLE public.quality_actions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "quality_actions_select_company" ON public.quality_actions FOR SELECT TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "quality_actions_insert_company" ON public.quality_actions FOR INSERT TO authenticated WITH CHECK (company_id = public.get_user_company_safe());
    CREATE POLICY "quality_actions_update_company" ON public.quality_actions FOR UPDATE TO authenticated USING (company_id = public.get_user_company_safe());
    CREATE POLICY "quality_actions_delete_company" ON public.quality_actions FOR DELETE TO authenticated USING (company_id = public.get_user_company_safe());
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.quality_actions TO authenticated;
  END IF;
END $$;

ALTER TABLE public.quality_actions
  ADD COLUMN IF NOT EXISTS key_result_id uuid REFERENCES public.bsc_measures (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS quality_actions_key_result_idx ON public.quality_actions (key_result_id);

-- -----------------------------------------------------------------------------
-- 8. Check-ins (resultado-chave ou KPI)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.check_ins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe(),
  entity_type text NOT NULL CHECK (entity_type IN ('kr', 'kpi')),
  entity_id   uuid NOT NULL,
  value       numeric NOT NULL,
  confidence  text NOT NULL CHECK (confidence IN ('on_track', 'at_risk', 'off_track')),
  comment     text NOT NULL DEFAULT '',
  created_by  uuid DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS check_ins_entity_idx ON public.check_ins (company_id, entity_type, entity_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- Triggers de updated_at e RLS das tabelas novas
-- -----------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['strategy_pillars','cycles'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;

  -- Leitura por empresa; escrita conforme o papel
  FOREACH t IN ARRAY ARRAY['strategy_pillars','cycles','check_ins'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update_company" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_company" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_select_company" ON public.%I FOR SELECT TO authenticated USING (company_id = public.get_user_company_safe())', t, t);
  END LOOP;
END $$;

-- Pilares e ciclos: só admin da empresa edita
CREATE POLICY "strategy_pillars_insert_company" ON public.strategy_pillars FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());
CREATE POLICY "strategy_pillars_update_company" ON public.strategy_pillars FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());
CREATE POLICY "strategy_pillars_delete_company" ON public.strategy_pillars FOR DELETE TO authenticated
  USING (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());

CREATE POLICY "cycles_insert_company" ON public.cycles FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());
CREATE POLICY "cycles_update_company" ON public.cycles FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());
CREATE POLICY "cycles_delete_company" ON public.cycles FOR DELETE TO authenticated
  USING (company_id = public.get_user_company_safe() AND public.is_company_admin_safe());

-- Check-ins: qualquer usuário da empresa registra; histórico é imutável (sem update/delete)
CREATE POLICY "check_ins_insert_company" ON public.check_ins FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_safe());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.strategy_pillars, public.cycles TO authenticated;
GRANT SELECT, INSERT ON public.check_ins TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_default_cycle(uuid) TO authenticated;
