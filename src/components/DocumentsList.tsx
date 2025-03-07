
import { ISODocument } from "@/utils/isoTypes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DocumentsListProps {
  documents: ISODocument[];
  loading: boolean;
  onEditDocument: (document: ISODocument) => void;
}

export function DocumentsList({ documents, loading, onEditDocument }: DocumentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.associated_requirement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'policy':
        return 'Política';
      case 'procedure':
        return 'Procedimento';
      case 'work-instruction':
        return 'Instrução de Trabalho';
      case 'form':
        return 'Formulário';
      case 'record':
        return 'Registro';
      case 'manual':
        return 'Manual';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: "bg-gray-100 text-gray-800",
      review: "bg-amber-100 text-amber-800",
      approved: "bg-green-100 text-green-800",
      obsolete: "bg-red-100 text-red-800",
    };
    
    const statusLabels = {
      draft: "Rascunho",
      review: "Em Revisão",
      approved: "Aprovado",
      obsolete: "Obsoleto",
    };

    type StatusKey = keyof typeof statusStyles;
    const key = status as StatusKey || 'draft';
    
    return (
      <Badge className={statusStyles[key]}>
        {statusLabels[key] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border border-border/40 bg-card/80">
            <CardHeader>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Pesquisar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="border border-border/40 bg-card/80 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                  {getStatusBadge(doc.status || 'draft')}
                </div>
                <CardTitle className="mt-2">{doc.title}</CardTitle>
                <CardDescription>
                  Requisito: {doc.associated_requirement}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {doc.description || "Sem descrição"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => window.open(`/documents/${doc.id}`, '_blank')}>
                  <Eye size={16} className="mr-1" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEditDocument(doc)}>
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? "Nenhum documento encontrado" : "Nenhum documento criado"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? `Não foram encontrados documentos para "${searchTerm}"`
              : "Crie seu primeiro documento para atender aos requisitos da ISO 9001"}
          </p>
        </div>
      )}
    </div>
  );
}
