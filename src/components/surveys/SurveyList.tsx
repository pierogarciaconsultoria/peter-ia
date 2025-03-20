
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Copy, Edit, SendHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export function SurveyList() {
  // Placeholder for survey data, in a real app this would come from API
  const surveys = [
    /*
    {
      id: 1,
      title: "Pesquisa de Satisfação Q1 2023",
      dateCreated: "2023-03-15",
      responses: 24,
      status: "active"
    }
    */
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Buscar pesquisas..." 
          className="max-w-sm" 
        />
      </div>
      
      {surveys.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Respostas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>{survey.dateCreated}</TableCell>
                <TableCell>{survey.responses}</TableCell>
                <TableCell>
                  <Badge variant={survey.status === "active" ? "default" : "secondary"}>
                    {survey.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center mb-4">
              Não há pesquisas de satisfação criadas ainda.
            </p>
            <Button variant="outline">
              Criar Primeira Pesquisa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
