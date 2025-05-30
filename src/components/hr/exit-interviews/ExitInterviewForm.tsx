
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, CheckCircle, AlertCircle } from "lucide-react";
import { ExitInterview, ExitInterviewFormData } from "@/types/exitInterviews";
import { ExitInterviewService } from "@/services/exitInterviewService";
import { useToast } from "@/components/ui/use-toast";

interface ExitInterviewFormProps {
  token: string;
}

export function ExitInterviewForm({ token }: ExitInterviewFormProps) {
  const [interview, setInterview] = useState<ExitInterview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ExitInterviewFormData>({
    overall_satisfaction: 0,
    work_environment_rating: 0,
    management_rating: 0,
    growth_opportunities_rating: 0,
    compensation_rating: 0,
    what_liked_most: "",
    what_liked_least: "",
    suggestions_for_improvement: "",
    reason_for_leaving: "",
    would_recommend_company: false,
    would_consider_returning: false,
    additional_comments: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInterview();
  }, [token]);

  const loadInterview = async () => {
    try {
      setIsLoading(true);
      const data = await ExitInterviewService.getExitInterviewByToken(token);
      
      if (!data) {
        throw new Error("Entrevista não encontrada ou link inválido");
      }

      if (data.status === 'completed') {
        setIsSubmitted(true);
      }

      if (data.status === 'expired' || (data.link_expires_at && new Date(data.link_expires_at) < new Date())) {
        throw new Error("Este link de entrevista expirou");
      }

      setInterview(data);
    } catch (error) {
      console.error("Error loading interview:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível carregar a entrevista.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (field: keyof ExitInterviewFormData, rating: number) => {
    setFormData({ ...formData, [field]: rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (formData.overall_satisfaction === 0 || 
        formData.work_environment_rating === 0 || 
        formData.management_rating === 0 || 
        formData.growth_opportunities_rating === 0 || 
        formData.compensation_rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, avalie todos os aspectos de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await ExitInterviewService.submitExitInterview(token, formData);
      setIsSubmitted(true);
      toast({
        title: "Sucesso",
        description: "Entrevista enviada com sucesso. Obrigado pelo seu feedback!",
      });
    } catch (error) {
      console.error("Error submitting interview:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a entrevista. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    label: string, 
    field: keyof ExitInterviewFormData, 
    value: number
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label} *</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingChange(field, rating)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                rating <= value 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : "Clique nas estrelas para avaliar"}
        </span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando entrevista...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Entrevista não encontrada</h2>
            <p className="text-muted-foreground">
              Este link pode ter expirado ou ser inválido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Entrevista Concluída</h2>
            <p className="text-muted-foreground">
              Obrigado por dedicar seu tempo para nos fornecer seu feedback. 
              Suas respostas são muito importantes para nós.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrevista de Desligamento</CardTitle>
            <CardDescription>
              Olá {interview.employee_name}, gostaríamos de conhecer sua experiência conosco.
              Suas respostas são confidenciais e nos ajudarão a melhorar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avaliações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Avalie sua experiência</h3>
                
                {renderStarRating(
                  "Satisfação geral com a empresa",
                  "overall_satisfaction",
                  formData.overall_satisfaction
                )}
                
                {renderStarRating(
                  "Ambiente de trabalho",
                  "work_environment_rating",
                  formData.work_environment_rating
                )}
                
                {renderStarRating(
                  "Gestão e liderança",
                  "management_rating",
                  formData.management_rating
                )}
                
                {renderStarRating(
                  "Oportunidades de crescimento",
                  "growth_opportunities_rating",
                  formData.growth_opportunities_rating
                )}
                
                {renderStarRating(
                  "Remuneração e benefícios",
                  "compensation_rating",
                  formData.compensation_rating
                )}
              </div>

              {/* Perguntas abertas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Conte-nos mais</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="what_liked_most">O que você mais gostou na empresa?</Label>
                  <Textarea
                    id="what_liked_most"
                    value={formData.what_liked_most}
                    onChange={(e) => setFormData({ ...formData, what_liked_most: e.target.value })}
                    placeholder="Compartilhe os aspectos positivos da sua experiência..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="what_liked_least">O que você menos gostou ou gostaria que fosse diferente?</Label>
                  <Textarea
                    id="what_liked_least"
                    value={formData.what_liked_least}
                    onChange={(e) => setFormData({ ...formData, what_liked_least: e.target.value })}
                    placeholder="Compartilhe os aspectos que poderiam ser melhorados..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestions_for_improvement">Que sugestões você daria para melhorarmos?</Label>
                  <Textarea
                    id="suggestions_for_improvement"
                    value={formData.suggestions_for_improvement}
                    onChange={(e) => setFormData({ ...formData, suggestions_for_improvement: e.target.value })}
                    placeholder="Suas sugestões são muito valiosas para nós..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason_for_leaving">Qual o principal motivo da sua saída?</Label>
                  <Textarea
                    id="reason_for_leaving"
                    value={formData.reason_for_leaving}
                    onChange={(e) => setFormData({ ...formData, reason_for_leaving: e.target.value })}
                    placeholder="Compartilhe o motivo principal da sua decisão..."
                  />
                </div>
              </div>

              {/* Perguntas sim/não */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Você recomendaria nossa empresa para um amigo trabalhar?</Label>
                  <RadioGroup
                    value={formData.would_recommend_company.toString()}
                    onValueChange={(value) => setFormData({ ...formData, would_recommend_company: value === 'true' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="recommend-yes" />
                      <Label htmlFor="recommend-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="recommend-no" />
                      <Label htmlFor="recommend-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Você consideraria retornar à empresa no futuro?</Label>
                  <RadioGroup
                    value={formData.would_consider_returning.toString()}
                    onValueChange={(value) => setFormData({ ...formData, would_consider_returning: value === 'true' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="return-yes" />
                      <Label htmlFor="return-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="return-no" />
                      <Label htmlFor="return-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Comentários adicionais */}
              <div className="space-y-2">
                <Label htmlFor="additional_comments">Há algo mais que gostaria de compartilhar?</Label>
                <Textarea
                  id="additional_comments"
                  value={formData.additional_comments}
                  onChange={(e) => setFormData({ ...formData, additional_comments: e.target.value })}
                  placeholder="Espaço livre para seus comentários adicionais..."
                />
              </div>

              <div className="border-t pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Entrevista"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Suas respostas são confidenciais e serão usadas apenas para melhorias internas.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
