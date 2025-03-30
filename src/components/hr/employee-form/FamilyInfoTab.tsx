
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FamilyInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function FamilyInfoTab({ formData, setFormData }: FamilyInfoTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddDependent = () => {
    setFormData((prev: any) => ({
      ...prev,
      dependents: [...prev.dependents, { name: "", birthDate: null }],
    }));
  };

  const handleRemoveDependent = (index: number) => {
    setFormData((prev: any) => {
      const newDependents = [...prev.dependents];
      newDependents.splice(index, 1);
      return { ...prev, dependents: newDependents };
    });
  };

  const handleDependentChange = (index: number, field: string, value: string | Date | null) => {
    setFormData((prev: any) => {
      const newDependents = [...prev.dependents];
      newDependents[index] = { ...newDependents[index], [field]: value };
      return { ...prev, dependents: newDependents };
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spouse">Cônjuge</Label>
        <Input
          id="spouse"
          name="spouse"
          value={formData.spouse}
          onChange={handleInputChange}
          placeholder="Nome do cônjuge (se houver)"
        />
      </div>

      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Dependentes</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDependent}
          >
            Adicionar Dependente
          </Button>
        </div>

        {formData.dependents.map((dependent: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`dependent-name-${index}`}>
                Nome do Dependente
              </Label>
              <Input
                id={`dependent-name-${index}`}
                value={dependent.name}
                onChange={(e) =>
                  handleDependentChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dependent.birthDate && "text-muted-foreground"
                    )}
                  >
                    {dependent.birthDate ? (
                      format(dependent.birthDate, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dependent.birthDate || undefined}
                    onSelect={(date) =>
                      handleDependentChange(index, "birthDate", date)
                    }
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveDependent(index)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
