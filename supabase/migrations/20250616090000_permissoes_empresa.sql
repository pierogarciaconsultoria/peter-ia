CREATE TABLE public.permissoes_empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  modulo_id UUID NOT NULL REFERENCES public.modulos(id) ON DELETE CASCADE,
  pode_visualizar BOOLEAN NOT NULL DEFAULT TRUE,
  pode_editar BOOLEAN NOT NULL DEFAULT FALSE,
  pode_excluir BOOLEAN NOT NULL DEFAULT FALSE,
  pode_criar BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_permissoes_empresa_company_modulo
  ON public.permissoes_empresa(company_id, modulo_id);

ALTER TABLE public.permissoes_empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa visualiza permissoes" ON public.permissoes_empresa
  FOR SELECT
  USING (company_id = public.get_user_company_safe());

CREATE POLICY "Empresa gerencia permissoes" ON public.permissoes_empresa
  FOR ALL
  USING (
    company_id = public.get_user_company_safe()
    AND EXISTS (
      SELECT 1
      FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND (up.is_super_admin OR up.is_company_admin)
    )
  )
  WITH CHECK (
    company_id = public.get_user_company_safe()
  );

