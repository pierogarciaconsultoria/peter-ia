
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBscObjective } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";

interface BscObjectiveFormProps {
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  onSaved: () => void;
  onCancel: () => void;
}

export function BscObjectiveForm({ perspective, onSaved, onCancel }: BscObjectiveFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createBscObjective({
        perspective_id: perspective,
        title,
        description
      });
      
      toast({
        title: "Objetivo criado",
        description: "O objetivo foi adicionado com sucesso",
      });
      
      onSaved();
    } catch (error) {
      console.error("Error creating BSC objective:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao criar o objetivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="objective-title">Título do Objetivo</Label>
        <Input
          id="objective-title"
          placeholder="Digite o título do objetivo estratégico"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="objective-description">Descrição</Label>
        <Textarea
          id="objective-description"
          placeholder="Descreva o objetivo em detalhes..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar Objetivo"}
        </Button>
      </div>
    </form>
  );
}
