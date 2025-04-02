
import React from "react";
import { Button } from "@/components/ui/button";

interface ProcessEmptyStateProps {
  clearFilters: () => void;
}

export function ProcessEmptyState({ clearFilters }: ProcessEmptyStateProps) {
  return (
    <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-muted-foreground">
        Nenhum processo encontrado com os filtros atuais.
      </p>
      <Button variant="link" onClick={clearFilters}>
        Limpar filtros
      </Button>
    </div>
  );
}
