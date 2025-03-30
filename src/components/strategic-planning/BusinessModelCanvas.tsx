
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit } from "lucide-react";
import { BusinessModelCanvas as BusinessCanvasType } from "@/types/strategic-planning";
import { getBusinessModelCanvas, updateBusinessModelCanvas } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function BusinessModelCanvas() {
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<BusinessCanvasType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessCanvasType>>({
    key_partners: "",
    key_activities: "",
    key_resources: "",
    value_propositions: "",
    customer_relationships: "",
    channels: "",
    customer_segments: "",
    cost_structure: "",
    revenue_streams: ""
  });

  const fetchCanvas = async () => {
    setLoading(true);
    try {
      const data = await getBusinessModelCanvas();
      setCanvas(data);
      if (data) {
        setFormData({
          key_partners: data.key_partners || "",
          key_activities: data.key_activities || "",
          key_resources: data.key_resources || "",
          value_propositions: data.value_propositions || "",
          customer_relationships: data.customer_relationships || "",
          channels: data.channels || "",
          customer_segments: data.customer_segments || "",
          cost_structure: data.cost_structure || "",
          revenue_streams: data.revenue_streams || ""
        });
      }
    } catch (error) {
      console.error("Error fetching business model canvas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanvas();
  }, []);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateBusinessModelCanvas(formData);
      toast({
        title: "Canvas atualizado",
        description: "O Business Model Canvas foi salvo com sucesso",
      });
      await fetchCanvas();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving business model canvas:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o canvas",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Business Model Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Business Model Canvas</CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              Editar Canvas
              <Edit size={16} className="ml-1" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsEditing(false);
                fetchCanvas(); // Reset form to original values
              }}
              className="flex items-center gap-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key_partners">Parcerias Principais</Label>
                <Textarea
                  id="key_partners"
                  rows={4}
                  value={formData.key_partners}
                  onChange={(e) => handleChange('key_partners', e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key_activities">Atividades Principais</Label>
                  <Textarea
                    id="key_activities"
                    rows={2}
                    value={formData.key_activities}
                    onChange={(e) => handleChange('key_activities', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="key_resources">Recursos Principais</Label>
                  <Textarea
                    id="key_resources"
                    rows={2}
                    value={formData.key_resources}
                    onChange={(e) => handleChange('key_resources', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value_propositions">Proposta de Valor</Label>
                <Textarea
                  id="value_propositions"
                  rows={4}
                  value={formData.value_propositions}
                  onChange={(e) => handleChange('value_propositions', e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cost_structure">Estrutura de Custos</Label>
                  <Textarea
                    id="cost_structure"
                    rows={2}
                    value={formData.cost_structure}
                    onChange={(e) => handleChange('cost_structure', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_relationships">Relacionamento com Clientes</Label>
                  <Textarea
                    id="customer_relationships"
                    rows={2}
                    value={formData.customer_relationships}
                    onChange={(e) => handleChange('customer_relationships', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="channels">Canais</Label>
                  <Textarea
                    id="channels"
                    rows={2}
                    value={formData.channels}
                    onChange={(e) => handleChange('channels', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer_segments">Segmentos de Clientes</Label>
                <Textarea
                  id="customer_segments"
                  rows={4}
                  value={formData.customer_segments}
                  onChange={(e) => handleChange('customer_segments', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenue_streams">Fontes de Receita</Label>
                <Textarea
                  id="revenue_streams"
                  rows={2}
                  value={formData.revenue_streams}
                  onChange={(e) => handleChange('revenue_streams', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Canvas"}
                {!saving && <Save size={16} className="ml-1" />}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
              <h3 className="font-semibold text-sm mb-2">Parcerias Principais</h3>
              <p className="text-sm whitespace-pre-wrap">{canvas?.key_partners || "Não definido"}</p>
            </div>
            
            <div className="space-y-4">
              <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
                <h3 className="font-semibold text-sm mb-2">Atividades Principais</h3>
                <p className="text-sm whitespace-pre-wrap">{canvas?.key_activities || "Não definido"}</p>
              </div>
              
              <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
                <h3 className="font-semibold text-sm mb-2">Recursos Principais</h3>
                <p className="text-sm whitespace-pre-wrap">{canvas?.key_resources || "Não definido"}</p>
              </div>
            </div>
            
            <div className={cn("p-4 rounded-md", canvas ? "bg-primary/10" : "bg-muted/50")}>
              <h3 className="font-semibold text-sm mb-2">Proposta de Valor</h3>
              <p className="text-sm whitespace-pre-wrap">{canvas?.value_propositions || "Não definido"}</p>
            </div>
            
            <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
              <h3 className="font-semibold text-sm mb-2">Estrutura de Custos</h3>
              <p className="text-sm whitespace-pre-wrap">{canvas?.cost_structure || "Não definido"}</p>
            </div>
            
            <div className="space-y-4">
              <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
                <h3 className="font-semibold text-sm mb-2">Relacionamento com Clientes</h3>
                <p className="text-sm whitespace-pre-wrap">{canvas?.customer_relationships || "Não definido"}</p>
              </div>
              
              <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
                <h3 className="font-semibold text-sm mb-2">Canais</h3>
                <p className="text-sm whitespace-pre-wrap">{canvas?.channels || "Não definido"}</p>
              </div>
            </div>
            
            <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
              <h3 className="font-semibold text-sm mb-2">Segmentos de Clientes</h3>
              <p className="text-sm whitespace-pre-wrap">{canvas?.customer_segments || "Não definido"}</p>
            </div>
            
            <div className={cn("p-4 rounded-md", canvas ? "bg-muted" : "bg-muted/50")}>
              <h3 className="font-semibold text-sm mb-2">Fontes de Receita</h3>
              <p className="text-sm whitespace-pre-wrap">{canvas?.revenue_streams || "Não definido"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
