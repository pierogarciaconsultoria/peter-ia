
-- Tabela de Partes Interessadas (stakeholders)
CREATE TABLE public.stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('interno', 'externo')),
  category TEXT NOT NULL, -- cliente, fornecedor, governo, comunidade, funcionário, etc.
  influence_level TEXT NOT NULL CHECK (influence_level IN ('baixo', 'médio', 'alto', 'crítico')),
  interest_level TEXT NOT NULL CHECK (interest_level IN ('baixo', 'médio', 'alto')),
  expectations TEXT,
  communication_method TEXT,
  contact_info TEXT,
  notes TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Somente usuários da empresa visualizam stakeholders" ON public.stakeholders
  FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa inserem stakeholders" ON public.stakeholders
  FOR INSERT WITH CHECK (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa editam stakeholders" ON public.stakeholders
  FOR UPDATE USING (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa excluem stakeholders" ON public.stakeholders
  FOR DELETE USING (company_id = public.get_user_company_safe());

-- Trigger para updated_at  
CREATE OR REPLACE FUNCTION public.set_stakeholder_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_stakeholders
BEFORE UPDATE ON public.stakeholders
FOR EACH ROW EXECUTE FUNCTION public.set_stakeholder_updated_at();



-- Tabela de Informação Documentada (documents)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  document_type TEXT,
  version TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_revisao', 'aprovado', 'obsoleto')),
  tags TEXT[],
  created_by UUID,
  approved_by UUID,
  approval_date TIMESTAMPTZ,
  review_date TIMESTAMPTZ,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Somente usuários da empresa visualizam documentos" ON public.documents
  FOR SELECT USING (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa inserem documentos" ON public.documents
  FOR INSERT WITH CHECK (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa editam documentos" ON public.documents
  FOR UPDATE USING (company_id = public.get_user_company_safe());

CREATE POLICY "Somente usuários da empresa excluem documentos" ON public.documents
  FOR DELETE USING (company_id = public.get_user_company_safe());

-- Trigger para updated_at  
CREATE OR REPLACE FUNCTION public.set_document_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_documents
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.set_document_updated_at();
