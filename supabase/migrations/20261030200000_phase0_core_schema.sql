-- =============================================================================
-- FASE 0 - Esquema base do Peter.IA (reconstrução após reset do Cloud)
--
-- Cria as tabelas que o frontend usa e que ainda não existem no banco:
-- empresas, perfis, módulos/permissões, RH, qualidade, reuniões, auditoria,
-- documentos e as tabelas das migrations antigas do repositório.
--
-- NÃO toca nas tabelas já criadas pelas migrations de 2026-10-30
-- (planejamento estratégico, OKR, indicadores, ações, check-ins).
-- Tudo usa IF NOT EXISTS: pode ser reaplicada sem erro.
-- Pré-requisito: 20261030000000 e 20261030100000 aplicadas.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 0. Funções utilitárias
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Nome usado pelas migrations antigas
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Aplica, numa tabela, trigger de updated_at (se houver a coluna) e
-- RLS padrão: cada empresa só enxerga e altera os próprios registros.
CREATE OR REPLACE FUNCTION public.apply_company_rls(p_table text, p_column text DEFAULT 'company_id')
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = p_table AND column_name = 'updated_at') THEN
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', p_table);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', p_table);
  END IF;
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', p_table);
  EXECUTE format('DROP POLICY IF EXISTS "%s_select_company" ON public.%I', p_table, p_table);
  EXECUTE format('DROP POLICY IF EXISTS "%s_insert_company" ON public.%I', p_table, p_table);
  EXECUTE format('DROP POLICY IF EXISTS "%s_update_company" ON public.%I', p_table, p_table);
  EXECUTE format('DROP POLICY IF EXISTS "%s_delete_company" ON public.%I', p_table, p_table);
  EXECUTE format('CREATE POLICY "%s_select_company" ON public.%I FOR SELECT TO authenticated USING (%I = public.get_user_company_safe() OR public.is_super_admin_safe())', p_table, p_table, p_column);
  EXECUTE format('CREATE POLICY "%s_insert_company" ON public.%I FOR INSERT TO authenticated WITH CHECK (%I = public.get_user_company_safe() OR public.is_super_admin_safe())', p_table, p_table, p_column);
  EXECUTE format('CREATE POLICY "%s_update_company" ON public.%I FOR UPDATE TO authenticated USING (%I = public.get_user_company_safe() OR public.is_super_admin_safe())', p_table, p_table, p_column);
  EXECUTE format('CREATE POLICY "%s_delete_company" ON public.%I FOR DELETE TO authenticated USING (%I = public.get_user_company_safe() OR public.is_super_admin_safe())', p_table, p_table, p_column);
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', p_table);
END;
$$;

-- -----------------------------------------------------------------------------
-- 1. Empresas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  slug                 text NOT NULL,
  active               boolean NOT NULL DEFAULT true,
  active_modules       text[] NOT NULL DEFAULT '{}',
  plan                 text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'professional', 'enterprise')),
  cnpj                 text,
  email                text,
  phone                text,
  address              text,
  responsible          text,
  potency              text,
  settings             jsonb NOT NULL DEFAULT '{}'::jsonb,
  company_description  text,
  operational_problems text,
  business_objectives  text,
  company_sector       text,
  company_size         text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_idx ON public.companies (slug);

-- -----------------------------------------------------------------------------
-- 2. Perfis de usuário (criados por trigger no cadastro)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                 uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email              text NOT NULL,
  first_name         text NOT NULL DEFAULT '',
  last_name          text NOT NULL DEFAULT '',
  company_id         uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  is_super_admin     boolean NOT NULL DEFAULT false,
  is_company_admin   boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  ativo              boolean NOT NULL DEFAULT true,
  role               text NOT NULL DEFAULT 'user',
  allowed_modules    text[] NOT NULL DEFAULT '{}',
  phone              text,
  lgpd_consent       boolean NOT NULL DEFAULT false,
  lgpd_consent_date  timestamptz,
  last_login         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_profiles_company_idx ON public.user_profiles (company_id);

-- Super admin (as funções anteriores só tratam empresa e admin da empresa)
CREATE OR REPLACE FUNCTION public.is_super_admin_safe()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v boolean;
BEGIN
  SELECT is_super_admin INTO v FROM public.user_profiles WHERE id = auth.uid();
  RETURN coalesce(v, false);
END;
$$;

-- Recria os helpers já existentes para garantir a mesma semântica
CREATE OR REPLACE FUNCTION public.get_user_company_safe()
RETURNS uuid LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_company uuid;
BEGIN
  SELECT company_id INTO v_company FROM public.user_profiles WHERE id = auth.uid();
  RETURN v_company;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_company_admin_safe()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v boolean;
BEGIN
  SELECT coalesce(is_super_admin, false) OR coalesce(is_company_admin, false)
    INTO v FROM public.user_profiles WHERE id = auth.uid();
  RETURN coalesce(v, false);
END;
$$;

