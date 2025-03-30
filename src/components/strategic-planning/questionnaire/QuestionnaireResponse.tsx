
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface QuestionnaireResponseProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function QuestionnaireResponse({ value, onChange, disabled }: QuestionnaireResponseProps) {
  return (
    <Textarea
      placeholder="Digite sua resposta aqui..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      className="resize-none mt-4"
      disabled={disabled}
    />
  );
}
