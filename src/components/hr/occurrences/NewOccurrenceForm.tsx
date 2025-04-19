
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OccurrenceFormValues } from "./types";

interface Employee {
  id: string;
  name: string;
  department: string;
}

interface NewOccurrenceFormProps {
  employees: Employee[];
  onSubmit: (data: OccurrenceFormValues) => void;
  onCancel: () => void;
}

export function NewOccurrenceForm({ employees, onSubmit, onCancel }: NewOccurrenceFormProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  const form = useForm<OccurrenceFormValues>({
    defaultValues: {
      registrationDate: today,
      occurrenceDate: today,
      type: 'observation',
      treatment: 'no_action'
    }
  });

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee || null);
    form.setValue('employeeId', employeeId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee Selection */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador</FormLabel>
              <Select onValueChange={handleEmployeeChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um colaborador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department Display */}
        {selectedEmployee && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Setor: {selectedEmployee.department}</p>
          </div>
        )}

        {/* Occurrence Date */}
        <FormField
          control={form.control}
          name="occurrenceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Ocorrência</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input type="date" {...field} />
                  <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Registration Date */}
        <FormField
          control={form.control}
          name="registrationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Registro</FormLabel>
              <FormControl>
                <Input type="date" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Occurrence Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ocorrência</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="verbal_warning">Advertência Verbal</SelectItem>
                  <SelectItem value="written_warning">Advertência Escrita</SelectItem>
                  <SelectItem value="suspension">Suspensão</SelectItem>
                  <SelectItem value="termination">Demissão</SelectItem>
                  <SelectItem value="observation">Observação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os fatos ocorridos..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Attachment */}
        <FormField
          control={form.control}
          name="attachment"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Anexo (Foto ou Áudio)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*,audio/*"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Treatment */}
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tratativa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tratativa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="warning">Advertência</SelectItem>
                  <SelectItem value="suspension">Suspensão</SelectItem>
                  <SelectItem value="termination">Demissão</SelectItem>
                  <SelectItem value="no_action">Sem Ação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Treatment Deadline */}
        <FormField
          control={form.control}
          name="treatmentDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo para Tratativa</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input type="date" {...field} />
                  <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Responsible Person */}
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do responsável" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Ocorrência
          </Button>
        </div>
      </form>
    </Form>
  );
}
