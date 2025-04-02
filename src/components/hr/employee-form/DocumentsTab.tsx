
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { DocumentUploadLink } from "../document-upload/DocumentUploadLink";
import { Button } from "@/components/ui/button";

interface DocumentsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  documents: Array<{ name: string; file: File | null }>;
  setDocuments: (documents: Array<{ name: string; file: File | null }>) => void;
}

export function DocumentsTab({ 
  formData, 
  setFormData,
  documents,
  setDocuments
}: DocumentsTabProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedDocuments = [...documents];
      updatedDocuments[index].file = file;
      setDocuments(updatedDocuments);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="carteiraDigitalLink">Link da Carteira de Trabalho Digital</Label>
            
            {/* Link de solicitação de documentação */}
            <DocumentUploadLink 
              employeeId={formData.id || "temp-id"} 
              employeeName={`${formData.firstName} ${formData.lastName}`.trim()} 
              email={formData.email}
              whatsapp={formData.whatsapp}
            />
          </div>
          <Input
            id="carteiraDigitalLink"
            name="carteiraDigitalLink"
            value={formData.carteiraDigitalLink}
            onChange={handleInputChange}
            placeholder="https://..."
          />
          <p className="text-xs text-muted-foreground">
            Cole o link para a carteira de trabalho digital do colaborador
          </p>
        </div>

        <div className="space-y-4 border rounded-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Anexos de Documentos</h3>
            <Button variant="outline" size="sm" type="button">
              Verificar status
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Faça o upload dos documentos necessários para o cadastro do funcionário ou envie um link para que o colaborador faça o envio.
          </p>

          {documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-4 border-b pb-4">
              <div className="flex-1">
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.file ? doc.file.name : "Nenhum arquivo selecionado"}
                </p>
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
              />
            </div>
          ))}

          <p className="text-xs text-muted-foreground mt-2">
            Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB por arquivo.
          </p>
        </div>
      </div>
    </div>
  );
}
