
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function DiscAssessmentSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Avaliação DISC</CardTitle>
        <CardDescription>
          Configurações para avaliação do perfil comportamental do candidato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Integração com Módulo DISC</AlertTitle>
          <AlertDescription>
            Esta avaliação será integrada automaticamente com o módulo DISC existente,
            permitindo que o candidato responda o questionário DISC diretamente.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Perfis Comportamentais Avaliados:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li><span className="font-medium text-foreground">D (Dominância)</span> - Foco em resultados, assertividade</li>
              <li><span className="font-medium text-foreground">I (Influência)</span> - Comunicação, persuasão, sociabilidade</li>
              <li><span className="font-medium text-foreground">S (Estabilidade)</span> - Consistência, cooperação, paciência</li>
              <li><span className="font-medium text-foreground">C (Conformidade)</span> - Precisão, análise, qualidade</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Benefícios:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Alinhamento do perfil do candidato com as necessidades do cargo</li>
              <li>Avaliação objetiva de características comportamentais</li>
              <li>Identificação de possíveis pontos fortes e desafios</li>
              <li>Comparativo com o perfil ideal para a posição</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
