
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QuestionnaireResponse } from "@/components/strategic-planning/questionnaire/QuestionnaireResponse";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { DiscScore } from "@/hooks/useDiscAssessments";

// Questões do questionário DISC
const discQuestions = [
  {
    id: "q1",
    question: "Como você se comporta em situações de pressão?",
    options: [
      { value: "D", label: "Tomo decisões rapidamente e sigo em frente" },
      { value: "I", label: "Converso com outros para aliviar a pressão" },
      { value: "S", label: "Mantenho a calma e sigo um plano estabelecido" },
      { value: "C", label: "Analiso a situação detalhadamente antes de agir" }
    ]
  },
  {
    id: "q2",
    question: "Ao trabalhar em equipe, você prefere:",
    options: [
      { value: "D", label: "Liderar e direcionar a equipe" },
      { value: "I", label: "Motivar e entusiasmar os membros da equipe" },
      { value: "S", label: "Apoiar os outros e manter a harmonia" },
      { value: "C", label: "Garantir que tudo seja feito corretamente" }
    ]
  },
  {
    id: "q3",
    question: "Quando enfrenta um problema, você geralmente:",
    options: [
      { value: "D", label: "Age rapidamente para resolver o problema" },
      { value: "I", label: "Discute com outros para encontrar soluções criativas" },
      { value: "S", label: "Considera como a solução afetará as pessoas envolvidas" },
      { value: "C", label: "Reúne todos os fatos e considera cuidadosamente as opções" }
    ]
  },
  {
    id: "q4",
    question: "Em relação a regras e procedimentos, você:",
    options: [
      { value: "D", label: "Questiona ou ignora regras que atrasam resultados" },
      { value: "I", label: "Prefere flexibilidade e espaço para criatividade" },
      { value: "S", label: "Segue regras e procedimentos estabelecidos" },
      { value: "C", label: "Valoriza regras claras e consistentes" }
    ]
  },
  {
    id: "q5",
    question: "Ao comunicar ideias, você tende a:",
    options: [
      { value: "D", label: "Ser direto e ir direto ao ponto" },
      { value: "I", label: "Ser animado e usar linguagem expressiva" },
      { value: "S", label: "Ser gentil e considerar os sentimentos dos outros" },
      { value: "C", label: "Ser preciso e fornecer detalhes" }
    ]
  },
  {
    id: "q6",
    question: "No ambiente de trabalho, você valoriza mais:",
    options: [
      { value: "D", label: "Resultados e progresso" },
      { value: "I", label: "Reconhecimento e aprovação" },
      { value: "S", label: "Estabilidade e cooperação" },
      { value: "C", label: "Qualidade e precisão" }
    ]
  },
  {
    id: "q7",
    question: "Quando você discorda de alguém, você geralmente:",
    options: [
      { value: "D", label: "Expressa sua opinião diretamente" },
      { value: "I", label: "Tenta persuadir com entusiasmo" },
      { value: "S", label: "Evita conflito e busca compromisso" },
      { value: "C", label: "Apresenta evidências lógicas para seu ponto de vista" }
    ]
  },
  {
    id: "q8",
    question: "Em relação à mudança, você:",
    options: [
      { value: "D", label: "Abraça mudanças que levam a melhores resultados" },
      { value: "I", label: "Gosta de mudanças que trazem novas oportunidades de interação" },
      { value: "S", label: "Prefere mudanças graduais e bem planejadas" },
      { value: "C", label: "Aceita mudanças quando bem justificadas com dados" }
    ]
  },
  {
    id: "q9",
    question: "Ao tomar decisões, você tende a:",
    options: [
      { value: "D", label: "Decidir rapidamente com base em resultados" },
      { value: "I", label: "Confiar em seus instintos e no que parece bom" },
      { value: "S", label: "Considerar como a decisão afetará os outros" },
      { value: "C", label: "Analisar cuidadosamente todas as opções" }
    ]
  },
  {
    id: "q10",
    question: "Quando trabalha em projetos, você prefere:",
    options: [
      { value: "D", label: "Ter controle sobre o resultado final" },
      { value: "I", label: "Colaborar com outros de forma criativa" },
      { value: "S", label: "Seguir um processo estabelecido e confiável" },
      { value: "C", label: "Ter instruções claras e padrões definidos" }
    ]
  }
];

interface DiscQuestionnaireFormProps {
  onComplete: (scores: DiscScore) => void;
  onCancel: () => void;
}

export function DiscQuestionnaireForm({ onComplete, onCancel }: DiscQuestionnaireFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");
  
  const currentQuestion = discQuestions[currentQuestionIndex];
  const totalQuestions = discQuestions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  
  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScores = (): DiscScore => {
    // Inicializa contagem para cada tipo DISC
    let scores = {
      D: 0,
      I: 0,
      S: 0,
      C: 0
    };
    
    // Conta as respostas para cada tipo
    Object.values(answers).forEach(value => {
      scores[value as keyof DiscScore] += 1;
    });
    
    return scores;
  };
  
  const handleComplete = () => {
    const scores = calculateScores();
    onComplete(scores);
  };
  
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = currentQuestion && answers[currentQuestion.id];
  
  // Verifica se já respondeu ao menos 8 perguntas para permitir finalização
  const canComplete = Object.keys(answers).length >= 8;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-sm text-muted-foreground text-right">
          {currentQuestionIndex + 1} de {totalQuestions}
        </div>
      </div>
      
      <div className="py-2">
        <h3 className="text-lg font-medium mb-4">{currentQuestion?.question}</h3>
        
        <RadioGroup 
          value={answers[currentQuestion?.id] || ""}
          onValueChange={handleAnswer}
          className="space-y-3"
        >
          {currentQuestion?.options.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem id={option.value} value={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {isLastQuestion && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Comentários adicionais (opcional):</h4>
          <QuestionnaireResponse
            value={comments}
            onChange={setComments}
            rows={3}
            placeholder="Adicione qualquer comentário ou observação sobre o avaliado..."
          />
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Anterior
        </Button>
        
        {!isLastQuestion ? (
          <Button 
            type="button" 
            onClick={goToNextQuestion} 
            disabled={!isAnswered}
          >
            Próxima
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleComplete} 
              disabled={!canComplete}
            >
              Concluir Avaliação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
