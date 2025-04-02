
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";

interface Dependent {
  name: string;
  relationship: string;
  phone: string;
  birthDate: Date | null;
}

interface FamilyInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function FamilyInfoTab({ formData, setFormData }: FamilyInfoTabProps) {
  // Define os tipos de parentesco disponíveis
  const relationshipTypes = [
    "Filho(a)",
    "Mãe",
    "Pai",
    "Irmão(ã)",
    "Avô(ó)",
    "Tio(a)",
    "Sobrinho(a)",
    "Cônjuge",
    "Outro"
  ];

  // Calcula a idade com base na data de nascimento
  const calculateAge = (birthDate: Date | null): number | null => {
    if (!birthDate) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const handleAddDependent = () => {
    setFormData((prev: any) => ({
      ...prev,
      dependents: [
        ...prev.dependents, 
        { 
          name: "", 
          relationship: "", 
          phone: "", 
          birthDate: null 
        }
      ],
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
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Dependentes e Familiares</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDependent}
          >
            Adicionar Dependente
          </Button>
        </div>

        {formData.dependents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dependente ou familiar cadastrado
          </div>
        ) : (
          formData.dependents.map((dependent: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-6 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0"
            >
              {/* Nome do Dependente */}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor={`dependent-name-${index}`}>
                  Nome Completo*
                </Label>
                <Input
                  id={`dependent-name-${index}`}
                  value={dependent.name}
                  onChange={(e) =>
                    handleDependentChange(index, "name", e.target.value)
                  }
                  placeholder="Nome do dependente"
                  required
                />
              </div>

              {/* Grau de Parentesco */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`dependent-relationship-${index}`}>
                  Grau de Parentesco*
                </Label>
                <Select
                  value={dependent.relationship}
                  onValueChange={(value) =>
                    handleDependentChange(index, "relationship", value)
                  }
                >
                  <SelectTrigger id={`dependent-relationship-${index}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Telefone */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`dependent-phone-${index}`}>
                  Telefone
                </Label>
                <Input
                  id={`dependent-phone-${index}`}
                  value={dependent.phone}
                  onChange={(e) =>
                    handleDependentChange(index, "phone", e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2 md:col-span-2">
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

              {/* Idade Calculada */}
              <div className="space-y-2 md:col-span-1">
                <Label>Idade</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm opacity-70">
                  {calculateAge(dependent.birthDate) !== null
                    ? `${calculateAge(dependent.birthDate)} anos`
                    : "-"}
                </div>
              </div>

              {/* Botão Remover */}
              <div className="flex items-end md:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDependent(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
