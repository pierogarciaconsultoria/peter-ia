
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TrialEvaluationConfig, getTrialEvaluationConfig, upsertTrialEvaluationConfig } from "@/services/trialEvaluationService";

interface TrialEvaluationConfigProps {
  companyId: string;
  onSave?: () => void;
}

interface FormData {
  evaluation_periods: { value: number }[];
  evaluation_criteria: { name: string; description: string; }[];
  scale_min: number;
  scale_max: number;
}

export function TrialEvaluationConfigComponent({ companyId, onSave }: TrialEvaluationConfigProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      evaluation_periods: [{ value: 30 }, { value: 90 }],
      evaluation_criteria: [
        { name: "Assiduidade", description: "Comparecimento regular ao trabalho" },
        { name: "Pontualidade", description: "Cumprimento de horários estabelecidos" },
        { name: "Responsabilidade", description: "Cuidado com equipamentos e materiais" },
        { name: "Urbanidade", description: "Bom relacionamento com colegas e superiores" },
        { name: "Capacidade de Aprendizagem", description: "Facilidade para assimilar conhecimentos" },
        { name: "Produtividade", description: "Quantidade de trabalho executado" },
        { name: "Qualidade do Trabalho", description: "Padrão de qualidade mantido" },
        { name: "Iniciativa", description: "Capacidade de agir por conta própria" },
        { name: "Disciplina", description: "Cumprimento de normas e regulamentos" }
      ],
      scale_min: 1,
      scale_max: 4
    }
  });

  const { fields: criteriaFields, append: appendCriterion, remove: removeCriterion } = useFieldArray({
    control: form.control,
    name: "evaluation_criteria"
  });

  const { fields: periodFields, append: appendPeriod, remove: removePeriod } = useFieldArray({
    control: form.control,
    name: "evaluation_periods"
  });

  useEffect(() => {
    loadConfig();
  }, [companyId]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const config = await getTrialEvaluationConfig(companyId);
      if (config) {
        form.reset({
          evaluation_periods: config.evaluation_periods.map(period => ({ value: period })),
          evaluation_criteria: config.evaluation_criteria,
          scale_min: config.scale_min,
          scale_max: config.scale_max
        });
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      const success = await upsertTrialEvaluationConfig({
        company_id: companyId,
        evaluation_periods: data.evaluation_periods.map(period => period.value),
        evaluation_criteria: data.evaluation_criteria,
        scale_min: data.scale_min,
        scale_max: data.scale_max
      });

      if (success) {
        toast({
          title: "Configuração salva",
          description: "As configurações de avaliação foram salvas com sucesso."
        });
        onSave?.();
      } else {
        throw new Error("Falha ao salvar configuração");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração de Avaliações de Experiência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Períodos de Avaliação */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Períodos de Avaliação (em dias)</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPeriod({ value: 30 })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Período
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {periodFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`evaluation_periods.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePeriod(index)}
                        disabled={periodFields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline">Exemplo: 30, 90 = Avaliação aos 30 e 90 dias</Badge>
                  <Badge variant="outline">Exemplo: 30, 30, 30 = Avaliação aos 30, 60 e 90 dias</Badge>
                </div>
              </div>

              {/* Escala de Avaliação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scale_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nota Mínima</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scale_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nota Máxima</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="2" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Critérios de Avaliação */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Critérios de Avaliação</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCriterion({ name: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Critério
                  </Button>
                </div>

                <div className="space-y-3">
                  {criteriaFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`evaluation_criteria.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Critério</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: Assiduidade" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`evaluation_criteria.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: Comparecimento regular ao trabalho" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCriterion(index)}
                          disabled={criteriaFields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
