
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SwotItem } from "@/types/strategic-planning";
import { SwotItemForm } from "./SwotItemForm";
import { deleteSwotItem } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, AlertCircle } from "lucide-react";

interface SwotItemCardProps {
  item: SwotItem;
  onUpdated: () => void;
  onDeleted: () => void;
}

export function SwotItemCard({ item, onUpdated, onDeleted }: SwotItemCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSwotItem(item.id);
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso",
      });
      onDeleted();
    } catch (error) {
      console.error("Error deleting SWOT item:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Category label mapping
  const categoryLabels = {
    strength: "Força",
    weakness: "Fraqueza",
    opportunity: "Oportunidade",
    threat: "Ameaça"
  };

  // Category color mapping for the badge
  const categoryColors = {
    strength: "bg-green-100 text-green-800",
    weakness: "bg-yellow-100 text-yellow-800",
    opportunity: "bg-blue-100 text-blue-800",
    threat: "bg-red-100 text-red-800"
  };

  if (isEditing) {
    return (
      <SwotItemForm 
        item={item} 
        onItemAdded={() => {
          setIsEditing(false);
          onUpdated();
        }} 
        onCancel={() => setIsEditing(false)} 
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="mb-2">
              <span className={`inline-block text-xs font-semibold rounded-full px-2 py-1 ${categoryColors[item.category]}`}>
                {categoryLabels[item.category]}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                Impacto: {item.impact_level}/5
              </span>
            </div>
            <p className="text-sm">{item.description}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-destructive" /> Confirmar exclusão
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
