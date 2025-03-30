
import { FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSectionProps } from "./types";

export const terminationTypes = [
  { id: "employeeInitiative", label: "Iniciativa do colaborador" },
  { id: "companyInitiative", label: "Iniciativa da empresa" }
];

export function TerminationSection({ form }: FormSectionProps) {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">DESLIGAMENTO</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {terminationTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`termination-${type.id}`}
                checked={form.watch("terminationType") === type.id}
                onCheckedChange={() => form.setValue("terminationType", type.id)}
              />
              <label 
                htmlFor={`termination-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="just-cause-no"
              checked={form.watch("justCause") === false}
              onCheckedChange={() => form.setValue("justCause", false)}
            />
            <label 
              htmlFor="just-cause-no"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sem justa causa
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="just-cause-yes"
              checked={form.watch("justCause") === true}
              onCheckedChange={() => form.setValue("justCause", true)}
            />
            <label 
              htmlFor="just-cause-yes"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Com justa causa
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <FormLabel>Cumpre o aviso prévio:</FormLabel>
        <RadioGroup
          value={form.watch("noticePeriod") ? "yes" : "no"}
          onValueChange={(value) => form.setValue("noticePeriod", value === "yes")}
          className="flex items-center space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="notice-yes" />
            <label htmlFor="notice-yes">Sim</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="notice-no" />
            <label htmlFor="notice-no">Não</label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
