
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Save, PlusCircle, Trash2 } from "lucide-react";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

interface ModuleAssistantSettingsProps {
  isAdmin: boolean;
}

interface ModuleAssistant {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  capabilities: string;
  limitations: string;
  created_at: string;
}

export function ModuleAssistantSettings({ isAdmin }: ModuleAssistantSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [modules, setModules] = useState<ModuleAssistant[]>([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  
  const isMasterAdmin = isAdmin || isSuperAdminInLovable();

  // Verificar se a chave da API está configurada
  const checkApiKeyStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('check_secret_exists', {
        secret_name: 'OPENAI_API_KEY'
      });
      
      if (error) throw error;
      setApiKeyConfigured(!!data);
    } catch (error) {
      console.error("Erro ao verificar o status da API key:", error);
      setApiKeyConfigured(false);
    }
  };

  // Carregar dados dos assistentes dos módulos
  const loadModuleAssistants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('module_assistants')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setModules(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar dados dos assistentes:", error);
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Configurar a chave da API
  const configureApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error("A chave da API é obrigatória");
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('set-secret', {
        body: { name: 'OPENAI_API_KEY', value: apiKeyInput }
      });
      
      if (error) throw error;
      
      toast.success("Chave da API configurada com sucesso");
      setApiKeyInput("");
      setApiKeyConfigured(true);
    } catch (error: any) {
      console.error("Erro ao configurar a chave da API:", error);
      toast.error(`Erro ao configurar a chave: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Adicionar um novo assistente de módulo
  const addModuleAssistant = async () => {
    if (!newModuleName.trim()) {
      toast.error("O nome do módulo é obrigatório");
      return;
    }
    
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('module_assistants')
        .insert({
          name: newModuleName,
          description: `Assistente para o módulo ${newModuleName}`,
          enabled: true,
          capabilities: "Responder perguntas sobre o módulo, fornecer dicas de uso",
          limitations: "Acessar dados de outros módulos, modificar configurações do sistema"
        })
        .select();
        
      if (error) throw error;
      
      toast.success(`Assistente do módulo "${newModuleName}" adicionado`);
      setNewModuleName("");
      setModules([...modules, data[0]]);
    } catch (error: any) {
      console.error("Erro ao adicionar assistente:", error);
      toast.error(`Erro ao adicionar assistente: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Atualizar um assistente de módulo
  const updateModuleAssistant = async (module: ModuleAssistant) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('module_assistants')
        .update({
          name: module.name,
          description: module.description,
          enabled: module.enabled,
          capabilities: module.capabilities,
          limitations: module.limitations
        })
        .eq('id', module.id);
        
      if (error) throw error;
      
      toast.success(`Assistente do módulo "${module.name}" atualizado`);
      loadModuleAssistants();
    } catch (error: any) {
      console.error("Erro ao atualizar assistente:", error);
      toast.error(`Erro ao atualizar assistente: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Excluir um assistente de módulo
  const deleteModuleAssistant = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o assistente do módulo "${name}"?`)) {
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('module_assistants')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Assistente do módulo "${name}" excluído`);
      setModules(modules.filter(m => m.id !== id));
    } catch (error: any) {
      console.error("Erro ao excluir assistente:", error);
      toast.error(`Erro ao excluir assistente: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Alternar o status de ativação de um assistente
  const toggleModuleAssistant = async (module: ModuleAssistant) => {
    const updatedModule = { ...module, enabled: !module.enabled };
    await updateModuleAssistant(updatedModule);
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (isMasterAdmin) {
      checkApiKeyStatus();
      loadModuleAssistants();
    }
  }, [isMasterAdmin]);

  if (!isMasterAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Assistente Virtual</CardTitle>
          <CardDescription>
            Configure os assistentes virtuais para diferentes módulos da aplicação
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Configuração da chave da API */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-2">Chave da API OpenAI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {apiKeyConfigured ? (
                <>Chave da API configurada. Você pode atualizar a chave a qualquer momento.</>
              ) : (
                <>Configure a chave da API do ChatGPT para habilitar os assistentes virtuais.</>
              )}
            </p>
            
            <div className="flex gap-2">
              <Input 
                type="password"
                placeholder="Insira a chave da API OpenAI"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={configureApiKey} 
                disabled={!apiKeyInput.trim() || saving}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar
              </Button>
            </div>
          </div>

          {/* Adicionar novo assistente */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-2">Adicionar Novo Assistente</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Nome do módulo"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={addModuleAssistant} 
                disabled={!newModuleName.trim() || saving || !apiKeyConfigured}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de assistentes */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-2">Assistentes Configurados</h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : modules.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Nenhum assistente configurado. Adicione um novo assistente acima.
              </p>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {modules.map((module) => (
                    <Card key={module.id}>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{module.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={module.enabled}
                              onCheckedChange={() => toggleModuleAssistant(module)}
                              id={`toggle-${module.id}`}
                            />
                            <Label htmlFor={`toggle-${module.id}`}>
                              {module.enabled ? "Ativo" : "Inativo"}
                            </Label>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3">
                        <div>
                          <Label htmlFor={`desc-${module.id}`}>Descrição</Label>
                          <Textarea 
                            id={`desc-${module.id}`}
                            value={module.description}
                            onChange={(e) => setModules(modules.map(m => 
                              m.id === module.id ? {...m, description: e.target.value} : m
                            ))}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`capabilities-${module.id}`}>Capacidades</Label>
                          <Textarea 
                            id={`capabilities-${module.id}`}
                            value={module.capabilities}
                            onChange={(e) => setModules(modules.map(m => 
                              m.id === module.id ? {...m, capabilities: e.target.value} : m
                            ))}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`limitations-${module.id}`}>Limitações</Label>
                          <Textarea 
                            id={`limitations-${module.id}`}
                            value={module.limitations}
                            onChange={(e) => setModules(modules.map(m => 
                              m.id === module.id ? {...m, limitations: e.target.value} : m
                            ))}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteModuleAssistant(module.id, module.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateModuleAssistant(module)}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
