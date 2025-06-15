import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Edit, Trash, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getRawMaterialInspections, RawMaterialInspection as RawMaterialInspectionType } from "@/services/rawMaterialInspectionService";

const RawMaterialInspection = () => {
  const [inspections, setInspections] = useState<RawMaterialInspectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const data = await getRawMaterialInspections();
      setInspections(data);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      toast.error("Falha ao carregar as inspeções de matéria prima");
    } finally {
      setLoading(false);
    }
  };

  // Filter inspections based on search term
  const filteredInspections = inspections.filter(
    (inspection) =>
      inspection.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.batch_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "conditional":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "conditional":
        return "Condicional";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Inspeção de Matéria Prima</h1>
            <p className="text-muted-foreground">
              Controle as inspeções de recebimento de matérias-primas e acompanhe os resultados.
            </p>
          </div>
          <div className="flex justify-end mb-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Inspeção
            </Button>
          </div>
          <div className="flex items-center justify-between space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por material, fornecedor ou lote..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Carregando inspeções...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Inspetor</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma inspeção encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.material_name}</TableCell>
                        <TableCell>{inspection.supplier}</TableCell>
                        <TableCell>{inspection.batch_number}</TableCell>
                        <TableCell>
                          {format(new Date(inspection.inspection_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(inspection.inspection_result)}>
                            {formatStatus(inspection.inspection_result)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inspection.quantity} {inspection.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RawMaterialInspection;
