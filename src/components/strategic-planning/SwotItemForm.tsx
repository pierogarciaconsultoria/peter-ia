
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { createSwotItem, updateSwotItem } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { SwotItem } from "@/types/strategic-planning";

interface SwotItemFormProps {
  item?: SwotItem;
  onItemAdded: () => void;
  onCancel: () => void;
}

export function SwotItemForm({ item, onItemAdded, onCancel }: SwotItemFormProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState<'strength' | 'weakness' | 'opportunity' | 'threat'>(item?.category || 'strength');
  const [description, setDescription] = useState(item?.description || "");
  const [impactLevel, setImpactLevel] = useState<number>(item?.impact_level || 3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (item) {
        // Update existing item
        await updateSwotItem(item.id, {
          category,
          description,
          impact_level: impactLevel
        });
        toast({
          title: "Item SWOT atualizado",
          description: "O item foi atualizado com sucesso",
        });
      } else {
        // Create new item
        await createSwotItem({
          category,
          description,
          impact_level: impactLevel
        });
        toast({
          title: "Item SWOT criado",
          description: "O novo item foi adicionado com sucesso",
        });
      }
      onItemAdded();
    } catch (error) {
      console.error("Error saving SWOT item:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="swot-category">Categoria</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as 'strength' | 'weakness' | 'opportunity' | 'threat')}
            >
              <SelectTrigger id="swot-category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Força (Interna/Positiva)</SelectItem>
                <SelectItem value="weakness">Fraqueza (Interna/Negativa)</SelectItem>
                <SelectItem value="opportunity">Oportunidade (Externa/Positiva)</SelectItem>
                <SelectItem value="threat">Ameaça (Externa/Negativa)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="swot-description">Descrição</Label>
            <Textarea
              id="swot-description"
              placeholder="Descreva o item SWOT..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="impact-level">Nível de Impacto</Label>
              <span className="text-sm font-medium">{impactLevel}/5</span>
            </div>
            <Slider
              id="impact-level"
              min={1}
              max={5}
              step={1}
              value={[impactLevel]}
              onValueChange={(values) => setImpactLevel(values[0])}
              className="py-4"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : item ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
