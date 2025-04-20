import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProcesses } from '@/hooks/useProcesses';
import { IndicatorType } from '@/types/indicators';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { IndicatorFormFields } from './IndicatorFormFields';
import { IndicatorFormActions } from './IndicatorFormActions';
import { z } from "zod";
import { indicatorSchema } from './IndicatorFormSchema';
import { v4 as generateId } from 'uuid';

type CalculationType = "sum" | "average";
type GoalType = "higher_better" | "lower_better" | "target";

const validCalculationTypes: readonly CalculationType[] = ["sum", "average"] as const;
const validGoalTypes: readonly GoalType[] = ["higher_better", "lower_better", "target"] as const;

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
  const { toast } = useToast();
  
  const [name, setName] = useState(indicator?.name || "");
  const [description, setDescription] = useState(indicator?.description || "");
  const [process, setProcess] = useState(indicator?.process || defaultProcess || "");
  const [goalType, setGoalType] = useState<GoalType>(indicator?.goal_type || "higher_better");
  const [goalValue, setGoalValue] = useState<string>(indicator?.goal_value?.toString() || "");
  const [calculationType, setCalculationType] = useState<CalculationType>(indicator?.calculation_type || "average");
  const [unit, setUnit] = useState(indicator?.unit || "%");
  
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const safeCalculationType = validCalculationTypes.includes(calculationType as CalculationType) 
      ? calculationType 
      : "average" as const;
      
    const safeGoalType = validGoalTypes.includes(goalType as GoalType) 
      ? goalType 
      : "higher_better" as const;

    const now = new Date().toISOString();
    
    const indicatorData: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'> = {
      name,
      description,
      process,
      goal_type: safeGoalType,
      goal_value: parseFloat(goalValue),
      calculation_type: safeCalculationType,
      unit
    };
    
    afterSubmit(indicatorData);
  };

  const validate = (): boolean => {
    try {
      indicatorSchema.parse({
        name,
        description,
        process,
        goal_type: goalType,
        goal_value: parseFloat(goalValue),
        calculation_type: calculationType,
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
        processes={processes.map(p => p.name)}
      />
      
      <IndicatorFormActions
        isEditing={!!indicator}
        isSubmitting={loading}
        isDeleting={deleting}
        onClose={onClose}
        onDelete={() => {}}
      />
    </form>
  );
}
