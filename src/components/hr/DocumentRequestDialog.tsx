
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { sendDocumentRequestLink } from "@/services/employeeDocumentService";

interface DocumentRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
  employeeEmail?: string;
  employeePhone?: string;
}

export function DocumentRequestDialog({
  isOpen,
  onOpenChange,
  employeeId,
  employeeName,
  employeeEmail,
  employeePhone,
}: DocumentRequestDialogProps) {
  const { toast } = useToast();
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>(
    employeeEmail ? 'email' : 'whatsapp'
  );
  const [contactValue, setContactValue] = useState<string>(
    employeeEmail || employeePhone || ''
  );
  const [isSending, setIsSending] = useState(false);

  const handleSendRequest = async () => {
    if (!contactValue.trim()) {
      toast({
        title: "Campo obrigatório",
        description: contactType === 'email' 
          ? "Por favor, insira um e-mail válido." 
          : "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const success = await sendDocumentRequestLink(
        employeeId,
        employeeName,
        contactType,
        contactValue
      );
      
      if (success) {
        toast({
          title: "Link enviado com sucesso",
          description: `A solicitação de documentos foi enviada para ${contactType === 'email' ? 'o e-mail' : 'o WhatsApp'} do colaborador.`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Falha ao enviar link",
          description: "Ocorreu um erro ao enviar a solicitação de documentos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Documentação</DialogTitle>
          <DialogDescription>
            Enviar link para que {employeeName} possa anexar os documentos necessários.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup
            value={contactType}
            onValueChange={(value) => setContactType(value as 'email' | 'whatsapp')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Enviar por E-mail</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp">Enviar por WhatsApp</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="contact">
              {contactType === 'email' ? 'E-mail do colaborador' : 'WhatsApp do colaborador'}
            </Label>
            <Input
              id="contact"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={contactType === 'email' ? "funcionario@empresa.com" : "(11) 98765-4321"}
              type={contactType === 'email' ? "email" : "tel"}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendRequest} disabled={isSending}>
            {isSending ? "Enviando..." : "Enviar Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
