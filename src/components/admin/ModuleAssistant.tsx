
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ModuleAssistantProps {
  moduleName: string;
  className?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ModuleAssistant({ moduleName, className }: ModuleAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistantInfo, setAssistantInfo] = useState<any>(null);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Carregar informações do assistente do módulo
  const loadAssistantInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('module_assistants')
        .select('*')
        .eq('name', moduleName)
        .eq('enabled', true)
        .maybeSingle();
        
      if (error) throw error;
      
      setAssistantInfo(data);
      setIsAssistantEnabled(!!data);
    } catch (error) {
      console.error(`Erro ao carregar informações do assistente do módulo ${moduleName}:`, error);
      setIsAssistantEnabled(false);
    }
  };
  
  // Carregar histórico de mensagens do usuário (opcional)
  const loadMessageHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('assistant_conversations')
        .select('*')
        .eq('module', moduleName)
        .order('timestamp', { ascending: true })
        .limit(20);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Adicionar mensagem de boas-vindas
        if (assistantInfo) {
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: `Olá! Sou o assistente virtual do módulo ${moduleName}. Como posso ajudar você hoje?`,
            timestamp: new Date()
          }]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de mensagens:", error);
    }
  };

  // Enviar mensagem para o assistente
  const sendMessage = async () => {
    if (!input.trim() || !isAssistantEnabled || loading) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Preparar o contexto do módulo
      const moduleContext = {
        name: moduleName,
        description: assistantInfo?.description,
        capabilities: assistantInfo?.capabilities,
        limitations: assistantInfo?.limitations
      };
      
      // Chamar a função do Supabase para processar a mensagem
      const { data, error } = await supabase.functions.invoke('module-assistant', {
        body: { prompt: input, moduleContext }
      });
      
      if (error) throw error;
      
      // Adicionar a resposta do assistente
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Salvar o histórico de conversa (opcional)
      await supabase.from('assistant_conversations').insert([
        {
          module: moduleName,
          role: userMessage.role,
          content: userMessage.content,
          timestamp: userMessage.timestamp
        },
        {
          module: moduleName,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: assistantMessage.timestamp
        }
      ]);
    } catch (error: any) {
      console.error("Erro ao processar mensagem:", error);
      toast.error(`Erro no assistente: ${error.message || "Falha ao processar mensagem"}`);
      
      // Adicionar mensagem de erro
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar informações do assistente quando o componente for montado
  useEffect(() => {
    loadAssistantInfo();
  }, [moduleName]);

  // Carregar histórico de mensagens quando as informações do assistente estiverem disponíveis
  useEffect(() => {
    if (assistantInfo) {
      loadMessageHistory();
    }
  }, [assistantInfo]);

  // Rolar para o final da conversa quando novas mensagens forem adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Não renderizar o componente se o assistente estiver desativado
  if (!isAssistantEnabled) return null;

  return (
    <Card className={`border shadow-md ${className}`}>
      <CardHeader className="p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {moduleName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm">Assistente do {moduleName}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="p-3">
            <ScrollArea className="h-[250px] pr-3">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "assistant"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3">
            <div className="flex w-full items-center space-x-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[60px] resize-none"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