-- Perfil criado automaticamente a partir dos metadados do signUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m jsonb := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, company_id, is_company_admin, lgpd_consent, lgpd_consent_date)
  VALUES (
    NEW.id,
    coalesce(NEW.email, ''),
    coalesce(m->>'first_name', ''),
    coalesce(m->>'last_name', ''),
    nullif(m->>'company_id', '')::uuid,
    coalesce((m->>'is_company_admin')::boolean, false),
    coalesce((m->>'lgpd_consent')::boolean, false),
    nullif(m->>'lgpd_consent_date', '')::timestamptz
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS de companies e user_profiles
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "companies_select" ON public.companies;
DROP POLICY IF EXISTS "companies_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_update" ON public.companies;
DROP POLICY IF EXISTS "companies_delete" ON public.companies;
CREATE POLICY "companies_select" ON public.companies FOR SELECT TO authenticated
  USING (id = public.get_user_company_safe() OR public.is_super_admin_safe());
-- O cadastro cria a empresa ANTES do usuário existir (useRegistration) e lê o registro de volta
-- com .select(): anon pode inserir e enxergar só empresas criadas nos últimos minutos.
CREATE POLICY "companies_insert" ON public.companies FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "companies_select_anon_recent" ON public.companies;
CREATE POLICY "companies_select_anon_recent" ON public.companies FOR SELECT TO anon
  USING (created_at > now() - interval '10 minutes');
CREATE POLICY "companies_update" ON public.companies FOR UPDATE TO authenticated
  USING ((id = public.get_user_company_safe() AND public.is_company_admin_safe()) OR public.is_super_admin_safe());
CREATE POLICY "companies_delete" ON public.companies FOR DELETE TO authenticated
  USING (public.is_super_admin_safe());
DROP TRIGGER IF EXISTS set_updated_at ON public.companies;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT SELECT, INSERT ON public.companies TO anon;
GRANT INSERT ON public.companies TO authenticated;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_profiles_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_self" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_admin" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_self" ON public.user_profiles;
CREATE POLICY "user_profiles_select" ON public.user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR company_id = public.get_user_company_safe() OR public.is_super_admin_safe());
CREATE POLICY "user_profiles_update_self" ON public.user_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
CREATE POLICY "user_profiles_update_admin" ON public.user_profiles FOR UPDATE TO authenticated
  USING ((company_id = public.get_user_company_safe() AND public.is_company_admin_safe()) OR public.is_super_admin_safe());
CREATE POLICY "user_profiles_insert_self" ON public.user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- RPC usada pelo frontend
CREATE OR REPLACE FUNCTION public.get_company_by_id(company_uuid uuid)
RETURNS TABLE (id uuid, name text, cnpj text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.name, c.cnpj FROM public.companies c WHERE c.id = company_uuid;
$$;

CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT to_regclass('public.' || quote_ident(table_name)) IS NOT NULL;
$$;

-- -----------------------------------------------------------------------------
-- 3. Módulos e permissões
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modulos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       text NOT NULL,
  chave      text NOT NULL UNIQUE,
  descricao  text,
  ativo      boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "modulos_select" ON public.modulos;
DROP POLICY IF EXISTS "modulos_manage" ON public.modulos;
CREATE POLICY "modulos_select" ON public.modulos FOR SELECT TO authenticated USING (true);
CREATE POLICY "modulos_manage" ON public.modulos FOR ALL TO authenticated USING (public.is_super_admin_safe());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modulos TO authenticated;

INSERT INTO public.modulos (chave, nome) VALUES
  ('dashboard', 'Dashboard'), ('diagnostico', 'Diagnóstico'), ('iso', 'ISO 9001:2015'),
  ('admin', 'Administração'), ('admissao', 'Admissão'), ('ambiente', 'Ambiente'),
  ('analise_critica', 'Análise Crítica'), ('atestados', 'Atestados'), ('auditoria', 'Auditoria'),
  ('avaliacao_desempenho', 'Avaliação de Desempenho'), ('avaliacao_experiencia', 'Avaliação de Experiência'),
  ('avaliacao_fornecedores', 'Avaliação de Fornecedores'), ('calibracao_equipamentos', 'Calibração de Equipamentos'),
  ('cargos_salarios', 'Cargos e Salários'), ('clima', 'Clima Organizacional'), ('colaboradores', 'Colaboradores'),
  ('contexto_organizacao', 'Contexto da Organização'), ('controle_qualidade', 'Controle de Qualidade'),
  ('controle_treinamento', 'Controle de Treinamento'), ('custos_pessoal', 'Custos de Pessoal'),
  ('departamentos', 'Departamentos'), ('desenvolvimento', 'Desenvolvimento'), ('desligamento', 'Desligamento'),
  ('disc', 'Avaliação DISC'), ('entrevista_admissao', 'Entrevista de Admissão'),
  ('entrevistas_desligamento', 'Entrevistas de Desligamento'), ('feedback', 'Feedback'), ('ferias', 'Férias'),
  ('gerenciamento_riscos', 'Gerenciamento de Riscos'), ('gestao_operacional', 'Gestão Operacional'),
  ('indicadores_desempenho', 'Indicadores de Desempenho'), ('informacao_documentada', 'Informação Documentada'),
  ('inspecao_materia_prima', 'Inspeção de Matéria-prima'), ('integracao', 'Integração'),
  ('movimentacao_pessoal', 'Movimentação de Pessoal'), ('mural', 'Mural'), ('nao_conformidades', 'Não Conformidades'),
  ('objetivos_qualidade', 'Objetivos da Qualidade'), ('ocorrencias', 'Ocorrências'), ('organizacao', 'Organização'),
  ('partes_interessadas', 'Partes Interessadas'), ('pdis', 'PDIs'), ('pesquisa_satisfacao', 'Pesquisa de Satisfação'),
  ('planejamento_estrategico', 'Planejamento Estratégico'), ('plano_acao', 'Plano de Ação'),
  ('politica_qualidade', 'Política da Qualidade'), ('posicoes', 'Posições'), ('processos', 'Processos'),
  ('produtos_nao_conformes', 'Produtos Não Conformes'), ('qualidade', 'Qualidade'),
  ('reclamacoes_clientes', 'Reclamações de Clientes'), ('recrutamento', 'Recrutamento'),
  ('recrutamento_selecao', 'Recrutamento e Seleção'), ('reunioes', 'Reuniões'), ('rh', 'Recursos Humanos'),
  ('tarefas', 'Tarefas'), ('termometro', 'Termômetro'), ('treinamentos', 'Treinamentos')
ON CONFLICT (chave) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.permissoes_usuario (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      uuid NOT NULL REFERENCES public.user_profiles (id) ON DELETE CASCADE,
  modulo_id       uuid NOT NULL REFERENCES public.modulos (id) ON DELETE CASCADE,
  pode_visualizar boolean NOT NULL DEFAULT true,
  pode_editar     boolean NOT NULL DEFAULT false,
  pode_excluir    boolean NOT NULL DEFAULT false,
  pode_criar      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, modulo_id)
);
ALTER TABLE public.permissoes_usuario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "permissoes_usuario_select" ON public.permissoes_usuario;
DROP POLICY IF EXISTS "permissoes_usuario_manage" ON public.permissoes_usuario;
CREATE POLICY "permissoes_usuario_select" ON public.permissoes_usuario FOR SELECT TO authenticated
  USING (usuario_id = auth.uid() OR public.is_company_admin_safe());
