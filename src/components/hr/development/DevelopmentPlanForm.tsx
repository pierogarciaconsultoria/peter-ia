
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const developmentPlanSchema = z.object({
  employeeId: z.string().min(1, "Selecione um funcionário"),
  title: z.string().min(1, "Título é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  careerGoal: z.string().optional(),
  developmentAreas: z.string().min(1, "Áreas de desenvolvimento são obrigatórias"),
  actionItems: z.string().min(1, "Itens de ação são obrigatórios"),
});

type DevelopmentPlanFormData = z.infer<typeof developmentPlanSchema>;

interface DevelopmentPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function DevelopmentPlanForm({ isOpen, onClose, onSubmit }: DevelopmentPlanFormProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();
  
  const form = useForm<DevelopmentPlanFormData>({
    resolver: zodResolver(developmentPlanSchema),
    defaultValues: {
      title: "",
      careerGoal: "",
      developmentAreas: "",
      actionItems: "",
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active')
          .order('name');
          
        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const handleSubmit = (data: DevelopmentPlanFormData) => {
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate < startDate) {
        toast({
          title: "Erro",
          description: "Data de fim não pode ser anterior à data de início.",
          variant: "destructive"
        });
        return;
      }

      const requestData = {
        employee_id: data.employeeId,
        title: data.title,
        start_date: data.startDate,
        end_date: data.endDate,
        career_goal: data.careerGoal || null,
        development_areas: JSON.parse(data.developmentAreas || '[]'),
        action_items: JSON.parse(data.actionItems || '[]'),
        status: 'active' as const,
        progress: 0,
        creator_id: '', // This should be set from auth context
      };

      onSubmit(requestData);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting development plan:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar plano de desenvolvimento.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Plano de Desenvolvimento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desenvolvimento em Liderança" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="careerGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo de Carreira (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tornar-se gerente de equipe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="developmentAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Áreas de Desenvolvimento (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='["Liderança", "Comunicação", "Gestão de projetos"]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Itens de Ação (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='[{"action": "Curso de liderança", "deadline": "2024-06-30"}]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Plano
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
