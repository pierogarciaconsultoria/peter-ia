
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface CompanyValuesSelectorProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function CompanyValuesSelector({ selectedValues, onChange }: CompanyValuesSelectorProps) {
  const [availableValues, setAvailableValues] = useState<string[]>([
    "Inovação",
    "Colaboração",
    "Excelência",
    "Integridade",
    "Transparência",
    "Responsabilidade",
    "Inclusão",
    "Sustentabilidade",
    "Diversidade",
    "Ética",
    "Respeito",
    "Compromisso"
  ]);
  const [newValue, setNewValue] = useState("");

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const addCustomValue = () => {
    if (!newValue) return;
    
    // Add to both available and selected values
    setAvailableValues([...availableValues, newValue]);
    onChange([...selectedValues, newValue]);
    setNewValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores da Empresa</CardTitle>
        <CardDescription>
          Selecione os valores da empresa que deseja comparar com os valores do candidato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {availableValues.map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox 
                id={`value-${value}`} 
                checked={selectedValues.includes(value)}
                onCheckedChange={() => toggleValue(value)}
              />
              <Label 
                htmlFor={`value-${value}`}
                className="cursor-pointer"
              >
                {value}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Adicionar valor personalizado..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addCustomValue}
            disabled={!newValue}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
        
        {selectedValues.length > 0 && (
          <div className="mt-6">
            <Label className="text-sm font-medium">Valores selecionados:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedValues.map((value) => (
                <div 
                  key={value}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {value}
                  <button 
                    onClick={() => toggleValue(value)}
                    className="text-primary/70 hover:text-primary"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
