
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IdentityFormHeaderProps {
  isEditing: boolean;
  onShowAiSuggestions: () => void;
}

export function IdentityFormHeader({ isEditing, onShowAiSuggestions }: IdentityFormHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold">Identidade Estratégica</CardTitle>
          <CardDescription>
            Defina a missão, visão e valores da sua organização
          </CardDescription>
        </div>
        
        {isEditing && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onShowAiSuggestions}
          >
            <Sparkles className="h-4 w-4" />
            Sugestões de IA
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
