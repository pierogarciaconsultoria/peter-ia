
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityQuestionnaire } from "./questionnaire/IdentityQuestionnaire";
import { StrategicIdentity } from "@/types/strategic-planning";
import { Check, FileEdit, ThumbsDown, ThumbsUp } from "lucide-react";

interface IdentitySuggestionDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: (identity: Pick<StrategicIdentity, "mission" | "vision" | "values">) => void;
}

export function IdentitySuggestionDialog({ 
  open, 
  onClose, 
  onAccept 
}: IdentitySuggestionDialogProps) {
  const [activeTab, setActiveTab] = useState<"questionnaire" | "suggestions">("questionnaire");
  const [suggestions, setSuggestions] = useState<{
    mission: string;
    vision: string;
    values: string[];
  } | null>(null);

  const handleQuestionnaireComplete = (suggestedIdentity: any) => {
    setSuggestions(suggestedIdentity);
    setActiveTab("suggestions");
  };

  const handleAccept = () => {
    if (suggestions) {
      onAccept(suggestions);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questionnaire">Questionário</TabsTrigger>
            <TabsTrigger value="suggestions" disabled={!suggestions}>
              Sugestões
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="questionnaire" className="mt-4">
            <IdentityQuestionnaire 
              onComplete={handleQuestionnaireComplete}
              onCancel={onClose}
            />
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-4">
            {suggestions && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Missão Sugerida</h3>
                  <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                    {suggestions.mission}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Visão Sugerida</h3>
                  <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                    {suggestions.vision}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Valores Sugeridos</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.values.map((value, index) => (
                      <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-md">
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-3">
                  <Button variant="outline" onClick={onClose}>
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("questionnaire")}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Revisar Respostas
                  </Button>
                  <Button onClick={handleAccept}>
                    <Check className="h-4 w-4 mr-2" />
                    Aceitar Sugestões
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
