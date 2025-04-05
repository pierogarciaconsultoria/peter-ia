
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAction, updateAction } from "@/services/actionService";
import { useToast } from "@/hooks/use-toast";
import { Action5W2H } from "@/types/actions";
import { actionSchema, ActionFormValues, getDefaultValues } from "../schema/actionFormSchema";

interface UseActionFormProps {
  action?: Action5W2H;
  afterSubmit: () => void;
  onClose: () => void;
}

export function useActionForm({ action, afterSubmit, onClose }: UseActionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: getDefaultValues(action),
  });
  
  async function onSubmit(values: ActionFormValues) {
    setIsSubmitting(true);
    
    try {
      if (action?.id) {
        await updateAction(action.id, values as unknown as Partial<Action5W2H>);
        toast({
          title: "Ação atualizada",
          description: "A ação foi atualizada com sucesso",
        });
      } else {
        const newAction = {
          ...values,
          start_date: values.start_date,
          how_much: values.how_much,
          currency: values.currency || "BRL",
          comments: values.comments || ""
        };
        
        await createAction(newAction as unknown as Omit<Action5W2H, 'id' | 'created_at' | 'updated_at' | 'completed_at'>);
        toast({
          title: "Ação criada",
          description: "A ação foi criada com sucesso",
        });
      }
      
      afterSubmit();
      onClose();
    } catch (error) {
      console.error("Error saving action:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a ação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
