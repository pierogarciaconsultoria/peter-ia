-- =============================================================================
-- Endurecimento de segurança
-- 1. Ninguém altera os próprios privilégios (super admin, empresa, papel).
-- 2. Links públicos (entrevista de desligamento e DISC) só funcionam por
--    função com token: o anon não lê nem escreve nas tabelas.
-- Pré-requisito: 20261030200000_phase0_core_schema.sql aplicada. Idempotente.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Proteção de privilégios em user_profiles
-- -----------------------------------------------------------------------------
-- SECURITY INVOKER de propósito: com DEFINER o current_user viraria o dono (postgres)
-- e o bypass abaixo valeria para todo mundo.
CREATE OR REPLACE FUNCTION public.protect_user_profile_privileges()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
BEGIN
  -- Processos internos (trigger de cadastro, service role, SQL editor) passam direto
  IF current_user NOT IN ('authenticated', 'anon')
     AND v_jwt_role NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;
  IF coalesce(current_setting('peter.profile_bootstrap', true), '') = '1' THEN
    RETURN NEW;
  END IF;

  IF public.is_super_admin_safe() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Usuário comum criando o próprio perfil: nunca com privilégios
    NEW.is_super_admin := false;
    NEW.is_company_admin := false;
    NEW.role := 'user';
    NEW.allowed_modules := '{}';
    RETURN NEW;
  END IF;

  IF NEW.is_super_admin IS DISTINCT FROM OLD.is_super_admin THEN
    RAISE EXCEPTION 'Apenas super admin pode alterar is_super_admin' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
    RAISE EXCEPTION 'Apenas super admin pode mover usuário de empresa' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF NEW.is_company_admin IS DISTINCT FROM OLD.is_company_admin
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.ativo IS DISTINCT FROM OLD.ativo
     OR NEW.role IS DISTINCT FROM OLD.role
     OR NEW.allowed_modules IS DISTINCT FROM OLD.allowed_modules THEN
    -- Só admin da empresa, em perfis da própria empresa, e nunca no próprio
    IF NOT (public.is_company_admin_safe()
            AND OLD.company_id IS NOT DISTINCT FROM public.get_user_company_safe()
            AND OLD.id <> auth.uid()) THEN
      RAISE EXCEPTION 'Sem permissão para alterar papel ou situação deste usuário' USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_profile_privileges ON public.user_profiles;
CREATE TRIGGER protect_user_profile_privileges
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_profile_privileges();

-- Cadastro: marca a transação como bootstrap para o trigger acima
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m jsonb := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  PERFORM set_config('peter.profile_bootstrap', '1', true);
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

-- -----------------------------------------------------------------------------
-- 2. Links públicos por função com token
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "hr_exit_interviews_public_token" ON public.hr_exit_interviews;
DROP POLICY IF EXISTS "hr_exit_interviews_public_answer" ON public.hr_exit_interviews;
REVOKE ALL ON public.hr_exit_interviews FROM anon;
DROP POLICY IF EXISTS "disc_links_public" ON public.disc_evaluation_links;
REVOKE ALL ON public.disc_evaluation_links FROM anon;
REVOKE ALL ON public.disc_assessments FROM anon;

-- Entrevista de desligamento: leitura da própria entrevista pelo token
CREATE OR REPLACE FUNCTION public.get_exit_interview_by_token(p_token text)
RETURNS SETOF public.hr_exit_interviews
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.hr_exit_interviews
  WHERE token = p_token AND status IN ('pending', 'sent') AND link_expires_at > now()
  LIMIT 1;
$$;

-- Entrevista de desligamento: respostas (só as colunas do formulário)
CREATE OR REPLACE FUNCTION public.submit_exit_interview(p_token text, p_answers jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM public.hr_exit_interviews
   WHERE token = p_token AND status IN ('pending', 'sent') AND link_expires_at > now();
  IF v_id IS NULL THEN RETURN false; END IF;

  UPDATE public.hr_exit_interviews SET
    overall_satisfaction        = coalesce((p_answers->>'overall_satisfaction')::integer, overall_satisfaction),
    work_environment_rating     = coalesce((p_answers->>'work_environment_rating')::integer, work_environment_rating),
    management_rating           = coalesce((p_answers->>'management_rating')::integer, management_rating),
    growth_opportunities_rating = coalesce((p_answers->>'growth_opportunities_rating')::integer, growth_opportunities_rating),
    compensation_rating         = coalesce((p_answers->>'compensation_rating')::integer, compensation_rating),
    what_liked_most             = coalesce(p_answers->>'what_liked_most', what_liked_most),
    what_liked_least            = coalesce(p_answers->>'what_liked_least', what_liked_least),
    suggestions_for_improvement = coalesce(p_answers->>'suggestions_for_improvement', suggestions_for_improvement),
    reason_for_leaving          = coalesce(p_answers->>'reason_for_leaving', reason_for_leaving),
    would_recommend_company     = coalesce((p_answers->>'would_recommend_company')::boolean, would_recommend_company),
    would_consider_returning    = coalesce((p_answers->>'would_consider_returning')::boolean, would_consider_returning),
    additional_comments         = coalesce(p_answers->>'additional_comments', additional_comments),
    interview_date              = current_date,
    status                      = 'completed',
    completed_at                = now()
  WHERE id = v_id;
  RETURN true;
END;
$$;

-- DISC: dados do convite pelo token (sem expor o restante da tabela)
CREATE OR REPLACE FUNCTION public.get_disc_link_by_token(p_token text)
RETURNS TABLE (name text, email text, expires_at timestamptz, entity_type text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.name, l.email, l.expires_at, l.entity_type
  FROM public.disc_evaluation_links l
  WHERE l.token = p_token AND l.is_used = false AND l.expires_at > now()
  LIMIT 1;
$$;

-- DISC: grava o resultado na empresa do convite e consome o link
CREATE OR REPLACE FUNCTION public.submit_disc_assessment(p_token text, p_scores jsonb, p_primary_type text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.disc_evaluation_links%ROWTYPE; v_id uuid;
BEGIN
  SELECT * INTO l FROM public.disc_evaluation_links
   WHERE token = p_token AND is_used = false AND expires_at > now();
  IF l.id IS NULL THEN
    RAISE EXCEPTION 'Link de avaliação inválido ou expirado' USING ERRCODE = 'no_data_found';
  END IF;

  INSERT INTO public.disc_assessments (company_id, name, email, scores, primary_type, date, invited_by)
  VALUES (l.company_id, l.name, l.email, coalesce(p_scores, '{}'::jsonb), coalesce(p_primary_type, ''), current_date, l.created_by::text)
  RETURNING id INTO v_id;

  UPDATE public.disc_evaluation_links SET is_used = true WHERE id = l.id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_exit_interview_by_token(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_exit_interview(text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_disc_link_by_token(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_disc_assessment(text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_exit_interview_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_exit_interview(text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_disc_link_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_disc_assessment(text, jsonb, text) TO anon, authenticated;
