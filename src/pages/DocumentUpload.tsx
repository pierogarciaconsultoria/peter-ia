
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, File, FileCheck, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentUpload = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<{
    name: string;
    position: string;
    company: string;
  } | null>(null);
  
  const [documents, setDocuments] = useState<Array<{ 
    name: string; 
    required: boolean;
    file: File | null;
    uploaded: boolean;
  }>>([
    { name: "RG (frente e verso)", required: true, file: null, uploaded: false },
    { name: "CPF", required: true, file: null, uploaded: false },
    { name: "Carteira de Trabalho", required: true, file: null, uploaded: false },
    { name: "Comprovante de Residência", required: true, file: null, uploaded: false },
    { name: "Foto 3x4", required: true, file: null, uploaded: false },
    { name: "Certidão de Nascimento/Casamento", required: false, file: null, uploaded: false },
    { name: "Dados Bancários", required: true, file: null, uploaded: false },
  ]);
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Em um ambiente real, faríamos uma chamada para validar o token
        // Simulando uma verificação bem-sucedida após um breve atraso
        setTimeout(() => {
          setIsValid(true);
          setEmployeeInfo({
            name: "João da Silva",
            position: "Desenvolvedor Frontend",
            company: "Acme Inc."
          });
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    
    if (token) {
      validateToken();
    } else {
      setIsValid(false);
      setIsLoading(false);
    }
  }, [token]);
  
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedDocuments = [...documents];
      updatedDocuments[index].file = file;
      updatedDocuments[index].uploaded = true;
      setDocuments(updatedDocuments);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se todos os documentos obrigatórios foram anexados
    const missingRequiredDocs = documents.filter(doc => doc.required && !doc.file);
    
    if (missingRequiredDocs.length > 0) {
      toast({
        title: "Documentos Obrigatórios",
        description: `Por favor, anexe os seguintes documentos obrigatórios: ${missingRequiredDocs.map(d => d.name).join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    // Em um ambiente real, enviaríamos os documentos para um servidor
    // Simulando o envio bem-sucedido
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Documentos Enviados",
        description: "Seus documentos foram enviados com sucesso!"
      });
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Link Inválido
            </CardTitle>
            <CardDescription>
              Este link de envio de documentos é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Entre em contato com o departamento de RH para solicitar um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Documentos Enviados
            </CardTitle>
            <CardDescription>
              Obrigado! Seus documentos foram enviados com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O departamento de RH irá analisar seus documentos e entrará em contato caso necessite de informações adicionais.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Envio de Documentação para Admissão</h1>
          <p className="text-muted-foreground mt-2">
            Olá, {employeeInfo?.name}! Por favor, envie seus documentos para concluir o processo de admissão.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Colaborador</CardTitle>
            <CardDescription>Confira se seus dados estão corretos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                <p>{employeeInfo?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cargo</h3>
                <p>{employeeInfo?.position}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                <p>{employeeInfo?.company}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Documentos Necessários</h2>
          <Alert className="mb-4">
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Documentos marcados com * são obrigatórios. Os arquivos devem estar nos formatos PDF, JPG ou PNG, com tamanho máximo de 5MB cada.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`doc-${index}`} className="font-medium flex items-center">
                      <File className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doc.name} {doc.required && <span className="text-destructive">*</span>}
                    </Label>
                    {doc.uploaded && (
                      <div className="flex items-center text-green-600 text-sm">
                        <FileCheck className="h-4 w-4 mr-1" />
                        Anexado
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <Input
                      id={`doc-${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant={doc.uploaded ? "outline" : "default"}
                      onClick={() => document.getElementById(`doc-${index}`)?.click()}
                      className="mr-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {doc.uploaded ? "Trocar arquivo" : "Selecionar arquivo"}
                    </Button>
                    {doc.file && (
                      <span className="text-sm text-muted-foreground">
                        {doc.file.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-8" />
            
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  "Enviar Documentos"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
