
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";
import { JobPosition } from "../types";
import { RequestFormValues } from "./types";

interface RequestFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormValues) => void;
  jobPositions: JobPosition[];
}

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, jobPositions }: RequestFormDialogProps) {
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position: "",
      justification: "",
      targetDate: ""
    }
  });
  
  // Get unique departments from job positions
  const departments = Array.from(new Set(jobPositions.map(job => job.department)));
  
  // Filter job positions by selected department
  const filteredPositions = jobPositions.filter(
    job => !form.watch("department") || job.department === form.watch("department")
  );
  
  // Handle department selection to filter job positions
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    form.setValue("position", ""); // Reset position when department changes
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Movimentação</DialogTitle>
          <DialogDescription>
            Preencha os dados para solicitar uma movimentação de pessoal
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hiring">Contratação</SelectItem>
                      <SelectItem value="transfer">Transferência</SelectItem>
                      <SelectItem value="termination">Desligamento</SelectItem>
                      <SelectItem value="salary_change">Alteração Salarial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select 
                    onValueChange={(value) => handleDepartmentChange(value)} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title} - {position.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value && jobPositions.find(p => p.id === field.value)?.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativa</FormLabel>
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
            
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Desejada</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                      <Input type="date" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Data pretendida para a efetivação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
