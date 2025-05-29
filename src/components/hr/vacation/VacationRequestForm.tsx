
import React from "react";
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
import { calculateVacationPeriods } from "@/utils/vacationCalculations";

const vacationRequestSchema = z.object({
  employeeId: z.string().min(1, "Selecione um funcionário"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  daysRequested: z.coerce.number().min(10, "Mínimo de 10 dias").max(30, "Máximo de 30 dias"),
  vacationType: z.enum(["regular", "proportional"]),
  justification: z.string().optional(),
});

type VacationRequestFormData = z.infer<typeof vacationRequestSchema>;

interface VacationRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  employees: any[];
  onSubmit: (data: any) => void;
}

export function VacationRequestForm({ isOpen, onClose, employees, onSubmit }: VacationRequestFormProps) {
  const { toast } = useToast();
  const form = useForm<VacationRequestFormData>({
    resolver: zodResolver(vacationRequestSchema),
    defaultValues: {
      vacationType: "regular",
      daysRequested: 30,
    },
  });

  const selectedEmployee = form.watch("employeeId");
  const employee = employees.find(emp => emp.id === selectedEmployee);

  const handleSubmit = (data: VacationRequestFormData) => {
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (daysDiff !== data.daysRequested) {
        toast({
          title: "Erro",
          description: "A quantidade de dias não confere com o período selecionado.",
          variant: "destructive"
        });
        return;
      }

      if (employee) {
        const vacationPeriods = calculateVacationPeriods(new Date(employee.hire_date));
        const availablePeriod = vacationPeriods.find(p => p.status === "pending" && !p.isExpiring);
        
        if (!availablePeriod) {
          toast({
            title: "Erro",
            description: "Funcionário não possui período aquisitivo disponível.",
            variant: "destructive"
          });
          return;
        }

        const requestData = {
          employee_id: data.employeeId,
          start_date: data.startDate,
          end_date: data.endDate,
          days_requested: data.daysRequested,
          vacation_period_start: availablePeriod.startDate.toISOString().split('T')[0],
          vacation_period_end: availablePeriod.endDate.toISOString().split('T')[0],
          vacation_type: data.vacationType,
          justification: data.justification,
        };

        onSubmit(requestData);
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar solicitação de férias.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Férias</DialogTitle>
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

            <FormField
              control={form.control}
              name="daysRequested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Dias</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a quantidade de dias" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="20">20 dias</SelectItem>
                      <SelectItem value="15">15 dias</SelectItem>
                      <SelectItem value="10">10 dias</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vacationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Férias</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="regular">Regulares</SelectItem>
                      <SelectItem value="proportional">Proporcionais</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativa (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Justificativa para as férias..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {employee && (
              <div className="bg-muted/20 p-4 rounded-md space-y-2">
                <p><span className="font-medium">Colaborador:</span> {employee.name}</p>
                <p><span className="font-medium">Data de Admissão:</span> {new Date(employee.hire_date).toLocaleDateString('pt-BR')}</p>
                <p><span className="font-medium">Departamento:</span> {employee.department}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Solicitar Férias
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
