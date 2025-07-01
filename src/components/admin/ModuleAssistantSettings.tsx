
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Shield, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModuleAssistant {
  id: string;
  name: string;
  label: string;
  description: string;
  enabled: boolean;
  capabilities: string;
  limitations: string;
  created_at: string;
  updated_at: string;
}

interface ModuleAssistantSettingsProps {
  isAdmin: boolean;
}

export function ModuleAssistantSettings({ isAdmin }: ModuleAssistantSettingsProps) {
  const [assistants, setAssistants] = useState<ModuleAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);

  // Verificar se a chave OpenAI está configurada
  const checkOpenAIKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-secret-exists', {
        body: { secretName: 'OPENAI_API_KEY' }
      });
      
      if (!error && data?.exists) {
        setHasOpenAIKey(true);
      }
    } catch (error) {
      console.error('Erro ao verificar chave OpenAI:', error);
    }
  };

  // Carregar assistentes
  const loadAssistants = async () => {
    try {
      const { data, error } = await supabase
        .from('module_assistants')
        .select('*')
        .order('name');

      if (error) throw error;
      setAssistants(data || []);
    } catch (error) {
      console.error('Erro ao carregar assistentes:', error);
      toast.error('Erro ao carregar assistentes');
    } finally {
      setLoading(false);
    }
  };

  // Salvar alterações do assistente
  const saveAssistant = async (assistant: ModuleAssistant) => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem modificar assistentes');
      return;
    }

    setSaving(assistant.id);
    try {
      const { error } = await supabase
        .from('module_assistants')
        .update({
          label: assistant.label,
          description: assistant.description,
          enabled: assistant.enabled,
          capabilities: assistant.capabilities,
          limitations: assistant.limitations,
          updated_at: new Date().toISOString()
        })
        .eq('id', assistant.id);

      if (error) throw error;
      
      toast.success('Assistente atualizado com sucesso');
      await loadAssistants();
    } catch (error) {
      console.error('Erro ao salvar assistente:', error);
      toast.error('Erro ao salvar assistente');
    } finally {
      setSaving(null);
    }
  };

  // Atualizar assistente no estado
  const updateAssistant = (id: string, updates: Partial<ModuleAssistant>) => {
    setAssistants(prev => 
      prev.map(assistant => 
        assistant.id === id 
          ? { ...assistant, ...updates }
          : assistant
      )
    );
  };

  useEffect(() => {
    loadAssistants();
    checkOpenAIKey();
  }, []);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Acesso Restrito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar as configurações dos assistentes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Configurações dos Assistentes GPT</h3>
          <p className="text-sm text-muted-foreground">
            Configure os assistentes virtuais para cada módulo
          </p>
        </div>
      </div>

      {!hasOpenAIKey && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Chave OpenAI não configurada!</strong> Os assistentes não funcionarão até que a chave da API seja configurada.
            Configure em Configurações Avançadas → Secrets.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {assistants.map((assistant) => (
            <Card key={assistant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {assistant.label}
                    <Badge variant={assistant.enabled ? 'default' : 'secondary'}>
                      {assistant.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={assistant.enabled}
                      onCheckedChange={(enabled) => 
                        updateAssistant(assistant.id, { enabled })
                      }
                    />
                    <Button
                      onClick={() => saveAssistant(assistant)}
                      disabled={saving === assistant.id}
                      size="sm"
                    >
                      {saving === assistant.id ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`label-${assistant.id}`}>Nome do Assistente</Label>
                    <Input
                      id={`label-${assistant.id}`}
                      value={assistant.label}
                      onChange={(e) => 
                        updateAssistant(assistant.id, { label: e.target.value })
                      }
                      placeholder="Nome amigável do assistente"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`name-${assistant.id}`}>Módulo</Label>
                    <Input
                      id={`name-${assistant.id}`}
                      value={assistant.name}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`description-${assistant.id}`}>Descrição</Label>
                  <Textarea
                    id={`description-${assistant.id}`}
                    value={assistant.description || ''}
                    onChange={(e) => 
                      updateAssistant(assistant.id, { description: e.target.value })
                    }
                    placeholder="Descreva o que este assistente faz..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor={`capabilities-${assistant.id}`}>Capacidades</Label>
                  <Textarea
                    id={`capabilities-${assistant.id}`}
                    value={assistant.capabilities || ''}
                    onChange={(e) => 
                      updateAssistant(assistant.id, { capabilities: e.target.value })
                    }
                    placeholder="Liste as capacidades deste assistente..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor={`limitations-${assistant.id}`}>Limitações</Label>
                  <Textarea
                    id={`limitations-${assistant.id}`}
                    value={assistant.limitations || ''}
                    onChange={(e) => 
                      updateAssistant(assistant.id, { limitations: e.target.value })
                    }
                    placeholder="Liste as limitações deste assistente..."
                    rows={2}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Última atualização: {new Date(assistant.updated_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Assistentes são contextualmente específicos para cada módulo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Histórico de conversas é mantido por sessão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Configurações aplicam-se imediatamente após salvar</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
