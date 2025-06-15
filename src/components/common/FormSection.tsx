
import React from "react";
import { cn } from "@/lib/utils";

/**
 * FormSection: Seção padronizada para uso em formulários grandes.
 * Props:
 * - title: string — título da seção
 * - description?: string — descrição <opcional>
 * - children: JSX.Element — campos do formulário
 */
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className
}) => (
  <section className={cn("mb-6 border rounded-lg bg-white/95 p-6 shadow", className)}>
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);
