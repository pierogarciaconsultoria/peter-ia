
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues, RequestStatus } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import React from "react";

interface SignatureSectionProps {
  form: UseFormReturn<RequestFormValues>;
}

export function SignatureSection({ form }: SignatureSectionProps) {
  // Create a hardcoded value for display only
  const statusValue = form.getValues("status") || "new";

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

      {/* Status Section - Just show the current status as text */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Status da solicitação</div>
        <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
          {(() => {
            switch (statusValue) {
              case "approved": return "Aprovado";
              case "rejected": return "Reprovado";
              case "canceled": return "Cancelado";
              case "manager_approval": return "Aguardando aprovação do gestor";
              case "in_analysis": return "Em análise";
              case "in_approval": return "Em aprovação";
              case "new": return "Nova solicitação";
              case "pending":
              default:
                return "Pendente";
            }
          })()}
        </div>
      </div>

      {/* Rejection/Cancellation Reason */}
      {(statusValue === "rejected" || statusValue === "canceled") && (
        <FormField
          control={form.control}
          name="rejection_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {statusValue === "rejected" ? "Motivo da reprovação" : "Motivo do cancelamento"}
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
      {(statusValue === "approved" || statusValue === "new" || statusValue === "in_analysis" || statusValue === "in_approval" || statusValue === "pending") && (
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
