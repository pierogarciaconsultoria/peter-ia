
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentFile } from "./types";

interface DocumentFormProps {
  employeeName: string;
  onSubmit: () => void;
}

export const DocumentForm = ({ employeeName, onSubmit }: DocumentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { name: "RG", file: null },
    { name: "CPF", file: null },
    { name: "Carteira de Trabalho", file: null },
    { name: "Comprovante de Residência", file: null },
    { name: "Certidão de Nascimento/Casamento", file: null },
  ]);

  const handleDocumentUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedDocuments = [...documents];
      updatedDocuments[index].file = file;
      setDocuments(updatedDocuments);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se todos os documentos foram carregados
    const allDocumentsUploaded = documents.every(doc => doc.file !== null);
    if (!allDocumentsUploaded) {
      toast({
        title: "Documentos incompletos",
        description: "Por favor, carregue todos os documentos solicitados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulação de envio de documentos para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Documentos enviados com sucesso!",
        description: "Todos os seus documentos foram recebidos.",
      });
      
      onSubmit();
    } catch (error) {
      console.error("Erro ao enviar documentos:", error);
      toast({
        title: "Erro ao enviar documentos",
        description: "Ocorreu um erro ao enviar seus documentos. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {documents.map((doc, index) => (
        <div key={index} className="space-y-2 pb-4 border-b">
          <Label htmlFor={`doc-${index}`} className="font-medium">{doc.name}</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {doc.file ? (
                <p className="text-sm">
                  {doc.file.name}{" "}
                  <span className="text-muted-foreground">
                    ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum arquivo selecionado
                </p>
              )}
            </div>
            <Label
              htmlFor={`doc-${index}`}
              className="cursor-pointer flex items-center bg-primary text-primary-foreground px-3 py-1 text-sm rounded-md"
            >
              <Upload className="mr-2 h-3 w-3" />
              {doc.file ? "Trocar" : "Anexar"}
            </Label>
            <Input
              id={`doc-${index}`}
              type="file"
              className="hidden"
              onChange={(e) => handleDocumentUpload(index, e)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB por arquivo.
      </p>
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? "Enviando documentos..." : "Enviar todos os documentos"}
      </Button>
    </form>
  );
};
