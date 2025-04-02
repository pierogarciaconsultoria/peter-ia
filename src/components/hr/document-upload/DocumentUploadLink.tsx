
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { sendDocumentRequestLink, generateExternalAccessToken } from "@/services/employeeDocumentService";

interface DocumentUploadLinkProps {
  employeeId: string;
  employeeName: string;
  email?: string;
  whatsapp?: string;
}

export function DocumentUploadLink({ 
  employeeId, 
  employeeName, 
  email, 
  whatsapp 
}: DocumentUploadLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>(email ? 'email' : 'whatsapp');
  const [contactValue, setContactValue] = useState(email || whatsapp || "");
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();

  const generateLink = async () => {
    if (!contactValue) {
      toast({
        title: "Contato obrigatório",
        description: `Informe um ${contactMethod === 'email' ? 'e-mail' : 'WhatsApp'} para enviar o link`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Gera o token de acesso e o link
      const token = await generateExternalAccessToken(employeeId);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/document-upload/${token}`;
      setGeneratedLink(link);

      // Tenta enviar o link para o colaborador
      const sent = await sendDocumentRequestLink(
        employeeId,
        employeeName,
        contactMethod,
        contactValue
      );

      if (sent) {
        toast({
          title: "Link enviado com sucesso",
          description: `O link foi enviado para ${contactValue}`,
        });
      } else {
        toast({
          title: "Link gerado",
          description: "O link foi gerado mas não foi possível enviar automaticamente",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast({
        title: "Erro ao gerar link",
        description: "Ocorreu um erro ao gerar o link para envio de documentos",
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

  const sendManually = () => {
    if (contactMethod === 'email') {
      window.open(`mailto:${contactValue}?subject=Envio de documentos&body=Olá ${employeeName}, acesse o link para enviar seus documentos: ${generatedLink}`);
    } else {
      // Formata número para WhatsApp
      const formattedNumber = contactValue.replace(/\D/g, "");
      window.open(`https://wa.me/${formattedNumber}?text=Olá ${employeeName}, acesse o link para enviar seus documentos: ${generatedLink}`);
    }
    
    toast({
      title: `${contactMethod === 'email' ? 'E-mail' : 'WhatsApp'} preparado`,
      description: `Seu cliente de ${contactMethod === 'email' ? 'e-mail' : 'mensagem'} foi aberto com o link pronto para envio`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Send className="h-4 w-4 mr-2" />
          Solicitar documentos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar documentos ao colaborador</DialogTitle>
          <DialogDescription>
            Envie um link único para que o colaborador possa fazer upload dos documentos necessários.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Método de contato</Label>
            <RadioGroup 
              value={contactMethod} 
              onValueChange={(value) => setContactMethod(value as 'email' | 'whatsapp')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">E-mail</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp">WhatsApp</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactValue">
              {contactMethod === 'email' ? 'E-mail do colaborador' : 'WhatsApp do colaborador'}
            </Label>
            <Input 
              id="contactValue" 
              type={contactMethod === 'email' ? 'email' : 'tel'}
              value={contactValue} 
              onChange={(e) => setContactValue(e.target.value)} 
              placeholder={contactMethod === 'email' ? "Digite o e-mail" : "(00) 00000-0000"} 
            />
          </div>

          {generatedLink && (
            <Card>
              <CardContent className="pt-4">
                <Label className="text-xs text-muted-foreground">Link para envio de documentos</Label>
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
                <p className="text-xs text-muted-foreground mt-2">
                  Este link é exclusivo para {employeeName} e expira em 7 dias
                </p>
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
              <Button onClick={sendManually}>
                <Send className="h-4 w-4 mr-2" />
                Enviar manualmente
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={generateLink}>
                Gerar e enviar link
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
