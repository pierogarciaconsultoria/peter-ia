
import { useState } from "react";
import { QualityInspection } from "@/services/qualityControlService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualityInspectionDetails } from "./QualityInspectionDetails";
import { NonConformityDialog } from "./NonConformityDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QualityInspectionsListProps {
  inspections: QualityInspection[];
}

export function QualityInspectionsList({ inspections }: QualityInspectionsListProps) {
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [nonConformityOpen, setNonConformityOpen] = useState(false);

  const handleViewDetails = (inspection: QualityInspection) => {
    setSelectedInspection(inspection);
    setDetailsOpen(true);
  };

  const handleCreateNonConformity = (inspection: QualityInspection) => {
    setSelectedInspection(inspection);
    setNonConformityOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "with_observations":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Com Observações</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInspectionTypeBadge = (type: string) => {
    switch (type) {
      case "process":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processo</Badge>;
      case "final":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Final</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inspetor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell>
                  {format(new Date(inspection.inspection_date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{inspection.product_name}</TableCell>
                <TableCell>{inspection.batch_number}</TableCell>
                <TableCell>{getInspectionTypeBadge(inspection.inspection_type)}</TableCell>
                <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                <TableCell>{inspection.inspector}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inspection)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                    {(inspection.status === "rejected" || inspection.status === "with_observations") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCreateNonConformity(inspection)}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Não Conformidade
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Inspeção</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <QualityInspectionDetails inspection={selectedInspection} />
          )}
        </DialogContent>
      </Dialog>

      <NonConformityDialog
        open={nonConformityOpen}
        onOpenChange={setNonConformityOpen}
        inspection={selectedInspection}
      />
    </>
  );
}
