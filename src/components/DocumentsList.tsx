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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentsListProps {
  documents: ISODocument[];
  loading: boolean;
  onEditDocument: (document: ISODocument) => void;
}

export function DocumentsList({ documents, loading, onEditDocument }: DocumentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");

  const filteredDocuments = documents.filter(doc =>
    (doc.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (doc.document_type?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (doc?.standard_items?.join(", ") || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc?.document_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (doc?.process?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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

  const getStatusBadge = (status: string = 'draft') => {
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

  const tableCols = [
    { key: "title", label: "Título" },
    { key: "document_type", label: "Tipo" },
    { key: "document_code", label: "Código" },
    { key: "revision", label: "Revisão" },
    { key: "approval_date", label: "Data Aprovação" },
    { key: "standard_items", label: "Itens Norma" },
    { key: "created_by", label: "Elaborador" },
    { key: "approved_by", label: "Aprovador" },
    { key: "process", label: "Processo" },
    { key: "distribution_location", label: "Distribuição" },
    { key: "storage_location", label: "Armazenamento" },
    { key: "protection", label: "Proteção" },
    { key: "retention_time", label: "Retenção" },
    { key: "archiving_time", label: "Arquivo" },
    { key: "disposal_method", label: "Descarte" },
    { key: "status", label: "Status" }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Pesquisar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "cards" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("cards")}
          >
            Cartões
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")}
          >
            Lista
          </Button>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border border-border/40 bg-card/80 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                    {getStatusBadge(doc.status)}
                  </div>
                  <CardTitle className="mt-2">{doc.title}</CardTitle>
                  <CardDescription>
                    {doc.document_code && <span className="block">Código: {doc.document_code}</span>}
                    <span className="block">Requisito: {doc.associated_requirement}</span>
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
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableCols.map(col => (
                    <TableHead key={col.key} className="whitespace-nowrap">{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {doc.internal_external === 'interno' ? 'Interno' : 'Externo'}
                    </TableCell>
                    <TableCell>{doc.document_code || "-"}</TableCell>
                    <TableCell>{doc.revision || "00"}</TableCell>
                    <TableCell>
                      {doc.approval_date ? new Date(doc.approval_date).toLocaleDateString('pt-BR') : "-"}
                    </TableCell>
                    <TableCell>{doc.standard_items?.join(", ") || "-"}</TableCell>
                    <TableCell>{doc.created_by || "-"}</TableCell>
                    <TableCell>{doc.approved_by || "-"}</TableCell>
                    <TableCell>{doc.process || "-"}</TableCell>
                    <TableCell>{doc.distribution_location || "-"}</TableCell>
                    <TableCell>{doc.storage_location || "-"}</TableCell>
                    <TableCell>{doc.protection || "-"}</TableCell>
                    <TableCell>{doc.retention_time || "-"}</TableCell>
                    <TableCell>{doc.archiving_time || "-"}</TableCell>
                    <TableCell>{doc.disposal_method || "-"}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEditDocument(doc)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/documents/${doc.id}`, '_blank')}>
                          <Eye size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
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
