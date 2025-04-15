
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { AssessmentQuestion } from "@/types/recruitment";

interface AssessmentFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    questions: AssessmentQuestion[];
  }) => void;
  onCancel: () => void;
}

export function AssessmentForm({ onSubmit, onCancel }: AssessmentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    { id: "1", text: "", type: "multiple_choice", options: [], required: true }
  ]);

  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
    setQuestions([...questions, { 
      id: newId, 
      text: "", 
      type: "multiple_choice",
      options: [],
      required: true 
    }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (
    id: string, 
    field: keyof AssessmentQuestion, 
    value: any
  ) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, questions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título da Avaliação</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Avaliação de Valores e Cultura"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o objetivo desta avaliação"
            className="min-h-24"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Perguntas</h3>
        {questions.map((question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`question-${question.id}`}>Pergunta</Label>
                    <Input
                      id={`question-${question.id}`}
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      placeholder="Digite a pergunta"
                      required
                    />
                  </div>
                  <div className="w-40">
                    <Label htmlFor={`type-${question.id}`}>Tipo</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(question.id, "type", value)}
                    >
                      <SelectTrigger id={`type-${question.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="scale">Escala</SelectItem>
                        <SelectItem value="boolean">Sim/Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {question.type === "multiple_choice" && (
                  <div>
                    <Label>Opções</Label>
                    <div className="space-y-2">
                      {(question.options || []).map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[index] = e.target.value;
                              updateQuestion(question.id, "options", newOptions);
                            }}
                            placeholder={`Opção ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newOptions = question.options?.filter((_, i) => i !== index);
                              updateQuestion(question.id, "options", newOptions);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newOptions = [...(question.options || []), ""];
                          updateQuestion(question.id, "options", newOptions);
                        }}
                      >
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addQuestion}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Pergunta
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Avaliação
        </Button>
      </div>
    </form>
  );
}
