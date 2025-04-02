
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdentityValueBadge } from "./IdentityValueBadge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ManualIdentityFormProps {
  mission: string;
  setMission: (value: string) => void;
  vision: string;
  setVision: (value: string) => void;
  values: string[];
  setValues: (values: string[]) => void;
  isLoading: boolean;
  isEditable: boolean;
}

export function ManualIdentityForm({
  mission,
  setMission,
  vision,
  setVision,
  values,
  setValues,
  isLoading,
  isEditable = true
}: ManualIdentityFormProps) {
  const [newValue, setNewValue] = useState("");

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  // Questions to help guide filling out the form
  const missionQuestions = [
    "Qual é o propósito fundamental da sua organização?",
    "Que problema você resolve para seus clientes ou para a sociedade?",
    "Por que sua organização existe?",
    "Qual é o impacto positivo que você quer causar?"
  ];
  
  const visionQuestions = [
    "Onde você vê sua organização em 5-10 anos?",
    "Qual é a imagem de futuro que você deseja criar?",
    "O que você espera alcançar a longo prazo?",
    "Como o mundo seria melhor se sua visão fosse realizada?"
  ];
  
  const valuesQuestions = [
    "Quais princípios fundamentais guiam seu comportamento e decisões?",
    "Quais crenças são inegociáveis na sua cultura organizacional?",
    "O que sua equipe mais valoriza ao trabalhar junto?",
    "Que comportamentos você espera de todos na organização?"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="mission">
          <AccordionItem value="mission" className="border rounded-md">
            <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
              <Label className="text-lg font-medium">Missão</Label>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-md space-y-2 text-sm">
                  <p className="font-medium">Perguntas para reflexão:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {missionQuestions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
                
                {isEditable ? (
                  <Textarea
                    id="mission"
                    placeholder="Descreva a missão da sua organização..."
                    rows={4}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md border">
                    {mission || "Nenhuma missão definida."}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="vision" className="border rounded-md mt-3">
            <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
              <Label className="text-lg font-medium">Visão</Label>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-md space-y-2 text-sm">
                  <p className="font-medium">Perguntas para reflexão:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {visionQuestions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
                
                {isEditable ? (
                  <Textarea
                    id="vision"
                    placeholder="Descreva a visão da sua organização..."
                    rows={4}
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md border">
                    {vision || "Nenhuma visão definida."}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="values" className="border rounded-md mt-3">
            <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
              <Label className="text-lg font-medium">Valores</Label>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-md space-y-2 text-sm">
                  <p className="font-medium">Perguntas para reflexão:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {valuesQuestions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {values.map((value, index) => (
                    <IdentityValueBadge 
                      key={index}
                      value={value}
                      onRemove={isEditable ? () => removeValue(index) : undefined}
                      disabled={isLoading}
                    />
                  ))}
                  {values.length === 0 && !isEditable && (
                    <p className="text-sm text-muted-foreground">Nenhum valor definido.</p>
                  )}
                </div>
                
                {isEditable && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Adicione um valor..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addValue}
                      disabled={!newValue.trim() || isLoading}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
