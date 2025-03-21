
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
import { Plus, MoreHorizontal, Edit, Trash, Eye, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getEquipmentCalibrations, EquipmentCalibration as EquipmentCalibrationType } from "@/services/equipmentCalibrationService";

const EquipmentCalibration = () => {
  const [calibrations, setCalibrations] = useState<EquipmentCalibrationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCalibrations();
  }, []);

  const fetchCalibrations = async () => {
    try {
      setLoading(true);
      const data = await getEquipmentCalibrations();
      
      // Update status based on next_calibration_date
      const today = new Date();
      const updatedData = data.map(cal => ({
        ...cal,
        status: isAfter(today, new Date(cal.next_calibration_date)) 
          ? 'expired' 
          : cal.status
      }));
      
      setCalibrations(updatedData);
    } catch (error) {
      console.error("Error fetching calibrations:", error);
      toast.error("Falha ao carregar as calibrações de equipamentos");
    } finally {
      setLoading(false);
    }
  };

  // Filter calibrations based on search term
  const filteredCalibrations = calibrations.filter(
    (calibration) =>
      calibration.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calibration.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calibration.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count calibrations by status
  const validCalibrations = calibrations.filter(c => c.status === 'valid').length;
  const expiredCalibrations = calibrations.filter(c => c.status === 'expired').length;
  const scheduledCalibrations = calibrations.filter(c => c.status === 'scheduled').length;

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "valid":
        return "Válida";
      case "expired":
        return "Vencida";
      case "scheduled":
        return "Agendada";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Calibração de Equipamentos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie a calibração de equipamentos de medição e acompanhe o cronograma de calibrações.
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Calibração
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Calibrações Válidas</p>
                    <p className="text-2xl font-bold">{validCalibrations}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Calibrações Vencidas</p>
                    <p className="text-2xl font-bold">{expiredCalibrations}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Calibrações Agendadas</p>
                    <p className="text-2xl font-bold">{scheduledCalibrations}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center justify-between space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Buscar por equipamento, ID ou responsável..."
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
                <p className="text-center text-muted-foreground">Carregando calibrações...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Calibração</TableHead>
                    <TableHead>Próxima</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalibrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma calibração encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCalibrations.map((calibration) => (
                      <TableRow key={calibration.id}>
                        <TableCell className="font-medium">{calibration.equipment_name}</TableCell>
                        <TableCell>{calibration.equipment_id}</TableCell>
                        <TableCell>
                          {format(new Date(calibration.calibration_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(calibration.next_calibration_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{calibration.responsible}</TableCell>
                        <TableCell>{calibration.calibration_entity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(calibration.status)}>
                            {formatStatus(calibration.status)}
                          </Badge>
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

export default EquipmentCalibration;
