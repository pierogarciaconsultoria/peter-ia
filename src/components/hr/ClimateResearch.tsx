
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export function ClimateResearch() {
  const location = useLocation();
  const [redirected, setRedirected] = useState(false);
  
  // Verificamos se já estamos na URL correta com a aba climate
  const isCorrectTab = location.search.includes('activeTab=climate');
  
  // Se não estamos na URL correta, isso seria tratado em TrainingControl.tsx ou na navegação
  // Este componente agora apenas renderiza seu conteúdo
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pesquisa de Clima Organizacional</h2>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Módulo em desenvolvimento</h3>
        <p className="text-muted-foreground">
          O módulo de Pesquisa de Clima Organizacional está em desenvolvimento.
          Em breve você poderá criar e gerenciar pesquisas de clima aqui.
        </p>
      </Card>
    </div>
  );
}