CREATE POLICY "permissoes_usuario_manage" ON public.permissoes_usuario FOR ALL TO authenticated
  USING (public.is_company_admin_safe() AND usuario_id IN (SELECT id FROM public.user_profiles WHERE company_id = public.get_user_company_safe() OR public.is_super_admin_safe()));
DROP TRIGGER IF EXISTS set_updated_at ON public.permissoes_usuario;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.permissoes_usuario FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.permissoes_usuario TO authenticated;

CREATE TABLE IF NOT EXISTS public.permissoes_empresa (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  modulo_id       uuid NOT NULL REFERENCES public.modulos (id) ON DELETE CASCADE,
  pode_visualizar boolean NOT NULL DEFAULT true,
  pode_editar     boolean NOT NULL DEFAULT false,
  pode_excluir    boolean NOT NULL DEFAULT false,
  pode_criar      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, modulo_id)
);
SELECT public.apply_company_rls('permissoes_empresa');

-- -----------------------------------------------------------------------------
-- 4. Logs de segurança
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid DEFAULT public.get_user_company_safe(),
  action          text NOT NULL,
  user_id         text NOT NULL DEFAULT coalesce(auth.uid()::text, 'anonymous'),
  target_resource text,
  details         jsonb NOT NULL DEFAULT '{}'::jsonb,
  status          text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'denied', 'error')),
  ip_address      text,
  "timestamp"     timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS security_audit_logs_ts_idx ON public.security_audit_logs (company_id, "timestamp" DESC);
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "security_audit_logs_select" ON public.security_audit_logs;
DROP POLICY IF EXISTS "security_audit_logs_insert" ON public.security_audit_logs;
CREATE POLICY "security_audit_logs_select" ON public.security_audit_logs FOR SELECT TO authenticated
  USING ((company_id = public.get_user_company_safe() AND public.is_company_admin_safe()) OR public.is_super_admin_safe());
