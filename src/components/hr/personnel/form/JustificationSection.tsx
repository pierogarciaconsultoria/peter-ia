
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormSectionProps } from "./types";

export function JustificationSection({ form }: FormSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="justification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Justificativas</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva a justificativa para esta solicitação" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="pt-2 border-t mt-4">
        <FormLabel>Parecer do Recursos Humanos</FormLabel>
        <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
          Este campo será preenchido pelo RH após análise da solicitação
        </div>
      </div>
    </>
  );
}
