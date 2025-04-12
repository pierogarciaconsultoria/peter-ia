
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Supplier, Evaluation, EvaluationCriteria } from '@/types/supplierEvaluation';

interface SupplierEvaluationFormProps {
  supplier?: Supplier;
  onSubmit: (data: Partial<Evaluation>) => void;
  onCancel: () => void;
}

const defaultCriteria: EvaluationCriteria[] = [
  { id: '1', name: 'Qualidade do produto/serviço', score: 0, weight: 0.3 },
  { id: '2', name: 'Prazo de entrega', score: 0, weight: 0.2 },
  { id: '3', name: 'Preço', score: 0, weight: 0.15 },
  { id: '4', name: 'Atendimento', score: 0, weight: 0.15 },
  { id: '5', name: 'Conformidade técnica', score: 0, weight: 0.2 },
];

export const SupplierEvaluationForm: React.FC<SupplierEvaluationFormProps> = ({ 
  supplier, 
  onSubmit, 
  onCancel 
}) => {
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(defaultCriteria);
  const [comments, setComments] = useState<string>('');
  const [evaluator, setEvaluator] = useState<string>('');

  const handleScoreChange = (id: string, newScore: number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, score: newScore } : c
    ));
  };

  const calculateTotalScore = (): number => {
    return criteria.reduce((total, c) => {
      return total + (c.score * c.weight);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const evaluation: Partial<Evaluation> = {
      supplierId: supplier?.id,
      evaluationDate: new Date().toISOString(),
      score: parseFloat(calculateTotalScore().toFixed(2)),
      criteria: criteria,
      comments: comments,
      evaluator: evaluator
    };

    onSubmit(evaluation);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {supplier && (
          <div className="mb-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold text-lg">{supplier.name}</h3>
            <p className="text-sm text-muted-foreground">Categoria: {supplier.category}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Critérios de Avaliação</CardTitle>
            <CardDescription>
              Avalie o fornecedor de acordo com cada critério abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-base">{criterion.name}</Label>
                    <span className="font-bold">{criterion.score}/10</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      defaultValue={[criterion.score]}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => handleScoreChange(criterion.id, value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-20">
                      Peso: {(criterion.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Pontuação Total:</span>
                  <span className="font-bold text-lg">
                    {calculateTotalScore().toFixed(2)}/10
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações e Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="evaluator">Avaliador</Label>
                <Input 
                  id="evaluator" 
                  value={evaluator} 
                  onChange={(e) => setEvaluator(e.target.value)} 
                  placeholder="Nome do responsável pela avaliação"
                  required
                />
              </div>
              <div>
                <Label htmlFor="comments">Observações</Label>
                <Textarea 
                  id="comments" 
                  value={comments} 
                  onChange={(e) => setComments(e.target.value)} 
                  placeholder="Observações adicionais sobre a avaliação..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Avaliação
          </Button>
        </div>
      </div>
    </form>
  );
};
