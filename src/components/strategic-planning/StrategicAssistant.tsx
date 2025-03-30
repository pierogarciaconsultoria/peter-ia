
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function StrategicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu assistente de planejamento estratégico. Como posso ajudar você hoje?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare context (last 6 messages to provide context)
      const context = messages
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('strategic-assistant', {
        body: { message: input, context }
      });

      if (error) throw error;

      if (data && data.response) {
        // Add assistant response to chat
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.response }
        ]);
      }
    } catch (error) {
      console.error("Error calling strategic assistant:", error);
      toast({
        title: "Erro ao conectar com o assistente",
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente mais tarde." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed right-6 bottom-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center" size="icon">
          <Sparkles className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <Card className="h-full border-0 rounded-t-xl rounded-b-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Assistente Estratégico
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-2 border-t gap-2">
            <Textarea 
              placeholder="Digite sua pergunta sobre planejamento estratégico..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              className="shrink-0" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </DrawerContent>
    </Drawer>
  );
}
