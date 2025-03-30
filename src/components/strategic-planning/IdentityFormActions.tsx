
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";

interface IdentityFormActionsProps {
  onReset: () => void;
  isLoading: boolean;
}

export function IdentityFormActions({ onReset, isLoading }: IdentityFormActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
        disabled={isLoading}
        className="flex-1"
      >
        <RotateCcw size={16} className="mr-2" />
        Restaurar
      </Button>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? "Salvando..." : "Salvar Identidade"}
        {!isLoading && <Save size={16} className="ml-2" />}
      </Button>
    </div>
  );
}
