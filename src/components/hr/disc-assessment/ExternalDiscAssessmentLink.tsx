
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { generateAssessmentLink } from "@/services/disc-assessment-service";

export function ExternalDiscAssessmentLink() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();

  const generateLink = async () => {
    if (!name || !email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Na implementação real, isso geraria um token único
      // e salvaria no banco de dados associado ao e-mail
      const link = await generateAssessmentLink(name, email);
      setGeneratedLink(link);

      toast({
        title: "Link gerado com sucesso",
        description: "Agora você pode compartilhar o link de avaliação",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Ocorreu um erro ao gerar o link de avaliação",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência",
    });
  };

  const sendByEmail = () => {
    // Implementação real enviaria um e-mail usando uma API
    window.open(`mailto:${email}?subject=Avaliação DISC&body=Olá ${name}, acesse o link para realizar sua avaliação DISC: ${generatedLink}`);
    
    toast({
      title: "E-mail preparado",
      description: "Seu cliente de e-mail foi aberto com o link pronto para envio",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Enviar link externo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar link para avaliação externa</DialogTitle>
          <DialogDescription>
            Crie um link para que pessoas externas possam realizar a avaliação DISC
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do participante</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Digite o nome completo" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail do participante</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Digite o e-mail" 
            />
          </div>

          {generatedLink && (
            <Card>
              <CardContent className="pt-4">
                <Label className="text-xs text-muted-foreground">Link de avaliação</Label>
                <div className="flex items-center mt-1">
                  <Input readOnly value={generatedLink} className="pr-10" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-[-40px]" 
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {generatedLink ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
              <Button onClick={sendByEmail}>
                <Send className="h-4 w-4 mr-2" />
                Enviar por e-mail
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={generateLink}>
                Gerar link
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
