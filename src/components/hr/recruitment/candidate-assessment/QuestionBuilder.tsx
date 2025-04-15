
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, GripVertical, Save } from "lucide-react";
import { AssessmentQuestion } from "@/types/recruitment";
import { v4 as uuidv4 } from "uuid";

interface QuestionBuilderProps {
  questions: AssessmentQuestion[];
  onChange: (questions: AssessmentQuestion[]) => void;
}

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const [newQuestion, setNewQuestion] = useState<Partial<AssessmentQuestion>>({
    text: "",
    type: "text",
    options: [],
    required: true,
  });
  
  const [newOption, setNewOption] = useState("");

  const addQuestion = () => {
    if (!newQuestion.text) return;
    
    // Ensure options exist for multiple_choice type
    if (newQuestion.type === "multiple_choice" && (!newQuestion.options || newQuestion.options.length === 0)) {
      return;
    }
    
    const questionToAdd: AssessmentQuestion = {
      id: uuidv4(),
      text: newQuestion.text,
      type: newQuestion.type as "multiple_choice" | "text" | "scale" | "boolean",
      options: newQuestion.options,
      required: newQuestion.required,
    };
    
    onChange([...questions, questionToAdd]);
    
    // Reset form
    setNewQuestion({
      text: "",
      type: "text",
      options: [],
      required: true,
    });
    setNewOption("");
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    onChange(updatedQuestions);
  };

  const addOption = () => {
    if (!newOption) return;
    
    setNewQuestion({
      ...newQuestion,
      options: [...(newQuestion.options || []), newOption],
    });
    
    setNewOption("");
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions.splice(index, 1);
    
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perguntas da Avaliação</CardTitle>
          <CardDescription>
            Adicione perguntas personalizadas para avaliar os candidatos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length > 0 ? (
            <div className="space-y-4 mb-6">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className="flex items-start gap-2 p-3 border rounded-md bg-muted/20"
                >
                  <div className="p-2 cursor-move">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{question.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tipo: {question.type === "multiple_choice" ? "Múltipla escolha" : 
                                 question.type === "text" ? "Resposta de texto" :
                                 question.type === "scale" ? "Escala" : "Sim/Não"}
                          {question.required && " • Obrigatória"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    {question.type === "multiple_choice" && question.options && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Opções:</p>
                        <div className="flex flex-wrap gap-1">
                          {question.options.map((option) => (
                            <span 
                              key={option} 
                              className="text-xs px-2 py-1 rounded-full bg-muted"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Nenhuma pergunta adicionada</p>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="question-text">Texto da Pergunta</Label>
              <Textarea
                id="question-text"
                placeholder="Digite a pergunta..."
                className="mt-1"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="question-type">Tipo de Resposta</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(value) => 
                  setNewQuestion({ 
                    ...newQuestion, 
                    type: value as "multiple_choice" | "text" | "scale" | "boolean",
                    options: value === "multiple_choice" ? [] : undefined
                  })
                }
              >
                <SelectTrigger id="question-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Resposta de texto</SelectItem>
                  <SelectItem value="multiple_choice">Múltipla escolha</SelectItem>
                  <SelectItem value="scale">Escala (1-5)</SelectItem>
                  <SelectItem value="boolean">Sim/Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newQuestion.type === "multiple_choice" && (
              <div className="space-y-4">
                <div>
                  <Label>Opções de Resposta</Label>
                  <div className="mt-2 space-y-2">
                    {newQuestion.options && newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={option} 
                          readOnly
                          className="flex-1" 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nova opção..."
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addOption}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Switch
                id="required"
                checked={newQuestion.required}
                onCheckedChange={(checked) => 
                  setNewQuestion({ ...newQuestion, required: checked })
                }
              />
              <Label htmlFor="required">Resposta obrigatória</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={addQuestion} className="ml-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Pergunta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
