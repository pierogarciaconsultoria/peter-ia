import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FormError } from "./FormError";
import { useProcesses } from "@/hooks/useProcesses";
import { IndicatorType } from "@/types/indicators";
import { indicatorSchema } from "./IndicatorFormSchema";
import { z } from "zod";
import { IndicatorFormActions } from "./IndicatorFormActions";
import { IndicatorFormFields } from "./IndicatorFormFields";

interface IndicatorFormProps {
  indicator: IndicatorType | null;
  onClose: () => void;
  afterSubmit: (data: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'>) => void;
  defaultProcess?: string;
}

export function IndicatorForm({ 
  indicator, 
  onClose, 
  afterSubmit,
  defaultProcess 
}: IndicatorFormProps) {
  const { processes } = useProcesses();
  
  const [name, setName] = useState(indicator?.name || "");
  const [description, setDescription] = useState(indicator?.description || "");
  const [process, setProcess] = useState(indicator?.process || defaultProcess || "");
  const [goalType, setGoalType] = useState<"higher_better" | "lower_better" | "target">(
    indicator?.goal_type || "higher_better"
  );
  const [goalValue, setGoalValue] = useState<string>(
    indicator?.goal_value?.toString() || ""
  );
  const [calculationType, setCalculationType] = useState<"sum" | "average">(
    indicator?.calculation_type || "average"
  );
  const [unit, setUnit] = useState(indicator?.unit || "%");
  
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When the defaultProcess changes and it's not already set, update the process state
    if (defaultProcess && !process) {
      setProcess(defaultProcess);
    }
  }, [defaultProcess]);

  const validate = (): boolean => {
    try {
      indicatorSchema.parse({
        name,
        description,
        process,
        goalType,
        goalValue: parseFloat(goalValue),
        calculationType,
        unit
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMap: { [key: string]: string[] } = {};
        
        err.errors.forEach((error) => {
          const path = error.path[0] as string;
          if (!errorMap[path]) {
            errorMap[path] = [];
          }
          errorMap[path].push(error.message);
        });
        
        setErrors(errorMap);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const indicatorData: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'> = {
      name,
      description,
      process,
      goal_type: goalType,
      goal_value: parseFloat(goalValue),
      calculation_type: calculationType,
      unit
    };
    
    afterSubmit(indicatorData);
  };

  // Adicionar "Estratégico" à lista de processos se não existir
  const availableProcesses = [
    ...processes.map(p => p.name),
    "Estratégico" // Processo especial para indicadores estratégicos
  ];
  
  // Remover duplicatas
  const uniqueProcesses = Array.from(new Set(availableProcesses));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <IndicatorFormFields
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        process={process}
        setProcess={setProcess}
        goalType={goalType}
        setGoalType={setGoalType}
        goalValue={goalValue}
        setGoalValue={setGoalValue}
        calculationType={calculationType}
        setCalculationType={setCalculationType}
        unit={unit}
        setUnit={setUnit}
        errors={errors}
        processes={uniqueProcesses}
      />
      
      <IndicatorFormActions 
        onClose={onClose} 
        isEditing={!!indicator}
        isSubmitting={loading}
        isDeleting={false}
        onDelete={() => {}} 
      />
    </form>
  );
}
