
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, BarChart2 } from "lucide-react";
import { useDiscAssessments } from "@/hooks/useDiscAssessments";
import { DiscAssessmentTable } from "./DiscAssessmentTable";
import { NewAssessmentDialog } from "./NewAssessmentDialog";

export function DiscAssessment() {
  const { assessments, isLoading, error, fetchAssessments } = useDiscAssessments();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Avaliação DISC</h2>
          <p className="text-muted-foreground">
            Gerenciamento de avaliações DISC para identificar estilos comportamentais
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação DISC
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dominante (D)
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.primary_type === 'D').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Influente (I)
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.primary_type === 'I').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estável (S)
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.primary_type === 'S').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conformista (C)
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.primary_type === 'C').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Avaliações DISC
          </CardTitle>
          <CardDescription>
            Lista de todas as avaliações DISC realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Carregando avaliações DISC...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-destructive">
              <p>{error}</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Nenhuma avaliação DISC encontrada</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Comece criando uma nova avaliação DISC
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Avaliação DISC
              </Button>
            </div>
          ) : (
            <DiscAssessmentTable assessments={assessments} />
          )}
        </CardContent>
      </Card>

      <NewAssessmentDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={fetchAssessments}
      />
    </div>
  );
}
