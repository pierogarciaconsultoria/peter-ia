
-- Criação da tabela para Política da Qualidade
CREATE TABLE public.quality_policy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_text TEXT NOT NULL,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- (Opcional) Index para company_id para facilitar buscas
CREATE INDEX idx_quality_policy_company ON public.quality_policy(company_id);

-- Permite múltiplas políticas por empresa, mas pode-se buscar a mais recente via SELECT com ORDER BY updated_at

-- Row Level Security: habilitar e liberar CRUD apenas para admins da respectiva empresa, mas por padrão liberar para todos os usuários autenticados da empresa (por simplicidade, ajuste se necessário)
ALTER TABLE public.quality_policy ENABLE ROW LEVEL SECURITY;

-- Apenas usuários da empresa podem visualizar
CREATE POLICY "Empresa visualiza suas políticas" ON public.quality_policy
  FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- Apenas usuários da empresa podem inserir
CREATE POLICY "Empresa insere política" ON public.quality_policy
  FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- Apenas usuários da empresa podem atualizar
CREATE POLICY "Empresa edita política" ON public.quality_policy
  FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- Apenas usuários da empresa podem deletar (caso necessário)
CREATE POLICY "Empresa deleta política" ON public.quality_policy
  FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );
