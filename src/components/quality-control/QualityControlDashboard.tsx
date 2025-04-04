
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QualityInspectionsList } from "./QualityInspectionsList";
import { QualityInspection, getQualityInspections } from "@/services/qualityControlService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Filter, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function QualityControlDashboard() {
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'process' | 'final'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true);
        const data = await getQualityInspections();
        setInspections(data);
      } catch (error) {
        console.error("Failed to fetch inspections:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar inspeções",
          description: "Não foi possível carregar as inspeções de qualidade."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [toast]);

  const filteredInspections = filterType === 'all' 
    ? inspections 
    : inspections.filter(i => i.inspection_type === filterType);

  const totalInspections = inspections.length;
  const approvedInspections = inspections.filter(i => i.status === 'approved').length;
  const rejectedInspections = inspections.filter(i => i.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{totalInspections}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{approvedInspections}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{rejectedInspections}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Inspeções Recentes</h2>
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant={filterType === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'process' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType('process')}
            >
              Processo
            </Button>
            <Button
              variant={filterType === 'final' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType('final')}
            >
              Final
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredInspections.length > 0 ? (
        <QualityInspectionsList inspections={filteredInspections} />
      ) : (
        <Alert>
          <AlertTitle>Nenhuma inspeção encontrada</AlertTitle>
          <AlertDescription>
            Não há inspeções de qualidade registradas. Clique em "Nova Inspeção" para começar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
