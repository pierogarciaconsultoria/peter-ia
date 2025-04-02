
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

      {/* Status Section */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status da solicitação</FormLabel>
            <FormControl>
              <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
                {field.value || "Pendente"}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Rejection/Cancellation Reason */}
      {(form.watch("status") === "rejected" || form.watch("status") === "canceled") && (
        <FormField
          control={form.control}
          name="rejection_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("status") === "rejected" ? "Motivo da reprovação" : "Motivo do cancelamento"}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Justificativa para a reprovação ou cancelamento"
                  className="h-24 bg-gray-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* HR Observation Field (only visible when approved or in review) */}
      {(form.watch("status") === "approved" || form.watch("status") === "pending") && (
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
      )}
    </>
  );
}
