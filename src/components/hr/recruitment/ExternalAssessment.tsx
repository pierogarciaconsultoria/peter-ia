
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { validateAssessmentLink, submitAssessmentResponse } from "@/services/candidateAssessmentService";
import { toast } from "sonner";
import { Check, XCircle } from "lucide-react";
import { AssessmentQuestion } from "@/types/recruitment";

export function ExternalAssessment() {
  const { token } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadAssessment = async () => {
      if (!token) return;
      
      const data = await validateAssessmentLink(token);
      if (data) {
        setAssessment(data);
      }
      setLoading(false);
    };

    loadAssessment();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment || !token) return;

    const success = await submitAssessmentResponse(assessment.id, {
      assessment_id: assessment.candidate_assessments.id,
      link_id: assessment.id,
      candidate_name: assessment.candidate_name,
      candidate_email: assessment.candidate_email,
      answers
    });

    if (success) {
      setSubmitted(true);
      toast.success("Avaliação enviada com sucesso!");
    } else {
      toast.error("Erro ao enviar avaliação");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <XCircle className="h-5 w-5 mr-2" />
            Link Inválido
          </CardTitle>
          <CardDescription>
            Este link de avaliação é inválido, já foi utilizado ou expirou.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Check className="h-5 w-5 mr-2" />
            Avaliação Enviada
          </CardTitle>
          <CardDescription>
            Obrigado por completar a avaliação. Suas respostas foram registradas com sucesso!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const questions: AssessmentQuestion[] = assessment.candidate_assessments.questions;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{assessment.candidate_assessments.title}</CardTitle>
          <CardDescription>
            {assessment.candidate_assessments.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question: AssessmentQuestion) => (
              <div key={question.id} className="space-y-2">
                <Label>{question.text}</Label>
                
                {question.type === "text" && (
                  <Textarea
                    required={question.required}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  />
                )}

                {question.type === "multiple_choice" && (
                  <RadioGroup
                    required={question.required}
                    onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                  >
                    {question.options?.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                        <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "boolean" && (
                  <RadioGroup
                    required={question.required}
                    onValueChange={(value) => setAnswers({ ...answers, [question.id]: value === "true" })}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`}>Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`}>Não</Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}

                {question.type === "scale" && (
                  <RadioGroup
                    required={question.required}
                    onValueChange={(value) => setAnswers({ ...answers, [question.id]: parseInt(value) })}
                    className="flex gap-4"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex flex-col items-center">
                        <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                        <Label htmlFor={`${question.id}-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <Button type="submit">
                Enviar Avaliação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
