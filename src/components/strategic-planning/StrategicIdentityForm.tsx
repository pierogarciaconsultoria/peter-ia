
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PenLine, Sparkles } from "lucide-react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityQuestionnaireForm, IdentityResponses } from "./IdentityQuestionnaireForm";
import { supabase } from "@/integrations/supabase/client";
import { ManualIdentityForm } from "./ManualIdentityForm";
import { IdentityFormActions } from "./IdentityFormActions";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("manual");
  
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  
  const [loading, setLoading] = useState(false);
  const [generatingIdentity, setGeneratingIdentity] = useState(false);

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
            <ManualIdentityForm
              mission={mission}
              setMission={setMission}
              vision={vision}
              setVision={setVision}
              values={values}
              setValues={setValues}
              isLoading={loading}
            />
            
            <IdentityFormActions 
              onReset={resetForm}
              isLoading={loading}
            />
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
