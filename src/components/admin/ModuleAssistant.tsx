
import { useEffect, useState } from "react";
import { X, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModuleAssistantProps {
  moduleName: string;
}

export function ModuleAssistant({ moduleName }: ModuleAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [moduleContext, setModuleContext] = useState<any>(null);

  useEffect(() => {
    const fetchModuleContext = async () => {
      try {
        const { data, error } = await supabase
          .from('module_assistants')
          .select('*')
          .eq('name', moduleName)
          .single();
        
        if (error) throw error;
        
        setModuleContext(data);
      } catch (error: any) {
        console.error('Erro ao carregar contexto do módulo:', error.message);
      }
    };
    
    if (moduleName) {
      fetchModuleContext();
    }
  }, [moduleName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !moduleContext) return;
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke('module-assistant', {
        body: { 
          prompt,
          moduleContext
        }
      });
      
      if (error) throw error;
      
      setResponse(data.response);
      setPrompt("");
    } catch (error: any) {
      console.error('Erro ao processar pergunta:', error);
      toast.error("Não foi possível processar sua pergunta. Verifique se a chave da API está configurada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="font-medium">Assistente de {moduleContext?.label || moduleName}</div>
        <Button variant="ghost" size="icon" onClick={() => setResponse("")}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="pb-3">
        {response ? (
          <div className="max-h-64 overflow-y-auto text-sm whitespace-pre-wrap">
            {response}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Como posso ajudar com o módulo {moduleContext?.label || moduleName}?
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
