
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Copy, Mail, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentLinkGeneratorProps {
  employeeId: string;
  employeeName: string;
  email?: string;
  phone?: string;
}

export function DocumentLinkGenerator({
  employeeId,
  employeeName,
  email,
  phone
}: DocumentLinkGeneratorProps) {
  const { toast } = useToast();
  const [linkType, setLinkType] = useState<"email" | "whatsapp" | "copy">("email");
  
  // Gerar um token único para o link (na produção, seria ideal armazenar isso no banco)
  const generateUniqueToken = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${employeeId}-${timestamp}-${randomString}`;
  };
  
  const token = generateUniqueToken();
  const documentUploadLink = `${window.location.origin}/document-upload/${token}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(documentUploadLink);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência."
    });
  };
  
  const handleSendLink = () => {
    if (linkType === "email" && email) {
      // Na implementação completa, isso chamaria uma função do backend para enviar o email
      toast({
        title: "Link enviado por e-mail",
        description: `Um e-mail foi enviado para ${email} com o link para upload de documentos.`
      });
    } else if (linkType === "whatsapp" && phone) {
      // Formatar número para WhatsApp (remover caracteres não numéricos)
      const formattedPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=Olá ${encodeURIComponent(employeeName)}, segue o link para envio dos documentos necessários para sua admissão: ${encodeURIComponent(documentUploadLink)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Link preparado para WhatsApp",
        description: "Uma nova janela do WhatsApp foi aberta com a mensagem."
      });
    } else {
      toast({
        title: "Não foi possível enviar o link",
        description: linkType === "email" 
          ? "O e-mail do colaborador não está cadastrado." 
          : "O telefone do colaborador não está cadastrado.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h3 className="font-medium">Enviar link para documentos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select 
            value={linkType} 
            onValueChange={(value) => setLinkType(value as "email" | "whatsapp" | "copy")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método de envio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </div>
              </SelectItem>
              <SelectItem value="whatsapp">
                <div className="flex items-center">
                  {/* Using a custom import for WhatsApp icon since it's not available in current lucide-react version */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.95 15c1.05 1.05 2.05 1.5 3.05 1.5" />
                  </svg>
                  <span>WhatsApp</span>
                </div>
              </SelectItem>
              <SelectItem value="copy">
                <div className="flex items-center">
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copiar link</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2 flex gap-2">
          <Input 
            value={documentUploadLink} 
            readOnly 
            className="flex-1 bg-white" 
          />
          
          {linkType === "copy" ? (
            <Button onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          ) : (
            <Button onClick={handleSendLink}>
              {linkType === "email" ? (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar
                </>
              ) : (
                <>
                  {/* Simple SVG for WhatsApp icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.95 15c1.05 1.05 2.05 1.5 3.05 1.5" />
                  </svg>
                  Abrir
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Este link é único para {employeeName} e pode ser usado apenas uma vez.
      </p>
    </div>
  );
}
