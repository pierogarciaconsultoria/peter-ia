
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EquipmentCalibration = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Calibração de Equipamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie a calibração de equipamentos de medição e acompanhe o cronograma de calibrações.
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nova Calibração
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Funcionalidade em Desenvolvimento</AlertTitle>
          <AlertDescription>
            A tabela 'equipment_calibrations' ainda não foi criada no banco de dados. 
            Esta funcionalidade será disponibilizada em breve.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Calibrações Válidas</p>
                  <p className="text-2xl font-bold">0</p>
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
                  <p className="text-2xl font-bold">0</p>
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
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhuma calibração registrada</p>
              <p className="text-sm">A funcionalidade de calibração de equipamentos estará disponível em breve.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentCalibration;
