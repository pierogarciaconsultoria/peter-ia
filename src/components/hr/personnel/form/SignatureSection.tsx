
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SignatureSectionProps {
  form: UseFormReturn<RequestFormValues>;
}

export function SignatureSection({ form }: SignatureSectionProps) {
  return (
    <>
      {/* HR Observation Field */}
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="hr_observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parecer do Recursos Humanos</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Este campo será preenchido pelo RH após análise da solicitação"
                  className="h-24 bg-gray-50"
                  readOnly
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Approval Status Indicator */}
      <Alert variant="default" className="bg-gray-50 border-muted">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Esta solicitação passará pelos seguintes fluxos de aprovação:
          <ol className="list-decimal ml-5 mt-2 text-xs space-y-1">
            <li>Aprovação pelo superior imediato do requisitante</li>
            <li>Aprovação pelo departamento de Recursos Humanos</li>
          </ol>
        </AlertDescription>
      </Alert>
    </>
  );
}
