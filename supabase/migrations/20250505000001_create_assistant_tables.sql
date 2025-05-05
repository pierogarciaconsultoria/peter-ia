
-- Tabela para armazenar configurações dos assistentes de módulos
CREATE TABLE IF NOT EXISTS public.module_assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    enabled BOOLEAN DEFAULT true,
    capabilities TEXT,
    limitations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comentário da tabela
COMMENT ON TABLE public.module_assistants IS 'Armazena a configuração dos assistentes virtuais para cada módulo';

-- Adicionar políticas RLS para a tabela module_assistants
ALTER TABLE public.module_assistants ENABLE ROW LEVEL SECURITY;

-- Só admins podem ler as configurações dos assistentes
CREATE POLICY "Apenas admins podem visualizar assistentes" ON public.module_assistants
    FOR SELECT USING (
        (SELECT is_super_admin FROM public.user_profiles WHERE id = auth.uid())
        OR
        (SELECT is_company_admin FROM public.user_profiles WHERE id = auth.uid())
    );

-- Só super admins podem gerenciar assistentes
CREATE POLICY "Apenas super admins podem gerenciar assistentes" ON public.module_assistants
    FOR ALL USING (
        (SELECT is_super_admin FROM public.user_profiles WHERE id = auth.uid())
    );

-- Tabela para armazenar conversas com assistentes
CREATE TABLE IF NOT EXISTS public.assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comentário da tabela
COMMENT ON TABLE public.assistant_conversations IS 'Armazena histórico de conversas com assistentes virtuais';

-- Adicionar políticas RLS para a tabela assistant_conversations
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;

-- Usuários só podem ver suas próprias conversas
CREATE POLICY "Usuários veem suas próprias conversas" ON public.assistant_conversations
    FOR SELECT USING (user_id = auth.uid());

-- Usuários só podem inserir suas próprias conversas
CREATE POLICY "Usuários inserem suas próprias conversas" ON public.assistant_conversations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Criar função para verificar se um segredo existe
CREATE OR REPLACE FUNCTION public.check_secret_exists(secret_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Essa função na verdade só retornará se o chamador tem permissões
    -- A verificação real é feita na Edge Function
    RETURN (SELECT is_super_admin FROM public.user_profiles WHERE id = auth.uid());
END;
$$;

-- Definir permissões para a função
REVOKE EXECUTE ON FUNCTION public.check_secret_exists FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_secret_exists TO authenticated;
