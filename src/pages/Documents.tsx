
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchDocuments } from "@/services/documentService";
import { DocumentsList } from "@/components/DocumentsList";
import { ISODocument } from "@/utils/isoTypes";

const Documents = () => {
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
      } catch (e) {
        toast.error("Erro ao buscar documentos da empresa");
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-3">Informação Documentada</h1>
      <Card className="max-w-5xl w-full p-7 bg-background">
        <p className="text-muted-foreground mb-6 max-w-xl text-center mx-auto">
          Consulte aqui a <b>lista mestra</b> de todos os documentos relacionados à gestão da qualidade na sua empresa.
        </p>
        <DocumentsList
          documents={documents}
          loading={loading}
          onEditDocument={() => toast("Função de editar documento em breve.")}
        />
      </Card>
    </div>
  );
};

export default Documents;
