
import { ISORequirement, isoRequirements } from "@/utils/isoRequirements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface RelatedISORequirementsProps {
  requirementNumbers: string[];
}

// Função auxiliar para encontrar um requisito (incluindo filhos) pelo número.
const findRequirement = (reqNumber: string): ISORequirement | undefined => {
  for (const req of isoRequirements) {
    if (req.number === reqNumber) {
      return req;
    }
    // Verifica também nos filhos
    if (req.children) {
      const childReq = req.children.find(child => child.number === reqNumber);
      if (childReq) return childReq;
    }
  }
  return undefined;
};


export function RelatedISORequirements({ requirementNumbers }: RelatedISORequirementsProps) {
  // Busca os objetos completos dos requisitos a partir dos números fornecidos.
  const relatedRequirements = requirementNumbers
    .map(findRequirement)
    .filter((r): r is ISORequirement => !!r); // Filtra os que não foram encontrados

  if (relatedRequirements.length === 0) {
    return null; // Não renderiza nada se nenhum requisito corresponder
  }

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-blue-800 dark:text-blue-300 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Requisitos ISO 9001:2015 Relacionados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedRequirements.map((req) => (
            <div key={req.id}>
              <p className="font-semibold text-primary">
                {req.number} - {req.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {req.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
