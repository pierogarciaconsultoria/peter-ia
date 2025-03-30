
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, PenLine, RotateCcw, Sparkles } from "lucide-react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityQuestionnaireForm, IdentityResponses } from "./IdentityQuestionnaireForm";
import { createClientComponentClient } from "@supabase/supabase-js";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<string>("manual");
  
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  const [newValue, setNewValue] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [generatingIdentity, setGeneratingIdentity] = useState(false);

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateStrategicIdentity({
        mission,
        vision,
        values,
      });
      
      toast({
        title: "Identidade Estratégica Atualizada",
        description: "As informações foram salvas com sucesso",
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error saving strategic identity:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as informações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionnaireSubmit = async (responses: IdentityResponses) => {
    setGeneratingIdentity(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-strategic-identity', {
        body: { responses }
      });
      
      if (error) throw error;
      
      if (data) {
        setMission(data.mission || "");
        setVision(data.vision || "");
        setValues(data.values || []);
        
        // Switch to the manual tab to show results
        setActiveTab("manual");
        
        toast({
          title: "Sugestões Geradas",
          description: "A identidade estratégica foi gerada com sucesso. Você pode editá-la conforme necessário.",
        });
      }
    } catch (error) {
      console.error("Error generating strategic identity:", error);
      toast({
        title: "Erro ao gerar sugestões",
        description: "Ocorreu um erro ao gerar a identidade estratégica",
        variant: "destructive",
      });
    } finally {
      setGeneratingIdentity(false);
    }
  };

  const resetForm = () => {
    setMission(identity?.mission || "");
    setVision(identity?.vision || "");
    setValues(identity?.values || []);
    
    toast({
      title: "Formulário Redefinido",
      description: "Os campos foram restaurados para os valores salvos anteriormente",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Identidade Estratégica</CardTitle>
        <CardDescription>
          Defina a missão, visão e valores da sua organização
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">
              <PenLine className="mr-2 h-4 w-4" />
              Edição Manual
            </TabsTrigger>
            <TabsTrigger value="guided">
              <Sparkles className="mr-2 h-4 w-4" />
              Assistente de Identidade
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Missão</Label>
              <Textarea
                id="mission"
                placeholder="Qual é a missão da sua organização?"
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vision">Visão</Label>
              <Textarea
                id="vision"
                placeholder="Qual é a visão da sua organização?"
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valores</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {values.map((value, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {value}
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Adicione um valor..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addValue}
                  disabled={!newValue.trim()}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={loading}
                className="flex-1"
              >
                <RotateCcw size={16} className="mr-2" />
                Restaurar
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1"
              >
                {loading ? "Salvando..." : "Salvar Identidade"}
                {!loading && <Save size={16} className="ml-2" />}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="guided">
          <IdentityQuestionnaireForm 
            onSubmitResponses={handleQuestionnaireSubmit}
            isGenerating={generatingIdentity}
          />
        </TabsContent>
      </CardContent>
    </Card>
  );
}
