
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ISODocument } from "@/utils/isoTypes";
import { fetchDocumentsForSelection } from "@/services/jobPositionService";

export function useDocumentSelection() {
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const docsData = await fetchDocumentsForSelection();
        setDocuments(docsData);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar a lista de documentos para seleção.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [toast]);

  return {
    documents,
    isLoading
  };
}
