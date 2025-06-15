
import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useGlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const getModuleContext = useCallback(() => {
    const path = location.pathname;
    
    // Mapear rotas para contextos de módulo
    const moduleMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/quality': 'qualidade',
      '/processes': 'processos',
      '/human-resources': 'rh',
      '/meetings': 'reunioes',
      '/action-plans': 'plano_acao',
      '/indicators': 'indicadores_desempenho',
      '/strategic-planning': 'planejamento_estrategico',
      '/audits': 'auditoria',
      '/non-conformities': 'nao_conformidades',
      '/admin': 'admin'
    };

    // Encontrar o módulo baseado na rota
    for (const [route, module] of Object.entries(moduleMap)) {
      if (path.startsWith(route)) {
        return module;
      }
    }
    
    return 'dashboard'; // default
  }, [location.pathname]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const moduleContext = getModuleContext();
      
      // Buscar informações do módulo atual
      const { data: moduleInfo } = await supabase
        .from('module_assistants')
        .select('*')
        .eq('name', moduleContext)
        .eq('enabled', true)
        .single();

      const { data, error } = await supabase.functions.invoke('module-assistant', {
        body: {
          prompt: content,
          moduleContext: moduleInfo || {
            name: moduleContext,
            label: `Módulo ${moduleContext}`,
            description: `Assistente para o módulo ${moduleContext}`,
            capabilities: 'Responder perguntas sobre o módulo atual',
            limitations: 'Não posso modificar dados do sistema'
          }
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error("Erro ao processar mensagem. Verifique se o assistente está configurado.");
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "Desculpe, não foi possível processar sua mensagem. Verifique se o assistente está configurado corretamente no painel administrativo.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [getModuleContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    messages,
    isLoading,
    currentModule: getModuleContext(),
    sendMessage,
    clearMessages,
    toggleAssistant,
    setIsOpen
  };
}
