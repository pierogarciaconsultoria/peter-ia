
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

interface IndicatorFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  process: string;
  setProcess: (value: string) => void;
  goalType: "higher_better" | "lower_better" | "target";
  setGoalType: (value: "higher_better" | "lower_better" | "target") => void;
  goalValue: string;
  setGoalValue: (value: string) => void;
  calculationType: "sum" | "average";
  setCalculationType: (value: "sum" | "average") => void;
  unit: string;
  setUnit: (value: string) => void;
  errors: { [key: string]: string[] };
  processes: string[];
}

export function IndicatorFormFields({
  name,
  setName,
  description,
  setDescription,
  process,
  setProcess,
  goalType,
  setGoalType,
  goalValue,
  setGoalValue,
  calculationType,
  setCalculationType,
  unit,
  setUnit,
  errors,
  processes
}: IndicatorFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Indicador</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Taxa de Satisfação do Cliente"
        />
        {errors.name && <FormError errors={errors.name} />}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o que este indicador mede e por que é importante"
          rows={3}
        />
        {errors.description && <FormError errors={errors.description} />}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="process">Processo</Label>
        <Select value={process} onValueChange={setProcess}>
          <SelectTrigger id="process">
            <SelectValue placeholder="Selecione um processo" />
          </SelectTrigger>
          <SelectContent>
            {processes.map((processName) => (
              <SelectItem key={processName} value={processName}>
                {processName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.process && <FormError errors={errors.process} />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goalType">Tipo de Meta</Label>
          <Select value={goalType} onValueChange={(value) => setGoalType(value as any)}>
            <SelectTrigger id="goalType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="higher_better">Quanto maior, melhor</SelectItem>
              <SelectItem value="lower_better">Quanto menor, melhor</SelectItem>
              <SelectItem value="target">Valor específico (alvo)</SelectItem>
            </SelectContent>
          </Select>
          {errors.goalType && <FormError errors={errors.goalType} />}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="calculationType">Tipo de Cálculo</Label>
          <Select value={calculationType} onValueChange={(value) => setCalculationType(value as any)}>
            <SelectTrigger id="calculationType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="average">Média</SelectItem>
              <SelectItem value="sum">Somatório</SelectItem>
            </SelectContent>
          </Select>
          {errors.calculationType && <FormError errors={errors.calculationType} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goalValue">Valor da Meta</Label>
          <Input
            id="goalValue"
            type="number"
            step="0.01"
            value={goalValue}
            onChange={(e) => setGoalValue(e.target.value)}
            placeholder="Ex: 95"
          />
          {errors.goalValue && <FormError errors={errors.goalValue} />}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Ex: %, dias, R$"
          />
          {errors.unit && <FormError errors={errors.unit} />}
        </div>
      </div>
    </>
  );
}
