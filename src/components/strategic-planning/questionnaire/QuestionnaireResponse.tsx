
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QuestionnaireResponseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled: boolean;
}

export function QuestionnaireResponse({ value, onChange, isDisabled }: QuestionnaireResponseProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="response">Sua resposta</Label>
      <Textarea
        id="response"
        rows={4}
        value={value}
        onChange={onChange}
        placeholder="Digite sua resposta aqui..."
        className="resize-none"
        disabled={isDisabled}
      />
    </div>
  );
}
