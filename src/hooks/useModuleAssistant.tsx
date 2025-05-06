
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModuleAssistant } from "@/types/module-assistant";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

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
  const [error, setError] = useState<Error | null>(null);
  
  // Check if super admin in Lovable Editor - they always have access to assistants
  const isMasterLovable = isSuperAdminInLovable();
  
  // Verificar se o assistente está disponível e habilitado
  useEffect(() => {
    const checkAssistantStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For super admins in Lovable Editor, we can enable the assistant directly
        if (isMasterLovable) {
          setIsAvailable(true);
          setIsEnabled(true);
          setIsLoading(false);
          return;
        }
        
        // Use custom query to get around type issues
        const { data, error } = await supabase
          .from('module_assistants')
          .select('*')
          .eq('name', moduleName)
          .eq('enabled', true)
          .maybeSingle();
          
        if (error) {
          // Check if this is a database connection or policy error
          if (error.message.includes('network') || 
              error.message.includes('policy') || 
              error.message.includes('recursion')) {
            console.warn("Database connection or policy issue. Using fallback for assistant status.");
            // Fallback: treat the assistant as available but not enabled
            setIsAvailable(true);
            setIsEnabled(false);
          } else {
            throw error;
          }
        } else {
          setIsAvailable(!!data);
          setIsEnabled(!!data);
          
          // Verificar se a API key está configurada
          if (data) {
            try {
              const { data: secretExists, error: secretError } = await supabase.functions.invoke('check-secret-exists', {
                body: { secret_name: 'OPENAI_API_KEY' }
              });
              
              if (secretError) {
                console.warn("Error checking for API key:", secretError);
                // If we can't check for the API key, we'll assume it's not set
                setIsEnabled(false);
              } else {
                setIsEnabled(!!secretExists?.exists);
              }
            } catch (secretCheckError) {
              console.warn("Failed to check for API key:", secretCheckError);
              // If we can't reach the function, assume the key isn't set
              setIsEnabled(false);
            }
          }
        }
      } catch (error: any) {
        console.error(`Erro ao verificar status do assistente para o módulo ${moduleName}:`, error);
        setError(error);
        setIsAvailable(false);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAssistantStatus();
  }, [moduleName, isMasterLovable]);
  
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
    error,
    toggleAssistant,
    setIsVisible
  };
}
