
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DiscAssessment } from "@/hooks/useDiscAssessments";

interface DiscAssessmentTableProps {
  assessments: DiscAssessment[];
}

export function DiscAssessmentTable({ assessments }: DiscAssessmentTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'D': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'I': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'S': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'C': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "";
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'D': return "Dominante";
      case 'I': return "Influente";
      case 'S': return "Estável";
      case 'C': return "Conformista";
      default: return "";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Tipo Primário</TableHead>
            <TableHead>Pontuações</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">{assessment.name}</TableCell>
              <TableCell>{assessment.email}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(assessment.primary_type)} variant="outline">
                  {assessment.primary_type} - {getTypeDescription(assessment.primary_type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-red-50">D: {assessment.scores.D}</Badge>
                  <Badge variant="outline" className="bg-yellow-50">I: {assessment.scores.I}</Badge>
                  <Badge variant="outline" className="bg-green-50">S: {assessment.scores.S}</Badge>
                  <Badge variant="outline" className="bg-blue-50">C: {assessment.scores.C}</Badge>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(assessment.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