CREATE POLICY "security_audit_logs_insert" ON public.security_audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT SELECT ON public.security_audit_logs TO authenticated;
GRANT INSERT ON public.security_audit_logs TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_security_event(
  action_text text, user_id_text text DEFAULT NULL, target_resource_text text DEFAULT NULL,
  details_json jsonb DEFAULT '{}'::jsonb, status_text text DEFAULT 'success', ip_address_text text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.security_audit_logs (action, user_id, target_resource, details, status, ip_address)
  VALUES (action_text, coalesce(user_id_text, auth.uid()::text, 'anonymous'), target_resource_text, coalesce(details_json, '{}'::jsonb), coalesce(status_text, 'success'), ip_address_text)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_security_logs_paginated(
  user_id_filter text DEFAULT NULL, action_filter text DEFAULT NULL, status_filter text DEFAULT NULL,
  from_date timestamptz DEFAULT NULL, to_date timestamptz DEFAULT NULL,
  page_number integer DEFAULT 1, page_size integer DEFAULT 50
) RETURNS TABLE (id uuid, action text, user_id text, target_resource text, details jsonb, status text, ip_address text, event_timestamp timestamptz, total_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.id, l.action, l.user_id, l.target_resource, l.details, l.status, l.ip_address, l."timestamp" AS event_timestamp,
         count(*) OVER () AS total_count
  FROM public.security_audit_logs l
  WHERE (public.is_super_admin_safe() OR (l.company_id = public.get_user_company_safe() AND public.is_company_admin_safe()))
    AND (user_id_filter IS NULL OR l.user_id = user_id_filter)
    AND (action_filter IS NULL OR l.action ILIKE '%' || action_filter || '%')
    AND (status_filter IS NULL OR l.status = status_filter)
    AND (from_date IS NULL OR l."timestamp" >= from_date)
    AND (to_date IS NULL OR l."timestamp" <= to_date)
  ORDER BY l."timestamp" DESC
  LIMIT greatest(page_size, 1) OFFSET greatest(page_number - 1, 0) * greatest(page_size, 1);
$$;

-- -----------------------------------------------------------------------------
-- 5. RH: departamentos, cargos, colaboradores
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name                    text NOT NULL,
  description             text,
  sector                  text,
  responsible_employee_id uuid,
  approved_headcount      integer NOT NULL DEFAULT 0,
  current_headcount       integer NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_positions (
  id                               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                       uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title                            text NOT NULL,
  department                       text NOT NULL DEFAULT '',
  department_id                    uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  description                      text NOT NULL DEFAULT '',
  code                             text,
  revision                         text,
  approval_date                    date,
  approver                         text,
  status                           text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'distributed')),
  is_supervisor                    boolean NOT NULL DEFAULT false,
  is_department_head               boolean NOT NULL DEFAULT false,
  immediate_supervisor_position    text,
  superior_position_id             uuid REFERENCES public.job_positions (id) ON DELETE SET NULL,
  cbo_code                         text,
  norm                             text,
  salary_min                       numeric,
  salary_max                       numeric,
  main_responsibilities            text,
  responsibilities_junior          text,
  responsibilities_mid             text,
  responsibilities_senior          text,
  education_requirements           text,
  skill_requirements               text,
  skills_junior                    text,
  skills_mid                       text,
  skills_senior                    text,
  training_requirements            text,
  training_junior                  text,
  training_mid                     text,
  training_senior                  text,
  external_training                text,
  external_training_junior         text,
  external_training_mid            text,
  external_training_senior         text,
  experience_requirements          text,
  salary_junior                    text,
  salary_mid                       text,
  salary_senior                    text,
  required_procedures              text[] NOT NULL DEFAULT '{}',
  required_resources               text[] NOT NULL DEFAULT '{}',
  required_ppe                     text[] NOT NULL DEFAULT '{}',
  requirements                     text,
  responsibilities                 text,
  created_at                       timestamptz NOT NULL DEFAULT now(),
  updated_at                       timestamptz NOT NULL DEFAULT now()
);
-- Nome de FK usado pelo embed no frontend (departments!job_positions_department_fkey)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_positions_department_fkey') THEN
    ALTER TABLE public.job_positions DROP CONSTRAINT IF EXISTS job_positions_department_id_fkey;
    ALTER TABLE public.job_positions ADD CONSTRAINT job_positions_department_fkey
      FOREIGN KEY (department_id) REFERENCES public.departments (id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.employees (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name                    text NOT NULL,
  email                   text NOT NULL DEFAULT '',
  phone                   text,
  position                text NOT NULL DEFAULT '',
  department              text NOT NULL DEFAULT '',
  sector                  text,
  hire_date               date NOT NULL DEFAULT current_date,
  status                  text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'pending_onboarding')),
  salary                  numeric,
  avatar_url              text,
  immediate_supervisor_id uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  job_position_id         uuid REFERENCES public.job_positions (id) ON DELETE SET NULL,
  department_id           uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS employees_company_idx ON public.employees (company_id, status);

-- Nome de FK usado pelo embed no frontend (departments_responsible_employee_id_fkey)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'departments_responsible_employee_id_fkey') THEN
    ALTER TABLE public.departments ADD CONSTRAINT departments_responsible_employee_id_fkey
      FOREIGN KEY (responsible_employee_id) REFERENCES public.employees (id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.hr_approved_positions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  job_position_id uuid NOT NULL REFERENCES public.job_positions (id) ON DELETE CASCADE,
  department_id   uuid NOT NULL REFERENCES public.departments (id) ON DELETE CASCADE,
  approved_count  integer NOT NULL DEFAULT 0,
  filled_count    integer NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 6. RH: treinamentos, ocorrências, férias, atestados, avaliações, PDIs, desligamento
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hr_trainings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text,
  instructor        text,
  start_date        date,
  end_date          text,
  duration          numeric,
  department        text,
  participants      jsonb NOT NULL DEFAULT '[]'::jsonb,
  status            text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'scheduled', 'in_progress', 'completed', 'canceled')),
  procedure_id      text,
  evaluation_method text,
  type              text CHECK (type IS NULL OR type IN ('required', 'compliance', 'technical', 'soft_skills')),
  provider          text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Tabela legada usada pelo TrainingDashboard (usa empresa_id)
CREATE TABLE IF NOT EXISTS public.trainings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id        uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text,
  trainer           text,
  duration          numeric,
  department        text,
  training_date     date,
  status            text NOT NULL DEFAULT 'active',
  evaluation_method text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employee_trainings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  training_id     uuid NOT NULL REFERENCES public.trainings (id) ON DELETE CASCADE,
  employee_id     uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'pending',
  completion_date date,
  score           numeric,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.occurrences (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  date        date NOT NULL DEFAULT current_date,
  type        text NOT NULL,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  reported_by text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vacation_requests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id           uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  start_date            date NOT NULL,
  end_date              date NOT NULL,
  days_requested        integer NOT NULL DEFAULT 0,
  vacation_period_start date,
  vacation_period_end   date,
  vacation_type         text NOT NULL DEFAULT 'regular' CHECK (vacation_type IN ('regular', 'proportional')),
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  justification         text,
  approved_by           uuid,
  approved_at           timestamptz,
  rejection_reason      text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medical_certificates (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id  uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  type         text NOT NULL DEFAULT 'sickness' CHECK (type IN ('sickness', 'appointment', 'surgery', 'other')),
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  days         integer GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
  doctor       text NOT NULL DEFAULT '',
  cid          text,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  description  text,
  document_url text,
  notes        text,
  created_by   uuid,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trial_evaluation_configs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  evaluation_periods  jsonb NOT NULL DEFAULT '[30, 60, 90]'::jsonb,
  evaluation_criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  scale_min           integer NOT NULL DEFAULT 1,
  scale_max           integer NOT NULL DEFAULT 5,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id)
);

