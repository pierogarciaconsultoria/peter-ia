
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { QualityCriteria, companySegments, createQualityCriteria, criteriaCategories, updateQualityCriteria } from "@/services/qualityControlService";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  description: z.string().min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
  expected_value: z.string().min(1, { message: "O valor esperado é obrigatório" }),
  tolerance: z.string().optional(),
  measurement_unit: z.string().optional(),
  company_segment: z.string().min(1, { message: "O segmento da empresa é obrigatório" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface QualityCriteriaFormProps {
  criteria?: QualityCriteria | null;
  onClose: () => void;
}

export function QualityCriteriaForm({ criteria, onClose }: QualityCriteriaFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const defaultValues: Partial<FormValues> = {
    name: criteria?.name || "",
    description: criteria?.description || "",
    expected_value: criteria?.expected_value || "",
    tolerance: criteria?.tolerance || "",
    measurement_unit: criteria?.measurement_unit || "",
    company_segment: criteria?.company_segment || "",
    category: criteria?.category || "",
    is_active: criteria?.is_active ?? true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (criteria) {
        await updateQualityCriteria(criteria.id, values);
        toast({
          title: "Critério atualizado",
          description: "O critério foi atualizado com sucesso.",
        });
      } else {
        await createQualityCriteria(values);
        toast({
          title: "Critério criado",
          description: "O critério foi criado com sucesso.",
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving criteria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o critério de qualidade.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Critério</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Espessura do Material" {...field} />
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
                  placeholder="Descreva o critério de qualidade"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expected_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Esperado</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 10mm" {...field} />
                </FormControl>
                <FormDescription>
                  Valor ou condição esperada para aprovação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tolerância</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ±0.5mm" {...field} />
                </FormControl>
                <FormDescription>
                  Tolerância aceitável (se aplicável)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measurement_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade de Medida</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: mm, cm, kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ativo</FormLabel>
                  <FormDescription>
                    Este critério estará disponível para inspeções
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segmento da Empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySegments.map((segment) => (
                      <SelectItem key={segment.value} value={segment.value}>
                        {segment.label}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {criteriaCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {criteria ? "Atualizar" : "Criar"} Critério
          </Button>
        </div>
      </form>
    </Form>
  );
}
