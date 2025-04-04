
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualityCriteriaForm } from "@/components/quality-control/QualityCriteriaForm";
import { QualityCriteria, getQualityCriteria, deleteQualityCriteria } from "@/services/qualityControlService";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function QualityCriteriaManager() {
  const [criteria, setCriteria] = useState<QualityCriteria[]>([]);
  const [filteredCriteria, setFilteredCriteria] = useState<QualityCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentCriteria, setCurrentCriteria] = useState<QualityCriteria | null>(null);
  const { toast } = useToast();

  // Define company segments and criteria categories from the data
  const [companySegments, setCompanySegments] = useState<string[]>([]);
  const [criteriaCategories, setCriteriaCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    try {
      setLoading(true);
      const data = await getQualityCriteria();
      setCriteria(data);
      setFilteredCriteria(data);
      
      // Extract unique segments and categories
      const segments = Array.from(new Set(data.map(c => c.company_segment))).filter(Boolean);
      const categories = Array.from(new Set(data.map(c => c.category))).filter(Boolean);
      
      setCompanySegments(segments as string[]);
      setCriteriaCategories(categories as string[]);
    } catch (error) {
      console.error("Failed to load criteria:", error);
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
    // Apply filters
    let results = criteria;
    
    if (searchTerm) {
      results = results.filter(
        c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      results = results.filter(c => c.category === categoryFilter);
    }
    
    if (segmentFilter !== "all") {
      results = results.filter(c => c.company_segment === segmentFilter);
    }
    
    setFilteredCriteria(results);
  }, [criteria, searchTerm, categoryFilter, segmentFilter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteQualityCriteria(id);
      setCriteria(prevCriteria => prevCriteria.filter(c => c.id !== id));
      toast({
        title: "Critério excluído",
        description: "O critério de qualidade foi excluído com sucesso."
      });
    } catch (error) {
      console.error("Error deleting criteria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o critério de qualidade."
      });
    }
  };

  const handleEdit = (criteria: QualityCriteria) => {
    setCurrentCriteria(criteria);
    setShowEditDialog(true);
  };

  const handleSuccess = () => {
    loadCriteria();
    setShowAddDialog(false);
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Critérios de Qualidade</h2>
          <p className="text-muted-foreground">
            Gerencie os critérios de inspeção de qualidade
          </p>
        </div>
        
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Critério
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Refine a lista de critérios de qualidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Pesquisar critérios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {criteriaCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  {companySegments.map((segment) => (
                    <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Critérios</CardTitle>
          <CardDescription>
            {filteredCriteria.length} critérios encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredCriteria.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum critério encontrado</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddDialog(true)}>
                Adicionar novo critério
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCriteria.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Esperado</p>
                        <p className="text-sm font-medium">
                          {item.expected_value} 
                          {item.measurement_unit && <span> {item.measurement_unit}</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tolerância</p>
                        <p className="text-sm font-medium">{item.tolerance || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={item.is_active ? "default" : "outline"} className="mt-1">
                          {item.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.company_segment}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Criteria Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Novo Critério de Qualidade</DialogTitle>
          </DialogHeader>
          <QualityCriteriaForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Criteria Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Critério de Qualidade</DialogTitle>
          </DialogHeader>
          {currentCriteria && (
            <QualityCriteriaForm 
              criteria={currentCriteria} 
              onSuccess={handleSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
