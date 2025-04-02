
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
    </>
  );
}
