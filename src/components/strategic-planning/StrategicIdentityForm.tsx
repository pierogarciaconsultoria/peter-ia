
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const { toast } = useToast();
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Identidade Estratégica</CardTitle>
      </CardHeader>
      <CardContent>
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
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Identidade Estratégica"}
            {!loading && <Save size={16} className="ml-2" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
