
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  QualityCriteria, 
  QualityCriteriaResult, 
  QualityInspection,
  getQualityCriteria, 
  createQualityInspection 
} from "@/services/qualityControlService";
import { useToast } from "@/hooks/use-toast";

export function QualityInspectionForm() {
  const [productName, setProductName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().substring(0, 10));
  const [inspector, setInspector] = useState("");
  const [inspectionType, setInspectionType] = useState<"process" | "final">("final");
  const [processName, setProcessName] = useState("");
  const [observations, setObservations] = useState("");
  const [criteria, setCriteria] = useState<QualityCriteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [criteriaResults, setCriteriaResults] = useState<QualityCriteriaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const data = await getQualityCriteria();
        setCriteria(data.filter(c => c.is_active));
      } catch (error) {
        console.error("Failed to fetch criteria:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar critérios",
          description: "Não foi possível carregar os critérios de qualidade."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [toast]);

  useEffect(() => {
    // Update criteria results when selected criteria changes
    const results = selectedCriteria
      .map(id => {
        const criterion = criteria.find(c => c.id === id);
        if (!criterion) return null;

        // Check if we already have a result for this criteria
        const existingResult = criteriaResults.find(r => r.criteria_id === id);
        if (existingResult) return existingResult;

        return {
          criteria_id: id,
          criteria_name: criterion.name,
          expected_value: criterion.expected_value,
          actual_value: "",
          is_conforming: true,
          observation: ""
        };
      })
      .filter((r): r is QualityCriteriaResult => r !== null);

    setCriteriaResults(results);
  }, [selectedCriteria, criteria]);

  const handleCriteriaChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCriteria(prev => [...prev, id]);
    } else {
      setSelectedCriteria(prev => prev.filter(c => c !== id));
      setCriteriaResults(prev => prev.filter(r => r.criteria_id !== id));
    }
  };

  const updateCriteriaResult = (id: string, updates: Partial<QualityCriteriaResult>) => {
    setCriteriaResults(prev => prev.map(result => 
      result.criteria_id === id ? { ...result, ...updates } : result
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (criteriaResults.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum critério selecionado",
        description: "Por favor, selecione pelo menos um critério para inspeção."
      });
      return;
    }

    setSubmitLoading(true);

    try {
      // Determine status based on criteria results
      const hasNonConforming = criteriaResults.some(result => !result.is_conforming);
      const status = hasNonConforming ? "rejected" as const : "approved" as const;

      // Create inspection data
      const inspectionData = {
        product_name: productName,
        batch_number: batchNumber,
        inspection_date: inspectionDate,
        inspector,
        inspection_type: inspectionType,
        process_name: inspectionType === "process" ? processName : undefined,
        criteria_results: criteriaResults,
        status,
        observations
      };

      await createQualityInspection(inspectionData);

      toast({
        title: "Inspeção registrada",
        description: "A inspeção de qualidade foi registrada com sucesso."
      });

      // Reset form
      setProductName("");
      setBatchNumber("");
      setInspectionDate(new Date().toISOString().substring(0, 10));
      setInspector("");
      setInspectionType("final");
      setProcessName("");
      setObservations("");
      setSelectedCriteria([]);
      setCriteriaResults([]);
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar inspeção",
        description: "Ocorreu um erro ao tentar registrar a inspeção de qualidade."
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Inspeção de Qualidade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Gerais</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Input 
                  id="product" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">Número do Lote</Label>
                <Input 
                  id="batch" 
                  value={batchNumber} 
                  onChange={(e) => setBatchNumber(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Inspeção</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={inspectionDate} 
                  onChange={(e) => setInspectionDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspector">Inspetor</Label>
                <Input 
                  id="inspector" 
                  value={inspector} 
                  onChange={(e) => setInspector(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Inspeção</Label>
              <RadioGroup 
                value={inspectionType} 
                onValueChange={(value: "process" | "final") => setInspectionType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="final" id="final" />
                  <Label htmlFor="final">Inspeção Final</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="process" id="process" />
                  <Label htmlFor="process">Inspeção de Processo</Label>
                </div>
              </RadioGroup>
            </div>

            {inspectionType === "process" && (
              <div className="space-y-2">
                <Label htmlFor="process">Nome do Processo</Label>
                <Input 
                  id="process" 
                  value={processName} 
                  onChange={(e) => setProcessName(e.target.value)} 
                  required 
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Critérios de Inspeção</h3>
            
            {loading ? (
              <p>Carregando critérios...</p>
            ) : criteria.length === 0 ? (
              <p>Não há critérios de qualidade disponíveis. Por favor, crie critérios primeiro.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`criterion-${criterion.id}`} 
                        checked={selectedCriteria.includes(criterion.id)}
                        onCheckedChange={(checked) => handleCriteriaChange(criterion.id, checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={`criterion-${criterion.id}`}
                          className="font-medium"
                        >
                          {criterion.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {criterion.description}
                        </p>
                        <p className="text-xs">
                          Valor esperado: {criterion.expected_value}
                          {criterion.tolerance ? ` (Tolerância: ${criterion.tolerance})` : ""}
                          {criterion.measurement_unit ? ` ${criterion.measurement_unit}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {criteriaResults.length > 0 && (
                  <div className="space-y-6 mt-8">
                    <h3 className="text-lg font-medium">Resultados da Inspeção</h3>
                    
                    {criteriaResults.map((result) => (
                      <div key={result.criteria_id} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{result.criteria_name}</h4>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`conformity-${result.criteria_id}`} className="text-sm">Conforme?</Label>
                            <Checkbox 
                              id={`conformity-${result.criteria_id}`} 
                              checked={result.is_conforming}
                              onCheckedChange={(checked) => 
                                updateCriteriaResult(result.criteria_id!, { is_conforming: checked as boolean })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Valor Esperado</Label>
                            <Input value={result.expected_value} disabled />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`actual-${result.criteria_id}`}>Valor Obtido</Label>
                            <Input 
                              id={`actual-${result.criteria_id}`}
                              value={result.actual_value}
                              onChange={(e) => 
                                updateCriteriaResult(result.criteria_id!, { actual_value: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        
                        {!result.is_conforming && (
                          <div className="space-y-2">
                            <Label htmlFor={`observation-${result.criteria_id}`}>Observação</Label>
                            <Textarea 
                              id={`observation-${result.criteria_id}`}
                              value={result.observation || ""}
                              onChange={(e) => 
                                updateCriteriaResult(result.criteria_id!, { observation: e.target.value })
                              }
                              placeholder="Descreva o problema encontrado"
                              required={!result.is_conforming}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações Gerais</Label>
            <Textarea 
              id="observations" 
              value={observations} 
              onChange={(e) => setObservations(e.target.value)} 
              placeholder="Observações adicionais sobre a inspeção"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitLoading || criteriaResults.length === 0}>
              {submitLoading ? "Registrando..." : "Registrar Inspeção"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
