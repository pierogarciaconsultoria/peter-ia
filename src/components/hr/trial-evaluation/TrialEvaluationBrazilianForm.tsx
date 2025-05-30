
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TrialEvaluationWithEmployee, EvaluationCriterion, TrialEvaluationConfig } from "@/services/trialEvaluationService";

interface TrialEvaluationBrazilianFormProps {
  evaluation: TrialEvaluationWithEmployee;
  config: TrialEvaluationConfig;
  onSave: (data: any) => Promise<boolean>;
  onCancel: () => void;
  mode: 'evaluate' | 'view';
}

export function TrialEvaluationBrazilianForm({
  evaluation,
  config,
  onSave,
  onCancel,
  mode
}: TrialEvaluationBrazilianFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      sector: evaluation.sector || evaluation.employee.sector || '',
      immediate_supervisor_name: evaluation.immediate_supervisor_name || '',
      evaluation_criteria_scores: evaluation.evaluation_criteria_scores || {},
      final_decision: evaluation.final_decision || 'approved',
      decision_justification: evaluation.decision_justification || '',
      comments: evaluation.comments || ''
    }
  });

  const criteriaScores = form.watch('evaluation_criteria_scores');

  // Calcular média dos critérios
  const calculateAverage = () => {
    const scores = Object.values(criteriaScores).filter(score => typeof score === 'number') as number[];
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const handleCriteriaChange = (criterionName: string, score: number) => {
    const currentScores = form.getValues('evaluation_criteria_scores');
    form.setValue('evaluation_criteria_scores', {
      ...currentScores,
      [criterionName]: score
    });
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const average = calculateAverage();
      const updateData = {
        ...data,
        performance_score: Math.round(average * 25), // Converter escala 1-4 para 0-100
        supervisor_signature_date: new Date().toISOString(),
        approved: data.final_decision === 'approved'
      };

      const success = await onSave(updateData);
      if (success) {
        toast({
          title: "Avaliação salva",
          description: "A avaliação foi salva com sucesso."
        });
        onCancel();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar avaliação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avaliação de Período de Experiência</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Informações do Funcionário */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome do Funcionário</Label>
                  <p className="text-sm">{evaluation.employee.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cargo</Label>
                  <p className="text-sm">{evaluation.employee.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Admissão</Label>
                  <p className="text-sm">{new Date(evaluation.employee.hire_date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <Separator />

              {/* Setor e Superior Imediato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === 'view'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immediate_supervisor_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superior Imediato</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === 'view'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Critérios de Avaliação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Critérios de Avaliação</h3>
                <p className="text-sm text-muted-foreground">
                  Escala: {config.scale_min} (Insuficiente) a {config.scale_max} (Excelente)
                </p>
                
                <div className="grid gap-4">
                  {config.evaluation_criteria.map((criterion: EvaluationCriterion) => (
                    <Card key={criterion.name} className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">{criterion.name}</h4>
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        </div>
                        
                        <RadioGroup
                          value={criteriaScores[criterion.name]?.toString() || ""}
                          onValueChange={(value) => handleCriteriaChange(criterion.name, parseInt(value))}
                          className="flex gap-6"
                          disabled={mode === 'view'}
                        >
                          {Array.from({ length: config.scale_max - config.scale_min + 1 }, (_, i) => {
                            const score = config.scale_min + i;
                            return (
                              <div key={score} className="flex items-center space-x-2">
                                <RadioGroupItem value={score.toString()} id={`${criterion.name}-${score}`} />
                                <Label htmlFor={`${criterion.name}-${score}`}>{score}</Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Média Calculada */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Média Geral:</span>
                    <span className="text-xl font-bold">
                      {calculateAverage().toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Decisão Final */}
              <FormField
                control={form.control}
                name="final_decision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decisão Final</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6"
                        disabled={mode === 'view'}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approved" id="approved" />
                          <Label htmlFor="approved">Aprovado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rejected" id="rejected" />
                          <Label htmlFor="rejected">Não Aprovado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="extended" id="extended" />
                          <Label htmlFor="extended">Prorrogado</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Justificativa */}
              <FormField
                control={form.control}
                name="decision_justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa da Decisão</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        disabled={mode === 'view'}
                        placeholder="Descreva os motivos que levaram a esta decisão..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comentários */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        disabled={mode === 'view'}
                        placeholder="Observações adicionais sobre o desempenho do funcionário..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Informações de Avaliação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium">Período de Avaliação</Label>
                  <p className="text-sm">{evaluation.evaluation_period_number}º de {evaluation.total_evaluation_periods}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data da Avaliação</Label>
                  <p className="text-sm">{new Date(evaluation.evaluation_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm">{evaluation.evaluation_type.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Botões */}
              {mode === 'evaluate' && (
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Avaliação"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
