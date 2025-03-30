
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentFile {
  name: string;
  file: File | null;
}

const DocumentUpload = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { name: "RG", file: null },
    { name: "CPF", file: null },
    { name: "Carteira de Trabalho", file: null },
    { name: "Comprovante de Residência", file: null },
    { name: "Certidão de Nascimento/Casamento", file: null },
  ]);

  // Simular validação do token
  useEffect(() => {
    // Em uma implementação real, faríamos uma chamada à API para validar o token
    const validateToken = async () => {
      try {
        // Simulação de chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Se o token contém um traço, consideramos válido para demonstração
        if (token && token.includes("-")) {
          setIsValid(true);
          setEmployeeName("João Silva"); // Na produção, viria da API
        } else {
          setIsValid(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsValid(false);
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

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
      
      setIsComplete(true);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Verificando link...</CardTitle>
            <CardDescription>Estamos validando o seu link de acesso.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
              <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!isValid) {
      return (
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              Link inválido ou expirado
            </CardTitle>
            <CardDescription className="text-red-600">
              O link que você está tentando acessar é inválido ou já foi utilizado.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Por favor, entre em contato com o RH para obter um novo link.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
          </CardFooter>
        </Card>
      );
    }

    if (isComplete) {
      return (
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Documentos enviados com sucesso!
            </CardTitle>
            <CardDescription className="text-green-600">
              Todos os documentos foram recebidos e estão em processo de verificação.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Obrigado por enviar seus documentos, {employeeName}. O departamento de RH entrará em contato caso seja necessário mais alguma informação.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Envio de documentos</CardTitle>
          <CardDescription>
            Olá {employeeName}, por favor faça o upload dos documentos necessários para sua admissão.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-3xl mx-auto pt-6 pb-12">
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentUpload;
