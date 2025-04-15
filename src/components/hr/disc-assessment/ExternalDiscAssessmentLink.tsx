
import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateAssessmentLink } from "@/services/disc-assessment-service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast as sonnerToast } from "sonner";

export function ExternalDiscAssessmentLink() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!name || !email) {
      toast({
        title: "Informações incompletas",
        description: "Preencha o nome e e-mail para gerar um link.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const link = await generateAssessmentLink(name, email);
      setGeneratedLink(link);
      toast({
        title: "Link gerado com sucesso",
        description: "Copie e compartilhe o link para a avaliação DISC externa.",
      });
    } catch (error) {
      console.error("Error generating assessment link:", error);
      setGeneratedLink(
        `${window.location.origin}/disc-assessment/mock-${Date.now()}`
      );
      sonnerToast.warning("Link de demonstração gerado", {
        description: "Devido a problemas de conexão, criamos um link de demonstração local."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link copiado",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setGeneratedLink(null);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Send className="h-4 w-4 mr-2" />
        Enviar link externo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {generatedLink
                ? "Link para avaliação DISC"
                : "Enviar link para avaliação DISC"}
            </DialogTitle>
            <DialogDescription>
              {generatedLink
                ? "Compartilhe este link para a pessoa realizar a avaliação DISC."
                : "Preencha as informações para gerar um link de avaliação DISC."}
            </DialogDescription>
          </DialogHeader>

          {generatedLink ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopy} variant="secondary" type="button">
                  Copiar
                </Button>
              </div>
              <Button onClick={handleReset} className="w-full">
                Gerar novo link
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do participante"
                  disabled={isGenerating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  disabled={isGenerating}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !name || !email}
                  className="w-full"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Gerando...
                    </div>
                  ) : (
                    "Gerar link"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
