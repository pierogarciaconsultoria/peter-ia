
-- Adiciona/ajusta colunas para cadastro completo de Informação Documentada ISO 9001:2015

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS document_code TEXT,
  ADD COLUMN IF NOT EXISTS revision TEXT,
  ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS standard_items TEXT[], -- Referência a múltiplos itens da ISO 9001
  ADD COLUMN IF NOT EXISTS created_by UUID,  -- Elaborado por
  ADD COLUMN IF NOT EXISTS approved_by UUID,  -- Aprovado por
  ADD COLUMN IF NOT EXISTS process TEXT,
  ADD COLUMN IF NOT EXISTS distribution_location TEXT,
  ADD COLUMN IF NOT EXISTS storage_location TEXT,
  ADD COLUMN IF NOT EXISTS protection TEXT,
  ADD COLUMN IF NOT EXISTS recovery_method TEXT,
  ADD COLUMN IF NOT EXISTS retention_time TEXT,
  ADD COLUMN IF NOT EXISTS archiving_time TEXT,
  ADD COLUMN IF NOT EXISTS disposal_method TEXT,
  ADD COLUMN IF NOT EXISTS internal_external TEXT DEFAULT 'interno';

-- Atualiza comentários das colunas existentes para facilitar entendimento dos campos
COMMENT ON COLUMN public.documents.document_code IS 'Código do procedimento/documento';
COMMENT ON COLUMN public.documents.revision IS 'Controle de revisão';
COMMENT ON COLUMN public.documents.approval_date IS 'Data de aprovação do documento';
COMMENT ON COLUMN public.documents.standard_items IS 'Itens da norma ISO 9001:2015 relacionados';
COMMENT ON COLUMN public.documents.created_by IS 'Usuário elaborador (UUID)';
COMMENT ON COLUMN public.documents.approved_by IS 'Usuário aprovador (UUID)';
COMMENT ON COLUMN public.documents.process IS 'Processo relacionado ao documento';
COMMENT ON COLUMN public.documents.distribution_location IS 'Local de distribuição do documento';
COMMENT ON COLUMN public.documents.storage_location IS 'Local de armazenamento do documento';
COMMENT ON COLUMN public.documents.protection IS 'Forma de proteção do documento';
COMMENT ON COLUMN public.documents.recovery_method IS 'Procedimento de recuperação do documento';
COMMENT ON COLUMN public.documents.retention_time IS 'Tempo de retenção do documento';
COMMENT ON COLUMN public.documents.archiving_time IS 'Tempo de arquivamento do documento';
COMMENT ON COLUMN public.documents.disposal_method IS 'Forma de descarte do documento';
COMMENT ON COLUMN public.documents.internal_external IS 'Indica se o documento é interno ou externo';

-- Garante que status aceita os possíveis valores de status do documento
ALTER TABLE public.documents
  ALTER COLUMN status TYPE TEXT USING status::text;

-- Observação: Permanece compatível com os RLS (políticas de acesso) já existentes

