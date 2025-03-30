
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface QuestionnaireResponseProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

export function QuestionnaireResponse({
  value,
  onChange,
  disabled,
  placeholder = "Digite sua resposta aqui...",
  rows = 6
}: QuestionnaireResponseProps) {
  return (
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="resize-none mt-4"
      disabled={disabled}
    />
  );
}
