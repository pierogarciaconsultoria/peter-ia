
import React from "react";

interface QuestionDisplayProps {
  question: string;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div className="min-h-[120px] border rounded-md p-4 bg-muted/30">
      <p className="text-lg font-medium">{question}</p>
    </div>
  );
}
