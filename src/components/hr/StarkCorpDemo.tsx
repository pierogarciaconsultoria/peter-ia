
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateDemoCompany, checkStarkCorpExists } from "@/utils/demoDataGenerator";
import { Loader2, Wand2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function StarkCorpDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Check if Stark Corporation already exists
  const { data: exists, isLoading } = useQuery({
    queryKey: ['starkCorpExists'],
    queryFn: checkStarkCorpExists,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const handleGenerateDemo = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDemoCompany();
      if (result) {
        toast.success("Stark Corporation demo data gerado com sucesso!", {
          description: "Agora você pode explorar os dados fictícios nos módulos de RH."
        });
        // Force a refresh of the page after 1 second to show new data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Não foi possível gerar os dados de demonstração.");
      }
    } catch (error) {
      console.error("Error generating demo:", error);
      toast.error("Erro ao gerar dados de demonstração");
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (isLoading) {
    return null; // Don't show anything while checking
  }
  
  // If Stark Corp already exists, don't show the button
  if (exists) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleGenerateDemo} 
        disabled={isGenerating}
        size="lg"
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando dados de demonstração...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Gerar Stark Corporation (Demo)
          </>
        )}
      </Button>
    </div>
  );
}