CREATE TABLE IF NOT EXISTS public.trial_period_evaluations (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                 uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id                uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  evaluation_date            date NOT NULL,
  evaluation_type            text NOT NULL DEFAULT '30_dias' CHECK (evaluation_type IN ('30_dias', '45_dias', '60_dias', '90_dias')),
  evaluator_id               uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  immediate_supervisor_id    uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  immediate_supervisor_name  text,
  sector                     text,
  performance_score          numeric,
  adaptation_score           numeric,
  behavior_score             numeric,
  evaluation_criteria_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  approved                   boolean,
  comments                   text,
  hr_approved                boolean,
  hr_approved_at             timestamptz,
  hr_approver_id             uuid,
  notification_sent          boolean NOT NULL DEFAULT false,
  final_decision             text CHECK (final_decision IS NULL OR final_decision IN ('approved', 'rejected', 'extended')),
  decision_justification     text,
  employee_signature_date    date,
  supervisor_signature_date  date,
  hr_signature_date          date,
  evaluation_period_number   integer NOT NULL DEFAULT 1,
  total_evaluation_periods   integer NOT NULL DEFAULT 3,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

-- Gera as avaliações de experiência (30, 60 e 90 dias) de um colaborador
CREATE OR REPLACE FUNCTION public.generate_trial_evaluations_br(employee_id uuid, hire_date date)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_company uuid; v_periods integer[] := ARRAY[30, 60, 90]; v_n integer := 0; v_days integer;
BEGIN
  SELECT e.company_id INTO v_company FROM public.employees e WHERE e.id = generate_trial_evaluations_br.employee_id;
  IF v_company IS NULL THEN RETURN 0; END IF;
  FOREACH v_days IN ARRAY v_periods LOOP
    v_n := v_n + 1;
    INSERT INTO public.trial_period_evaluations (company_id, employee_id, evaluation_date, evaluation_type, evaluation_period_number, total_evaluation_periods)
    SELECT v_company, generate_trial_evaluations_br.employee_id, hire_date + v_days, v_days || '_dias', v_n, array_length(v_periods, 1)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.trial_period_evaluations t
      WHERE t.employee_id = generate_trial_evaluations_br.employee_id AND t.evaluation_period_number = v_n
    );
  END LOOP;
  RETURN v_n;
END;
$$;
GRANT EXECUTE ON FUNCTION public.generate_trial_evaluations_br(uuid, date) TO authenticated;

