
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import { QualityCriteria, deleteQualityCriteria, getQualityCriteria } from "@/services/qualityControlService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualityCriteriaForm } from "./QualityCriteriaForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companySegments, criteriaCategories } from "@/services/qualityControlService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function QualityCriteriaManager() {
  const [criteria, setCriteria] = useState<QualityCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<QualityCriteria | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState<QualityCriteria | null>(null);
  const { toast } = useToast();

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const data = await getQualityCriteria(segmentFilter || undefined, categoryFilter || undefined);
      setCriteria(data);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar critérios",
        description: "Não foi possível carregar os critérios de qualidade."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, [segmentFilter, categoryFilter, toast]);

  const handleEdit = (criteria: QualityCriteria) => {
    setEditingCriteria(criteria);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!criteriaToDelete) return;
    
    try {
      await deleteQualityCriteria(criteriaToDelete.id);
      toast({
        title: "Critério excluído",
        description: "O critério foi excluído com sucesso."
      });
      fetchCriteria();
    } catch (error) {
      console.error("Error deleting criteria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir critério",
        description: "Não foi possível excluir o critério."
      });
    } finally {
      setDeleteDialogOpen(false);
      setCriteriaToDelete(null);
    }
  };

  const confirmDelete = (criteria: QualityCriteria) => {
    setCriteriaToDelete(criteria);
    setDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCriteria(null);
    fetchCriteria();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Critérios de Qualidade</h2>
          <p className="text-muted-foreground">
            Gerencie critérios de qualidade para inspeções
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Critério
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filtrar por segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os segmentos</SelectItem>
            {companySegments.map((segment) => (
              <SelectItem key={segment.value} value={segment.value}>
                {segment.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            {criteriaCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        {loading ? (
          <CardContent className="p-6">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Esperado</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum critério encontrado
                  </TableCell>
                </TableRow>
              ) : (
                criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell className="font-medium">{criterion.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{criterion.description}</TableCell>
                    <TableCell>{criterion.expected_value}</TableCell>
                    <TableCell>
                      {companySegments.find(s => s.value === criterion.company_segment)?.label || criterion.company_segment}
                    </TableCell>
                    <TableCell>
                      {criteriaCategories.find(c => c.value === criterion.category)?.label || criterion.category}
                    </TableCell>
                    <TableCell>
                      {criterion.is_active ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(criterion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(criterion)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCriteria ? "Editar Critério" : "Novo Critério de Qualidade"}
            </DialogTitle>
          </DialogHeader>
          <QualityCriteriaForm 
            criteria={editingCriteria} 
            onClose={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o critério "{criteriaToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
