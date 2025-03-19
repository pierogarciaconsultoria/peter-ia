
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface IndicatorFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function IndicatorFormActions({ 
  isEditing, 
  isSubmitting, 
  isDeleting, 
  onClose, 
  onDelete 
}: IndicatorFormActionsProps) {
  return (
    <div className="flex justify-between w-full items-center">
      {isEditing && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDelete}
          disabled={isDeleting || isSubmitting}
        >
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isDeleting && <Trash2 className="mr-2 h-4 w-4" />}
          Excluir
        </Button>
      )}
      
      <div className={`space-x-2 ${isEditing ? 'ml-auto' : ''}`}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting || isDeleting}
        >
          Cancelar
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </div>
  );
}
