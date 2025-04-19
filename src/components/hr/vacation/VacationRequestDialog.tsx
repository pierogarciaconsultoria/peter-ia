
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { calculateVacationPeriods } from "@/utils/vacationCalculations";

interface VacationRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onSubmit: (data: VacationRequest) => void;
}

interface VacationRequest {
  employeeId: string;
  startDate: string;
  endDate: string;
  periodStart: string;
  periodEnd: string;
  daysRequested: number;
  type: "regular" | "proportional";
}

export function VacationRequestDialog({ isOpen, onClose, employee, onSubmit }: VacationRequestDialogProps) {
  const { toast } = useToast();
  const form = useForm<VacationRequest>();

  React.useEffect(() => {
    if (employee) {
      const vacationPeriods = calculateVacationPeriods(new Date(employee.hire_date));
      // Find the next available vacation period
      const availablePeriod = vacationPeriods.find(p => p.status === "pending" && !p.isExpiring);
      
      if (availablePeriod) {
        form.reset({
          employeeId: employee.id,
          periodStart: availablePeriod.startDate.toISOString().split('T')[0],
          periodEnd: availablePeriod.endDate.toISOString().split('T')[0],
          type: availablePeriod.type,
          daysRequested: 30, // Default to full period
        });
      }
    }
  }, [employee]);

  const handleSubmit = (data: VacationRequest) => {
    // Validate vacation rules
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 10) {
      toast({
        title: "Erro",
        description: "O período mínimo de férias é de 10 dias corridos.",
        variant: "destructive"
      });
      return;
    }

    if (daysDiff > 30) {
      toast({
        title: "Erro",
        description: "O período máximo de férias é de 30 dias corridos.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Férias</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quantidade de dias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="20">20 dias</SelectItem>
                      <SelectItem value="15">15 dias</SelectItem>
                      <SelectItem value="10">10 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {employee && (
              <div className="bg-muted/20 p-4 rounded-md space-y-2">
                <p><span className="font-medium">Colaborador:</span> {employee.name}</p>
                <p><span className="font-medium">Data de Admissão:</span> {new Date(employee.hire_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Período Aquisitivo:</span> {form.getValues().periodStart} a {form.getValues().periodEnd}</p>
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
