
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { QualityInspection } from "@/services/qualityControlService";
import { createNonConformingProduct } from "@/services/nonConformingProductService";
import { Loader2 } from "lucide-react";

interface NonConformityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: QualityInspection | null;
}

const formSchema = z.object({
  product_name: z.string().min(1, { message: "Nome do produto é obrigatório" }),
  description: z.string().min(5, { message: "Descrição é obrigatória" }),
  non_conformity_type: z.string().min(1, { message: "Tipo é obrigatório" }),
  department: z.string().min(1, { message: "Departamento é obrigatório" }),
  severity: z.enum(["low", "medium", "high", "critical"], { 
    message: "Severidade é obrigatória" 
  }),
  requirement_id: z.string().min(1, { message: "Requisito é obrigatório" }),
  immediate_action: z.string().min(5, { message: "Ação imediata é obrigatória" }),
  customer: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NonConformityDialog({ open, onOpenChange, inspection }: NonConformityDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<FormValues> = {
    product_name: inspection?.product_name || "",
    description: inspection ? `Não conformidade identificada na inspeção do lote ${inspection.batch_number}` : "",
    non_conformity_type: "",
    department: "",
    severity: "medium",
    requirement_id: "8.7",
    immediate_action: "",
    customer: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    if (!inspection) return;

    setSubmitting(true);
    try {
      // Map non-conforming criteria and add to description
      const nonConformingItems = inspection.criteria_results
        .filter(item => !item.is_conforming)
        .map(item => `- ${item.criteria_name}: esperado "${item.expected_value}", obtido "${item.actual_value}"${item.observation ? ` (${item.observation})` : ''}`);

      const fullDescription = values.description + "\n\nCritérios não conformes:\n" + nonConformingItems.join("\n");

      await createNonConformingProduct({
        ...values,
        description: fullDescription,
        status: "identified",
        approval_status: "pending",
      });

      toast.success("Produto não conforme registrado com sucesso");
      onOpenChange(false);
      form.reset(defaultValues);
    } catch (error) {
      console.error("Error creating non-conforming product:", error);
      toast.error("Erro ao registrar produto não conforme");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when inspection changes
  useState(() => {
    if (inspection) {
      form.reset({
        ...defaultValues,
        product_name: inspection.product_name,
        description: `Não conformidade identificada na inspeção do lote ${inspection.batch_number}`,
      });
    }
  });

  const nonConformityTypes = [
    { label: "Dimensional", value: "dimensional" },
    { label: "Visual", value: "visual" },
    { label: "Funcional", value: "functional" },
    { label: "Material", value: "material" },
    { label: "Documentação", value: "documentation" },
    { label: "Outro", value: "other" },
  ];

  const departments = [
    { label: "Produção", value: "production" },
    { label: "Qualidade", value: "quality" },
    { label: "Engenharia", value: "engineering" },
    { label: "Compras", value: "purchasing" },
    { label: "Logística", value: "logistics" },
    { label: "Outro", value: "other" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Produto Não Conforme</DialogTitle>
          <DialogDescription>
            Registre a não conformidade para acompanhamento e tratamento
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="non_conformity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Não Conformidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nonConformityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
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
                name="requirement_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisito Normativo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Severidade</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="severity-low" />
                        <FormLabel htmlFor="severity-low" className="font-normal">
                          Baixa
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="severity-medium" />
                        <FormLabel htmlFor="severity-medium" className="font-normal">
                          Média
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="severity-high" />
                        <FormLabel htmlFor="severity-high" className="font-normal">
                          Alta
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="severity-critical" />
                        <FormLabel htmlFor="severity-critical" className="font-normal">
                          Crítica
                        </FormLabel>
                      </div>
                    </RadioGroup>
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
                  <FormLabel>Descrição da Não Conformidade</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva detalhadamente a não conformidade"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="immediate_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Imediata</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a ação imediata tomada"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Não Conformidade
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
