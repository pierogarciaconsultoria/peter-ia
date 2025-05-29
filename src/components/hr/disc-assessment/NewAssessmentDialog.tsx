
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDiscAssessments } from "@/hooks/useDiscAssessments";

const assessmentLinkSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  entityType: z.enum(["employee", "candidate"]),
  entityId: z.string().min(1, "Selecione um funcionário ou candidato"),
});

type AssessmentLinkFormData = z.infer<typeof assessmentLinkSchema>;

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewAssessmentDialog({ isOpen, onOpenChange, onSuccess }: NewAssessmentDialogProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const { toast } = useToast();
  const { createEvaluationLink } = useDiscAssessments();
  
  const form = useForm<AssessmentLinkFormData>({
    resolver: zodResolver(assessmentLinkSchema),
    defaultValues: {
      entityType: "employee",
    },
  });

  const entityType = form.watch("entityType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const { data: empData, error: empError } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active')
          .order('name');
          
        if (empError) throw empError;
        setEmployees(empData || []);

        // Fetch candidates
        const { data: candData, error: candError } = await supabase
          .from('hr_candidates')
          .select('*')
          .eq('is_available', true)
          .order('first_name');
          
        if (candError) throw candError;
        setCandidates(candData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (data: AssessmentLinkFormData) => {
    try {
      await createEvaluationLink({
        name: data.name,
        email: data.email,
        entity_type: data.entityType,
        entity_id: data.entityId,
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating assessment link:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar link de avaliação.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Link de Avaliação DISC</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="candidate">Candidato</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {entityType === "employee" ? "Funcionário" : "Candidato"}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione o ${entityType === "employee" ? "funcionário" : "candidato"}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entityType === "employee" 
                        ? employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name} - {emp.department}
                            </SelectItem>
                          ))
                        : candidates.map((cand) => (
                            <SelectItem key={cand.id} value={cand.id}>
                              {cand.first_name} {cand.last_name} - {cand.email}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da pessoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Link
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
