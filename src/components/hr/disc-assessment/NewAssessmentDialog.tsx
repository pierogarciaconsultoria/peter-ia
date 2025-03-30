
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDiscAssessments } from "@/hooks/useDiscAssessments";
import { DiscQuestionnaireForm } from "./DiscQuestionnaireForm";
import { BasicInfoForm, BasicInfoFormData } from "./BasicInfoForm";
import { DiscScore } from "@/hooks/useDiscAssessments";

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
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  
  const handleBasicInfoSubmit = (values: BasicInfoFormData) => {
    setBasicInfo(values);
    setStep("questionnaire");
  };
  
  const handleQuestionnaireComplete = async (scores: DiscScore) => {
    if (!basicInfo) return;
    
    setIsSubmitting(true);
    try {
      // Determine primary type based on highest score
      const scoreEntries = Object.entries(scores) as [keyof DiscScore, number][];
      const primaryType = scoreEntries.reduce(
        (max, [type, score]) => score > max.score ? { type, score } : max, 
        { type: 'D' as keyof DiscScore, score: -1 }
      ).type;
      
      await createAssessment({
        name: basicInfo.name,
        email: basicInfo.email,
        scores,
        primary_type: primaryType,
      });
      
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
          <BasicInfoForm 
            onSubmit={handleBasicInfoSubmit}
            onCancel={() => onOpenChange(false)}
          />
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
