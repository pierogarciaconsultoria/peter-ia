
-- Adicionar a coluna 'label' se ela não existir, para evitar erros em execuções repetidas
ALTER TABLE public.module_assistants ADD COLUMN IF NOT EXISTS label TEXT;

-- Preencher a coluna 'label' para registros existentes que possam tê-la como nula
UPDATE public.module_assistants
SET label = 'Assistente para ' || name
WHERE label IS NULL OR label = '';

-- Definir a coluna 'label' como não nula, pois é um campo obrigatório
ALTER TABLE public.module_assistants ALTER COLUMN label SET NOT NULL;

-- Remover o valor padrão da coluna 'updated_at', que está incorreto para atualizações
ALTER TABLE public.module_assistants ALTER COLUMN updated_at DROP DEFAULT;

-- Remover o gatilho antigo, se existir, para garantir que não haja duplicatas
DROP TRIGGER IF EXISTS set_module_assistants_updated_at ON public.module_assistants;

-- Criar o gatilho para atualizar automaticamente a data de 'updated_at' em cada modificação
CREATE TRIGGER set_module_assistants_updated_at
BEFORE UPDATE ON public.module_assistants
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();
