
import { Button } from "@/components/ui/button";
import { Sparkles, PenLine } from "lucide-react";

interface IdentityEditingActionsProps {
  hasIdentityData: boolean;
  onShowIndicatorSuggestions: () => void;
  onEnableEditing: () => void;
}

export function IdentityEditingActions({
  hasIdentityData,
  onShowIndicatorSuggestions,
  onEnableEditing
}: IdentityEditingActionsProps) {
  return (
    <div className="flex justify-end gap-3 mt-4">
      {hasIdentityData && (
        <Button 
          type="button" 
          variant="outline"
          onClick={onShowIndicatorSuggestions}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Sugerir Indicadores
        </Button>
      )}
      <Button 
        type="button" 
        onClick={onEnableEditing}
        className="flex items-center gap-2"
      >
        <PenLine className="h-4 w-4" />
        Editar
      </Button>
    </div>
  );
}
