
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrategicIdentity } from "@/types/strategic-planning";
import { IdentityValueBadge } from "./IdentityValueBadge";

interface ManualIdentityFormProps {
  mission: string;
  setMission: (value: string) => void;
  vision: string;
  setVision: (value: string) => void;
  values: string[];
  setValues: (values: string[]) => void;
  isLoading: boolean;
}

export function ManualIdentityForm({
  mission,
  setMission,
  vision,
  setVision,
  values,
  setValues,
  isLoading
}: ManualIdentityFormProps) {
  const [newValue, setNewValue] = useState("");

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mission">Missão</Label>
        <Textarea
          id="mission"
          placeholder="Qual é a missão da sua organização?"
          rows={3}
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Valores</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {values.map((value, index) => (
            <IdentityValueBadge 
              key={index}
              value={value}
              onRemove={() => removeValue(index)}
              disabled={isLoading}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Adicione um valor..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addValue}
            disabled={!newValue.trim() || isLoading}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
