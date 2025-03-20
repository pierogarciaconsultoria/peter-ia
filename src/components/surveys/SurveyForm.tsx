
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

type SurveyFormProps = {
  onSubmit: () => void;
};

export function SurveyForm({ onSubmit }: SurveyFormProps) {
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "rating" }
  ]);

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, text: "", type: "rating" }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: number, field: "text" | "type", value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the survey data
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título da Pesquisa</Label>
          <Input id="title" placeholder="Ex: Pesquisa de Satisfação do Cliente Q1 2023" />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            placeholder="Uma breve descrição sobre o propósito desta pesquisa" 
            className="min-h-24"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Perguntas</h3>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="flex gap-3 items-start p-3 border rounded-md">
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor={`question-${question.id}`}>Texto da Pergunta</Label>
                  <Input 
                    id={`question-${question.id}`} 
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                    placeholder="Ex: Como você avalia nosso atendimento?" 
                  />
                </div>
                <div>
                  <Label htmlFor={`question-type-${question.id}`}>Tipo de Resposta</Label>
                  <Select 
                    defaultValue={question.type}
                    onValueChange={(value) => updateQuestion(question.id, "type", value)}
                  >
                    <SelectTrigger id={`question-type-${question.id}`}>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Avaliação (1-5 estrelas)</SelectItem>
                      <SelectItem value="text">Texto livre</SelectItem>
                      <SelectItem value="boolean">Sim/Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeQuestion(question.id)}
                disabled={questions.length === 1}
              >
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
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
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit">Salvar Pesquisa</Button>
      </div>
    </form>
  );
}
