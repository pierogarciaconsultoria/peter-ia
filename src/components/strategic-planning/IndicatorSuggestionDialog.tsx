
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createIndicator } from "@/services/indicatorService";
import { IndicatorType } from "@/types/indicators";

interface IdentityData {
  mission: string;
  vision: string;
  values: string[];
}

interface IndicatorSuggestion {
  name: string;
  description: string;
  process: string;
  goal_value: number;
  unit: string;
  goal_type: "higher_better" | "lower_better" | "target";
  calculation_type: "sum" | "average";
}

interface IndicatorSuggestionDialogProps {
  open: boolean;
  onClose: () => void;
  identity: IdentityData;
}

export function IndicatorSuggestionDialog({ 
  open, 
  onClose,
  identity 
}: IndicatorSuggestionDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [indicators, setIndicators] = useState<IndicatorSuggestion[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<number[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!identity.mission || !identity.vision || !identity.values.length) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://kxkcgbtsgfyisbrtjmvv.supabase.co/functions/v1/generate-strategic-indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar sugestões de indicadores');
      }

      const data = await response.json();
      setIndicators(data.indicators || []);
      // Auto-select all indicators by default
      setSelectedIndicators(data.indicators ? Array.from({ length: data.indicators.length }, (_, i) => i) : []);
    } catch (error) {
      console.error('Erro ao gerar indicadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar sugestões de indicadores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSuggestions();
    }
  }, [open]);

  const toggleIndicator = (index: number) => {
    setSelectedIndicators(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSaveIndicators = async () => {
    setSaveLoading(true);
    try {
      const selectedItems = indicators.filter((_, index) => selectedIndicators.includes(index));
      
      // Save each selected indicator
      await Promise.all(selectedItems.map(indicator => {
        const indicatorData: Omit<IndicatorType, "id" | "created_at" | "updated_at"> = {
          name: indicator.name,
          description: indicator.description,
          process: indicator.process || "Estratégico",
          goal_type: indicator.goal_type,
          goal_value: indicator.goal_value,
          calculation_type: indicator.calculation_type,
          unit: indicator.unit
        };
        
        return createIndicator(indicatorData);
      }));
      
      toast({
        title: "Indicadores Salvos",
        description: `${selectedItems.length} indicadores foram salvos com sucesso`,
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar indicadores:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os indicadores",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            Indicadores de Desempenho Sugeridos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-60">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Gerando sugestões de indicadores...</p>
            </div>
          ) : indicators.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Com base na identidade estratégica fornecida, estes são os indicadores recomendados para acompanhar 
                o progresso da sua organização.
              </p>
              
              <div className="space-y-4 my-4">
                {indicators.map((indicator, index) => (
                  <Card 
                    key={index} 
                    className={`border transition-colors ${
                      selectedIndicators.includes(index) ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{indicator.name}</CardTitle>
                          <CardDescription className="text-xs">{indicator.process}</CardDescription>
                        </div>
                        <Button
                          variant={selectedIndicators.includes(index) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleIndicator(index)}
                        >
                          {selectedIndicators.includes(index) ? "Selecionado" : "Selecionar"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{indicator.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="bg-muted text-xs px-2 py-1 rounded-md">
                          Meta: {indicator.goal_value} {indicator.unit}
                        </div>
                        <div className="bg-muted text-xs px-2 py-1 rounded-md">
                          {indicator.goal_type === "higher_better" ? "Quanto maior, melhor" : 
                           indicator.goal_type === "lower_better" ? "Quanto menor, melhor" : 
                           "Valor específico"}
                        </div>
                        <div className="bg-muted text-xs px-2 py-1 rounded-md">
                          Cálculo: {indicator.calculation_type === "sum" ? "Somatório" : "Média"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                
                <Button
                  onClick={handleSaveIndicators}
                  disabled={selectedIndicators.length === 0 || saveLoading}
                  className="flex items-center gap-2"
                >
                  {saveLoading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar {selectedIndicators.length} Indicador{selectedIndicators.length !== 1 ? 'es' : ''}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p>Não foi possível gerar indicadores sugeridos.</p>
              <Button className="mt-4" onClick={fetchSuggestions}>
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
