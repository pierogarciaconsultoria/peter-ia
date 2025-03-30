
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeSelector } from "./EmployeeSelector";
import { Department } from "@/hooks/useDepartments";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  sector: z.string().optional(),
  responsible_employee_id: z.string().nullable().optional(),
  approved_headcount: z.coerce.number().int().min(0, "Não pode ser negativo").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: FormValues) => void;
  department: Department | null;
}

export function DepartmentFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  department,
}: DepartmentFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sector: "",
      responsible_employee_id: null,
      approved_headcount: 0,
    },
  });

  // Reset form when department changes
  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        description: department.description || "",
        sector: department.sector || "",
        responsible_employee_id: department.responsible_employee_id,
        approved_headcount: department.approved_headcount || 0,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        sector: "",
        responsible_employee_id: null,
        approved_headcount: 0,
      });
    }
  }, [department, form]);

  const handleSubmit = (values: FormValues) => {
    onSave(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Editar Departamento" : "Novo Departamento"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Atualize os dados do departamento"
              : "Preencha as informações para criar um novo departamento"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do departamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input placeholder="Setor da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a função ou objetivo do departamento"
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
              name="approved_headcount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quadro Aprovado</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="Quantidade de posições aprovadas" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsible_employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <EmployeeSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
