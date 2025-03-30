
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  DocumentUploadLayout, 
  LoadingState, 
  InvalidLinkState, 
  CompletedState, 
  DocumentUploadCard 
} from "@/components/document-upload";

const DocumentUpload = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  
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

  const handleComplete = () => {
    setIsComplete(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (!isValid) {
      return <InvalidLinkState />;
    }

    if (isComplete) {
      return <CompletedState employeeName={employeeName} />;
    }

    return <DocumentUploadCard employeeName={employeeName} onComplete={handleComplete} />;
  };

  return (
    <DocumentUploadLayout>
      {renderContent()}
    </DocumentUploadLayout>
  );
};

export default DocumentUpload;
