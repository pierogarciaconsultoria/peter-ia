
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDiscAssessments, DiscType, DiscScore } from "@/hooks/useDiscAssessments";
import { DiscQuestionnaireForm } from "./DiscQuestionnaireForm";

// Esquema de validação para o formulário de informações básicas
const basicInfoSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
});

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewAssessmentDialog({ 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: NewAssessmentDialogProps) {
  const { createAssessment } = useDiscAssessments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"basicInfo" | "questionnaire">("basicInfo");
  const [basicInfo, setBasicInfo] = useState<{ name: string; email: string } | null>(null);
  
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const handleBasicInfoSubmit = async (values: z.infer<typeof basicInfoSchema>) => {
    setBasicInfo(values);
    setStep("questionnaire");
  };
  
  const handleQuestionnaireComplete = async (scores: DiscScore) => {
    if (!basicInfo) return;
    
    setIsSubmitting(true);
    try {
      // Determine primary type based on highest score
      const scoreEntries = Object.entries(scores) as [DiscType, number][];
      const primaryType = scoreEntries.reduce(
        (max, [type, score]) => score > max.score ? { type, score } : max, 
        { type: 'D' as DiscType, score: -1 }
      ).type;
      
      await createAssessment({
        name: basicInfo.name,
        email: basicInfo.email,
        scores,
        primary_type: primaryType,
      });
      
      form.reset();
      setStep("basicInfo");
      setBasicInfo(null);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    if (step === "questionnaire") {
      setStep("basicInfo");
      setBasicInfo(null);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Reset form when dialog is closed
        form.reset();
        setStep("basicInfo");
        setBasicInfo(null);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Avaliação DISC</DialogTitle>
          <DialogDescription>
            {step === "basicInfo" 
              ? "Cadastre uma nova avaliação DISC. Preencha os dados do participante."
              : "Responda às perguntas para determinar o perfil DISC do avaliado."}
          </DialogDescription>
        </DialogHeader>
        
        {step === "basicInfo" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleBasicInfoSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do participante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do participante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Próximo
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <DiscQuestionnaireForm 
            onComplete={handleQuestionnaireComplete}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
