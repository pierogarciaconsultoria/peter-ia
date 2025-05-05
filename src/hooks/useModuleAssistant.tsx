
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModuleAssistant } from "@/types/module-assistant";

interface UseModuleAssistantOptions {
  moduleName: string;
  initialQuery?: string;
  autoOpen?: boolean;
}

export function useModuleAssistant({ moduleName, initialQuery, autoOpen = false }: UseModuleAssistantOptions) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isVisible, setIsVisible] = useState(autoOpen);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar se o assistente está disponível e habilitado
  useEffect(() => {
    const checkAssistantStatus = async () => {
      setIsLoading(true);
      try {
        // Use custom query to get around type issues
        const { data, error } = await supabase
          .from('module_assistants')
          .select('*')
          .eq('name', moduleName)
          .eq('enabled', true)
          .maybeSingle();
          
        if (error) throw error;
        
        setIsAvailable(!!data);
        setIsEnabled(!!data);
        
        // Verificar se a API key está configurada
        if (data) {
          const { data: secretExists, error: secretError } = await supabase.functions.invoke('check-secret-exists', {
            body: { secret_name: 'OPENAI_API_KEY' }
          });
          
          if (secretError) throw secretError;
          
          setIsEnabled(!!secretExists?.exists);
        }
      } catch (error: any) {
        console.error(`Erro ao verificar status do assistente para o módulo ${moduleName}:`, error);
        setIsAvailable(false);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAssistantStatus();
  }, [moduleName]);
  
  // Função para alternar a visibilidade do assistente
  const toggleAssistant = () => {
    if (isEnabled) {
      setIsVisible(!isVisible);
    } else if (isAvailable) {
      toast.error("O assistente está configurado mas a chave da API não está definida.");
    } else {
      toast.error("O assistente não está disponível para este módulo.");
    }
  };
  
  return {
    isEnabled,
    isAvailable,
    isVisible,
    isLoading,
    toggleAssistant,
    setIsVisible
  };
}
