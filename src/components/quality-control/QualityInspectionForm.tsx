
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QualityCriteria, QualityCriteriaResult, createQualityInspection, getQualityCriteria } from "@/services/qualityControlService";
import { Loader2, Plus, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  product_name: z.string().min(2, { message: "O nome do produto é obrigatório" }),
  batch_number: z.string().min(1, { message: "O número do lote é obrigatório" }),
  inspection_date: z.string().min(1, { message: "A data de inspeção é obrigatória" }),
  inspector: z.string().min(2, { message: "O nome do inspetor é obrigatório" }),
  inspection_type: z.enum(["process", "final"], { message: "O tipo de inspeção é obrigatório" }),
  process_name: z.string().optional(),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QualityInspectionForm() {
  const [availableCriteria, setAvailableCriteria] = useState<QualityCriteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<QualityCriteriaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [criteriaLoading, setCriteriaLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inspection_date: new Date().toISOString().split('T')[0],
      inspection_type: "final",
    },
  });

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setCriteriaLoading(true);
        const criteria = await getQualityCriteria();
        setAvailableCriteria(criteria);
      } catch (error) {
        console.error("Error fetching criteria:", error);
        toast.error("Erro ao carregar critérios de qualidade");
      } finally {
        setCriteriaLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  const handleAddCriteria = (criteriaId: string) => {
    const selectedCriterion = availableCriteria.find(c => c.id === criteriaId);
    if (selectedCriterion && !selectedCriteria.some(c => c.criteria_id === criteriaId)) {
      setSelectedCriteria([...selectedCriteria, {
        criteria_id: selectedCriterion.id,
        criteria_name: selectedCriterion.name,
        expected_value: selectedCriterion.expected_value,
        actual_value: "",
        is_conforming: true,
        observation: ""
      }]);
    }
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = [...selectedCriteria];
    newCriteria.splice(index, 1);
    setSelectedCriteria(newCriteria);
  };

  const handleCriteriaChange = (index: number, field: keyof QualityCriteriaResult, value: any) => {
    const newCriteria = [...selectedCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setSelectedCriteria(newCriteria);
  };

  const onSubmit = async (values: FormValues) => {
    if (selectedCriteria.length === 0) {
      toast.error("Adicione pelo menos um critério de qualidade");
      return;
    }

    // Check if all actual values are filled
    const missingValues = selectedCriteria.some(c => !c.actual_value.trim());
    if (missingValues) {
      toast.error("Preencha todos os valores obtidos nos critérios");
      return;
    }

    setSubmitting(true);
    try {
      // Determine overall status based on criteria
      const hasNonConforming = selectedCriteria.some(c => !c.is_conforming);
      const status = hasNonConforming ? "rejected" : "approved";

      await createQualityInspection({
        ...values,
        status,
        criteria_results: selectedCriteria
      });

      toast.success("Inspeção registrada com sucesso");
      form.reset();
      setSelectedCriteria([]);
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error("Erro ao registrar inspeção");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Inspeção de Qualidade</CardTitle>
          <CardDescription>
            Registre uma nova inspeção de qualidade para produtos ou processos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batch_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Lote</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número do lote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspection_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Inspeção</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspetor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do inspetor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspection_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Inspeção</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="process" id="inspection-process" />
                            <FormLabel htmlFor="inspection-process" className="font-normal">
                              Inspeção de Processo
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="final" id="inspection-final" />
                            <FormLabel htmlFor="inspection-final" className="font-normal">
                              Inspeção Final
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("inspection_type") === "process" && (
                  <FormField
                    control={form.control}
                    name="process_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Processo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome do processo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Critérios de Qualidade</h3>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Select onValueChange={handleAddCriteria} disabled={criteriaLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder={criteriaLoading ? "Carregando critérios..." : "Selecione um critério para adicionar"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCriteria.map((criteria) => (
                            <SelectItem key={criteria.id} value={criteria.id}>
                              {criteria.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="outline" onClick={() => form.setValue("inspection_type", form.watch("inspection_type"))}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                  </div>
                </div>

                {selectedCriteria.length === 0 ? (
                  <Alert className="bg-muted">
                    <AlertTitle>Nenhum critério selecionado</AlertTitle>
                    <AlertDescription>
                      Selecione pelo menos um critério de qualidade para avaliar
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {selectedCriteria.map((criteria, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{criteria.criteria_name}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCriteria(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FormLabel>Valor Esperado</FormLabel>
                              <Input value={criteria.expected_value} readOnly className="bg-muted" />
                            </div>
                            <div>
                              <FormLabel>Valor Obtido</FormLabel>
                              <Input
                                value={criteria.actual_value}
                                onChange={(e) => handleCriteriaChange(index, "actual_value", e.target.value)}
                                placeholder="Digite o valor obtido"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <FormLabel>Status</FormLabel>
                            <RadioGroup
                              value={criteria.is_conforming ? "conforming" : "non_conforming"}
                              onValueChange={(value) => handleCriteriaChange(index, "is_conforming", value === "conforming")}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="conforming" id={`conforming-${index}`} />
                                <FormLabel htmlFor={`conforming-${index}`} className="font-normal">
                                  Conforme
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="non_conforming" id={`non-conforming-${index}`} />
                                <FormLabel htmlFor={`non-conforming-${index}`} className="font-normal">
                                  Não Conforme
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </div>
                          {!criteria.is_conforming && (
                            <div className="mt-4">
                              <FormLabel>Observação</FormLabel>
                              <Textarea
                                value={criteria.observation || ""}
                                onChange={(e) => handleCriteriaChange(index, "observation", e.target.value)}
                                placeholder="Descreva o motivo da não conformidade"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite observações adicionais sobre a inspeção"
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Inspeção
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