CREATE TABLE IF NOT EXISTS public.development_plans (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id       uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  title             text NOT NULL,
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date        date NOT NULL,
  end_date          date NOT NULL,
  progress          integer NOT NULL DEFAULT 0,
  career_goal       text,
  development_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  action_items      jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- text: o formulário envia '' em vez de uuid
  creator_id        text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hr_exit_interviews (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  employee_id                 uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  token                       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  employee_name               text NOT NULL,
  employee_phone              text,
  termination_date            date NOT NULL,
  termination_reason          text,
  interview_date              date,
  status                      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'expired')),
  overall_satisfaction        integer,
  work_environment_rating     integer,
  management_rating           integer,
  growth_opportunities_rating integer,
  compensation_rating         integer,
  what_liked_most             text,
  what_liked_least            text,
  suggestions_for_improvement text,
  reason_for_leaving          text,
  would_recommend_company     boolean,
  would_consider_returning    boolean,
  additional_comments         text,
  whatsapp_sent_at            timestamptz,
  whatsapp_message_id         text,
  link_expires_at             timestamptz NOT NULL DEFAULT now() + interval '30 days',
  completed_at                timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 7. RH: clima, DISC, recrutamento
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.climate_surveys (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.climate_survey_questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  survey_id     uuid NOT NULL REFERENCES public.climate_surveys (id) ON DELETE CASCADE,
  question      text NOT NULL,
  category      text NOT NULL DEFAULT '',
  question_type text NOT NULL DEFAULT 'scale' CHECK (question_type IN ('scale', 'text', 'multiple_choice', 'boolean')),
  options       jsonb,
  required      boolean NOT NULL DEFAULT true,
  order_number  integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.climate_survey_responses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  survey_id    uuid NOT NULL REFERENCES public.climate_surveys (id) ON DELETE CASCADE,
  employee_id  uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  responses    jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disc_assessments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name         text NOT NULL,
  email        text NOT NULL DEFAULT '',
  scores       jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_type text NOT NULL DEFAULT '',
  date         date NOT NULL DEFAULT current_date,
  invited_by   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disc_evaluation_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text NOT NULL,
  token       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  is_used     boolean NOT NULL DEFAULT false,
  entity_type text NOT NULL DEFAULT 'employee' CHECK (entity_type IN ('employee', 'candidate')),
  entity_id   uuid,
  created_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.candidate_assessments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  active      boolean NOT NULL DEFAULT true,
  questions   jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.candidate_assessment_links (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id             uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  assessment_id          uuid NOT NULL REFERENCES public.candidate_assessments (id) ON DELETE CASCADE,
  candidate_name         text NOT NULL,
  candidate_email        text NOT NULL,
  recruitment_process_id uuid,
  token                  text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  expires_at             timestamptz NOT NULL DEFAULT now() + interval '7 days',
  used                   boolean NOT NULL DEFAULT false,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.candidate_assessment_responses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  assessment_id   uuid NOT NULL REFERENCES public.candidate_assessments (id) ON DELETE CASCADE,
  link_id         uuid REFERENCES public.candidate_assessment_links (id) ON DELETE SET NULL,
  candidate_name  text NOT NULL,
  candidate_email text NOT NULL,
  answers         jsonb NOT NULL DEFAULT '{}'::jsonb,
  score           numeric,
  submitted_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  candidate_id        uuid NOT NULL,
  job_opening_id      uuid,
  compatibility_score numeric NOT NULL DEFAULT 0,
  recommendation      text NOT NULL DEFAULT '',
  strengths           text[] NOT NULL DEFAULT '{}',
  weaknesses          text[] NOT NULL DEFAULT '{}',
  analysis            text NOT NULL DEFAULT '',
  created_by          uuid DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 8. Qualidade e ISO 9001
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.risks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text NOT NULL DEFAULT '',
  category        text NOT NULL DEFAULT 'Operacional',
  process         text NOT NULL DEFAULT 'Geral',
  probability     integer NOT NULL DEFAULT 3 CHECK (probability BETWEEN 1 AND 5),
  impact          integer NOT NULL DEFAULT 3 CHECK (impact BETWEEN 1 AND 5),
  risk_level      integer GENERATED ALWAYS AS (probability * impact) STORED,
  mitigation_plan text,
  responsible     text NOT NULL DEFAULT 'A definir',
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'inactive')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.non_conformities (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title          text NOT NULL,
  description    text NOT NULL DEFAULT '',
  status         text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'canceled')),
  severity       text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  requirement_id text NOT NULL DEFAULT '',
  department     text NOT NULL DEFAULT '',
  responsible    text NOT NULL DEFAULT '',
  closed_at      timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_context (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  context_type  text NOT NULL CHECK (context_type IN ('internal_factor', 'external_factor', 'interested_party', 'swot')),
  swot_category text CHECK (swot_category IS NULL OR swot_category IN ('strength', 'weakness', 'opportunity', 'threat')),
  description   text NOT NULL,
  analysis      text,
  created_by    text NOT NULL DEFAULT '',
  update_date   date NOT NULL DEFAULT current_date,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.critical_analysis (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title         text NOT NULL,
  analysis_date date NOT NULL DEFAULT current_date,
  participants  text[] NOT NULL DEFAULT '{}',
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  inputs        jsonb,
  results       jsonb,
  attachments   jsonb,
  created_by    text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_objectives (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  target      numeric,
  unit        text,
  status      text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'concluido')),
  frequency   text,
  created_by  uuid DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_policy (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  policy_text          text NOT NULL,
  related_action_plans uuid[] NOT NULL DEFAULT '{}',
  related_indicators   uuid[] NOT NULL DEFAULT '{}',
  created_by           uuid DEFAULT auth.uid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_complaints (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  identification_code text,
  customer_name       text NOT NULL,
  contact_email       text,
  contact_phone       text,
  complaint_date      date NOT NULL DEFAULT current_date,
  description         text NOT NULL DEFAULT '',
  status              text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority            text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  detailed_status     text NOT NULL DEFAULT 'nova_reclamacao',
  assigned_to         text,
  -- text: o formulário envia '' nestes campos
  assigned_to_id      text,
  action_schedule_id  text,
  return_deadline     text,
  invoice_number      text,
  product             text,
  treatment_option    text,
  resolution          text,
  closed_at           timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.external_audits (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  status           text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'canceled')),
  audit_date       date NOT NULL,
  completion_date  date,
  external_auditor text NOT NULL DEFAULT '',
  auditor_company  text,
  findings         text,
  report_url       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.raw_material_inspections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  material_name     text NOT NULL,
  supplier          text NOT NULL DEFAULT '',
  batch_number      text NOT NULL DEFAULT '',
  inspection_date   date NOT NULL DEFAULT current_date,
  inspector         text NOT NULL DEFAULT '',
  inspection_result text NOT NULL DEFAULT 'approved' CHECK (inspection_result IN ('approved', 'rejected', 'conditional')),
  quantity          numeric NOT NULL DEFAULT 0,
  unit              text NOT NULL DEFAULT '',
  parameters        jsonb,
  observations      text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title                text NOT NULL,
  description          text,
  module               text DEFAULT 'general',
  status               text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  employee_id          uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  requester_id         uuid,
  personnel_request_id uuid,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- Tabelas das migrations antigas do repositório
CREATE TABLE IF NOT EXISTS public.supplier_evaluations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  supplier_name   text NOT NULL,
  evaluation_date date NOT NULL,
  evaluator       text NOT NULL DEFAULT '',
  category        text NOT NULL DEFAULT '',
  quality_score   integer CHECK (quality_score BETWEEN 1 AND 10),
  delivery_score  integer CHECK (delivery_score BETWEEN 1 AND 10),
  price_score     integer CHECK (price_score BETWEEN 1 AND 10),
  support_score   integer CHECK (support_score BETWEEN 1 AND 10),
  total_score     numeric GENERATED ALWAYS AS ((quality_score + delivery_score + price_score + support_score) / 4.0) STORED,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  comments        text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.non_conforming_products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  product_name        text NOT NULL,
  description         text NOT NULL DEFAULT '',
  status              text NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'in_progress', 'resolved', 'approved', 'rejected')),
  severity            text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  requirement_id      text NOT NULL DEFAULT '',
  department          text NOT NULL DEFAULT '',
  customer            text,
  non_conformity_type text NOT NULL DEFAULT '',
  immediate_action    text NOT NULL DEFAULT '',
  approval_status     text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_satisfaction_surveys (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title                 text NOT NULL,
  customer_name         text NOT NULL,
  survey_date           date NOT NULL DEFAULT current_date,
  overall_satisfaction  integer CHECK (overall_satisfaction BETWEEN 1 AND 10),
  product_quality       integer CHECK (product_quality BETWEEN 1 AND 10),
  service_quality       integer CHECK (service_quality BETWEEN 1 AND 10),
  delivery_satisfaction integer CHECK (delivery_satisfaction BETWEEN 1 AND 10),
  suggestions           text,
  status                text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'completed')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment_calibrations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  equipment_name        text NOT NULL,
  equipment_id          text NOT NULL DEFAULT '',
  calibration_date      date NOT NULL,
  next_calibration_date date NOT NULL,
  responsible           text NOT NULL DEFAULT '',
  status                text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expired', 'scheduled')),
  certificate_number    text,
  calibration_entity    text NOT NULL DEFAULT '',
  observations          text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_criteria (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text NOT NULL DEFAULT '',
  expected_value   text NOT NULL DEFAULT '',
  tolerance        text,
  measurement_unit text,
  category         text NOT NULL DEFAULT '',
  company_segment  text NOT NULL DEFAULT '',
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_inspections (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  inspection_date  timestamptz NOT NULL DEFAULT now(),
  product_name     text NOT NULL,
  batch_number     text NOT NULL DEFAULT '',
  inspector        text NOT NULL DEFAULT '',
  status           text NOT NULL DEFAULT 'approved',
  inspection_type  text NOT NULL DEFAULT 'final',
  process_name     text,
  criteria_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  observations     text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title          text NOT NULL,
  responsible    text NOT NULL DEFAULT '',
  responsible_id uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  start_date     date NOT NULL,
  end_date       date NOT NULL,
  audited_areas  text NOT NULL DEFAULT '',
  team           text,
  status         text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'planejada', 'em_andamento', 'finalizada')),
  summary        text,
  observations   text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stakeholders (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  name                 text NOT NULL,
  type                 text NOT NULL DEFAULT 'externo' CHECK (type IN ('interno', 'externo')),
  category             text NOT NULL DEFAULT '',
  influence_level      text NOT NULL DEFAULT 'médio' CHECK (influence_level IN ('baixo', 'médio', 'alto', 'crítico')),
  interest_level       text NOT NULL DEFAULT 'médio' CHECK (interest_level IN ('baixo', 'médio', 'alto')),
  expectations         text,
  communication_method text,
  contact_info         text,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  title                 text NOT NULL,
  description           text,
  category              text,
  document_type         text,
  document_code         text,
  version               text,
  revision              text,
  file_url              text,
  file_name             text,
  file_size             bigint,
  mime_type             text,
  status                text NOT NULL DEFAULT 'rascunho',
  tags                  text[],
  standard_items        text[],
  process               text,
  internal_external     text NOT NULL DEFAULT 'interno',
  distribution_location text,
  storage_location      text,
  protection            text,
  recovery_method       text,
  retention_time        text,
  archiving_time        text,
  disposal_method       text,
  created_by            uuid DEFAULT auth.uid(),
  approved_by           uuid,
  approval_date         timestamptz,
  review_date           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 9. Reuniões
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reunioes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  titulo     text NOT NULL,
  data       timestamptz NOT NULL DEFAULT now(),
  local      text,
  descricao  text,
  criado_por uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reunioes_participantes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  reuniao_id  uuid NOT NULL REFERENCES public.reunioes (id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees (id) ON DELETE CASCADE,
  presente    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reunioes_registros (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  reuniao_id      uuid NOT NULL REFERENCES public.reunioes (id) ON DELETE CASCADE,
  employee_id     uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  o_que_fiz       text,
  o_que_vou_fazer text,
  dificuldades    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reunioes_acoes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid NOT NULL DEFAULT public.get_user_company_safe() REFERENCES public.companies (id) ON DELETE CASCADE,
  reuniao_id     uuid NOT NULL REFERENCES public.reunioes (id) ON DELETE CASCADE,
  titulo         text NOT NULL,
  descricao      text,
  responsavel_id uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  prazo          timestamptz,
  status         text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 10. Assistentes de módulo (migration antiga)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.module_assistants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL UNIQUE,
  label        text NOT NULL,
  description  text,
  enabled      boolean NOT NULL DEFAULT true,
  capabilities text,
  limitations  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz
);
ALTER TABLE public.module_assistants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "module_assistants_select" ON public.module_assistants;
DROP POLICY IF EXISTS "module_assistants_manage" ON public.module_assistants;
CREATE POLICY "module_assistants_select" ON public.module_assistants FOR SELECT TO authenticated USING (true);
CREATE POLICY "module_assistants_manage" ON public.module_assistants FOR ALL TO authenticated USING (public.is_super_admin_safe());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_assistants TO authenticated;
INSERT INTO public.module_assistants (name, label, description, enabled, capabilities, limitations) VALUES
  ('dashboard', 'Dashboard Principal', 'Assistente especializado no painel principal do sistema', true, 'Explicar métricas, indicadores do dashboard, navegação básica, visão geral do sistema', 'Não posso modificar dados ou configurações do sistema'),
  ('qualidade', 'Gestão da Qualidade', 'Assistente para módulos de qualidade e ISO 9001', true, 'Orientar sobre processos de qualidade, ISO 9001, não conformidades, auditorias, controle de qualidade', 'Não posso criar ou modificar registros de qualidade'),
  ('processos', 'Gestão de Processos', 'Assistente para mapeamento e análise de processos', true, 'Ajudar com mapeamento de processos, análise de fluxos, otimização de processos, BPMN', 'Não posso alterar processos mapeados'),
  ('rh', 'Recursos Humanos', 'Assistente para gestão de pessoas e RH', true, 'Orientar sobre gestão de funcionários, recrutamento, treinamentos, avaliações', 'Não posso acessar dados pessoais sensíveis dos funcionários'),
  ('reunioes', 'Gestão de Reuniões', 'Assistente para organização e acompanhamento de reuniões', true, 'Ajudar com agendamento de reuniões, criação de atas, acompanhamento de ações', 'Não posso agendar reuniões automaticamente'),
  ('plano_acao', 'Planos de Ação', 'Assistente para criação e acompanhamento de planos de ação', true, 'Ajudar a estruturar ações 5W2H, priorizar e acompanhar prazos', 'Não posso alterar ações existentes'),
  ('indicadores_desempenho', 'Indicadores de Desempenho', 'Assistente para KPIs e medições', true, 'Explicar indicadores, metas e tendências', 'Não posso registrar medições'),
  ('planejamento_estrategico', 'Planejamento Estratégico', 'Assistente para estratégia, OKR e BSC', true, 'Ajudar a definir identidade, SWOT, objetivos e resultados-chave', 'Não posso gravar o planejamento'),
  ('auditoria', 'Auditoria', 'Assistente para auditorias internas e externas', true, 'Orientar sobre planejamento e condução de auditorias ISO 9001', 'Não posso emitir relatórios oficiais'),
  ('nao_conformidades', 'Não Conformidades', 'Assistente para tratamento de não conformidades', true, 'Ajudar na análise de causa raiz e ações corretivas', 'Não posso fechar não conformidades'),
  ('admin', 'Administração', 'Assistente para configuração do sistema', true, 'Explicar permissões, módulos e configurações', 'Não posso alterar permissões')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.assistant_conversations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL DEFAULT auth.uid(),
  module_name    text,
  messages       jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "assistant_conversations_own" ON public.assistant_conversations;
CREATE POLICY "assistant_conversations_own" ON public.assistant_conversations FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistant_conversations TO authenticated;

-- -----------------------------------------------------------------------------
-- 11. RLS e triggers em todas as tabelas por empresa
-- -----------------------------------------------------------------------------
SELECT public.apply_company_rls(t) FROM unnest(ARRAY[
  'departments', 'job_positions', 'employees', 'hr_approved_positions',
  'hr_trainings', 'employee_trainings', 'occurrences', 'vacation_requests', 'medical_certificates',
  'trial_evaluation_configs', 'trial_period_evaluations', 'development_plans', 'hr_exit_interviews',
  'climate_surveys', 'climate_survey_questions', 'climate_survey_responses',
  'disc_assessments', 'disc_evaluation_links', 'candidate_assessments', 'candidate_assessment_links',
  'candidate_assessment_responses', 'resume_analyses',
  'risks', 'non_conformities', 'organization_context', 'critical_analysis', 'quality_objectives',
  'quality_policy', 'customer_complaints', 'external_audits', 'raw_material_inspections', 'tasks',
  'supplier_evaluations', 'non_conforming_products', 'customer_satisfaction_surveys', 'equipment_calibrations',
  'quality_criteria', 'quality_inspections', 'audit_plans', 'stakeholders', 'documents',
  'reunioes', 'reunioes_participantes', 'reunioes_registros', 'reunioes_acoes'
]) AS t;
SELECT public.apply_company_rls('trainings', 'empresa_id');

-- Links públicos (entrevista de desligamento e DISC): acesso só por função com token,
-- definido em 20261102000000_security_hardening.sql. Nada de leitura direta pelo anon.

-- Bucket de documentos usado pelos relatórios de auditoria
DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    EXECUTE $q$INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING$q$;
  END IF;
END $$;

-- =============================================================================
-- DEPOIS DE APLICAR: cadastre-se pelo app e torne o seu usuário super admin:
--   UPDATE public.user_profiles SET is_super_admin = true WHERE email = 'seu@email.com';
-- =============================================================================
