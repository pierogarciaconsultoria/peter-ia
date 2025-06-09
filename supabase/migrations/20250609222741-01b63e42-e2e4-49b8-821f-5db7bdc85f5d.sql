
-- Fase 2: Criação das tabelas faltantes e correção de RLS

-- 1. Tabela para avaliações de fornecedores
CREATE TABLE IF NOT EXISTS public.supplier_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_name TEXT NOT NULL,
    evaluation_date DATE NOT NULL,
    evaluator TEXT NOT NULL,
    category TEXT NOT NULL,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
    delivery_score INTEGER CHECK (delivery_score >= 1 AND delivery_score <= 10),
    price_score INTEGER CHECK (price_score >= 1 AND price_score <= 10),
    support_score INTEGER CHECK (support_score >= 1 AND support_score <= 10),
    total_score NUMERIC GENERATED ALWAYS AS ((quality_score + delivery_score + price_score + support_score) / 4.0) STORED,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    comments TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela para produtos não conformes
CREATE TABLE IF NOT EXISTS public.non_conforming_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'in_progress', 'resolved', 'approved', 'rejected')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    requirement_id TEXT NOT NULL,
    department TEXT NOT NULL,
    customer TEXT,
    non_conformity_type TEXT NOT NULL,
    immediate_action TEXT NOT NULL,
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela para pesquisas de satisfação do cliente
CREATE TABLE IF NOT EXISTS public.customer_satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    survey_date DATE NOT NULL,
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
    product_quality INTEGER CHECK (product_quality >= 1 AND product_quality <= 10),
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 10),
    delivery_satisfaction INTEGER CHECK (delivery_satisfaction >= 1 AND delivery_satisfaction <= 10),
    suggestions TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'completed')),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela para calibração de equipamentos
CREATE TABLE IF NOT EXISTS public.equipment_calibrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_name TEXT NOT NULL,
    equipment_id TEXT NOT NULL,
    calibration_date DATE NOT NULL,
    next_calibration_date DATE NOT NULL,
    responsible TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expired', 'scheduled')),
    certificate_number TEXT,
    calibration_entity TEXT NOT NULL,
    observations TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Criar função SECURITY DEFINER para verificar permissões sem recursão RLS
CREATE OR REPLACE FUNCTION public.get_user_company_safe()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT company_id FROM public.user_profiles WHERE id = auth.uid();
$$;

-- 6. Habilitar RLS nas novas tabelas
ALTER TABLE public.supplier_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_conforming_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_calibrations ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS usando a função segura
CREATE POLICY "Users can view company supplier evaluations" ON public.supplier_evaluations
    FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can manage company supplier evaluations" ON public.supplier_evaluations
    FOR ALL USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can view company non conforming products" ON public.non_conforming_products
    FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can manage company non conforming products" ON public.non_conforming_products
    FOR ALL USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can view company satisfaction surveys" ON public.customer_satisfaction_surveys
    FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can manage company satisfaction surveys" ON public.customer_satisfaction_surveys
    FOR ALL USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can view company equipment calibrations" ON public.equipment_calibrations
    FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Users can manage company equipment calibrations" ON public.equipment_calibrations
    FOR ALL USING (company_id = public.get_user_company_safe());

-- 8. Adicionar triggers para updated_at
CREATE TRIGGER update_supplier_evaluations_updated_at
    BEFORE UPDATE ON public.supplier_evaluations
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER update_non_conforming_products_updated_at
    BEFORE UPDATE ON public.non_conforming_products
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER update_customer_satisfaction_surveys_updated_at
    BEFORE UPDATE ON public.customer_satisfaction_surveys
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER update_equipment_calibrations_updated_at
    BEFORE UPDATE ON public.equipment_calibrations
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 9. Corrigir função problemática que pode causar recursão RLS
CREATE OR REPLACE FUNCTION public.check_user_permission(
    target_table text,
    action text,
    target_company_id uuid DEFAULT NULL::uuid,
    target_user_id uuid DEFAULT NULL::uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    user_role text;
    user_company_id uuid;
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();
    
    -- Usar função segura para obter dados do usuário
    SELECT 
        CASE 
            WHEN is_super_admin THEN 'super_admin'
            WHEN is_company_admin THEN 'company_admin'
            ELSE 'user'
        END,
        company_id
    INTO user_role, user_company_id
    FROM public.user_profiles 
    WHERE id = current_user_id;
    
    -- Super admin tem acesso total
    IF user_role = 'super_admin' THEN
        RETURN true;
    END IF;
    
    -- Company admin tem acesso na sua empresa
    IF user_role = 'company_admin' THEN
        IF target_company_id IS NOT NULL THEN
            RETURN target_company_id = user_company_id;
        END IF;
        RETURN true;
    END IF;
    
    -- Usuário comum só acessa dados da própria empresa
    IF user_role = 'user' THEN
        IF target_company_id IS NOT NULL THEN
            RETURN target_company_id = user_company_id;
        END IF;
        IF target_user_id IS NOT NULL THEN
            RETURN target_user_id = current_user_id;
        END IF;
        RETURN action = 'SELECT';
    END IF;
    
    RETURN false;
END;
$$;
