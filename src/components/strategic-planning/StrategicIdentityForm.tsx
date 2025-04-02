
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PenLine, Save, RotateCcw } from "lucide-react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { useToast } from "@/hooks/use-toast";
import { ManualIdentityForm } from "./ManualIdentityForm";
import { IdentityFormActions } from "./IdentityFormActions";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const { toast } = useToast();
  
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

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
      setIsEditing(false);
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

  const resetForm = () => {
    setMission(identity?.mission || "");
    setVision(identity?.vision || "");
    setValues(identity?.values || []);
    
    toast({
      title: "Formulário Redefinido",
      description: "Os campos foram restaurados para os valores salvos anteriormente",
    });
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Identidade Estratégica</CardTitle>
        <CardDescription>
          Defina a missão, visão e valores da sua organização
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ManualIdentityForm
            mission={mission}
            setMission={setMission}
            vision={vision}
            setVision={setVision}
            values={values}
            setValues={setValues}
            isLoading={loading}
            isEditable={isEditing}
          />
          
          {isEditing ? (
            <IdentityFormActions 
              onReset={resetForm}
              isLoading={loading}
            />
          ) : (
            <div className="flex justify-end mt-4">
              <button 
                type="button" 
                onClick={enableEditing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <PenLine className="h-4 w-4 mr-2 inline" />
                Editar
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
