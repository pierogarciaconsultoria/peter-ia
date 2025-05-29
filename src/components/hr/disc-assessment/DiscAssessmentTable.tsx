
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LineChart, PieChart, Eye } from "lucide-react";

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
  
  const getTypeExplanation = (type: string) => {
    switch (type) {
      case 'D':
        return "Pessoas com perfil Dominante são diretas, orientadas a resultados e assertivas. Tendem a ser independentes, competitivas e focadas em alcançar objetivos. Tomam decisões rapidamente e não temem desafios.";
      case 'I':
        return "Pessoas com perfil Influente são comunicativas, entusiasmadas e inspiradoras. Tendem a ser sociáveis, persuasivas e otimistas. Gostam de trabalhar com outros e de estar no centro das atenções.";
      case 'S':
        return "Pessoas com perfil Estável são pacientes, leais e confiáveis. Tendem a ser bons ouvintes, calmos e cooperativos. Trabalham bem em equipe e preferem ambientes estáveis e previsíveis.";
      case 'C':
        return "Pessoas com perfil Conformista são precisas, analíticas e sistemáticas. Tendem a ser detalhistas, lógicas e críticas. Valorizam a qualidade, a precisão e aderem aos padrões e procedimentos estabelecidos.";
      default:
        return "";
    }
  };
  
  const renderProfileChart = (assessment: DiscAssessment) => {
    // Calcula as porcentagens para visualização
    const totalPoints = Object.values(assessment.scores).reduce((a, b) => a + b, 0);
    const percentages = {
      d: (assessment.scores.d / totalPoints) * 100,
      i: (assessment.scores.i / totalPoints) * 100,
      s: (assessment.scores.s / totalPoints) * 100,
      c: (assessment.scores.c / totalPoints) * 100,
    };
    
    return (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(percentages).map(([type, percentage]) => (
            <div key={type} className="flex flex-col items-center">
              <Badge className={`${getTypeColor(type.toUpperCase())} w-full text-center py-1`}>
                {type.toUpperCase()}
              </Badge>
              <div className="mt-1 text-sm font-medium">{Math.round(percentage)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className={`h-2.5 rounded-full ${type === 'd' ? 'bg-red-500' : type === 'i' ? 'bg-yellow-500' : type === 's' ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg mt-4">
          <h4 className="font-medium mb-2">Perfil Primário: {assessment.primary_type} - {getTypeDescription(assessment.primary_type)}</h4>
          <p className="text-sm text-muted-foreground">{getTypeExplanation(assessment.primary_type)}</p>
        </div>
      </div>
    );
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
            <TableHead className="text-right">Ações</TableHead>
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
                  <Badge variant="outline" className="bg-red-50">D: {assessment.scores.d}</Badge>
                  <Badge variant="outline" className="bg-yellow-50">I: {assessment.scores.i}</Badge>
                  <Badge variant="outline" className="bg-green-50">S: {assessment.scores.s}</Badge>
                  <Badge variant="outline" className="bg-blue-50">C: {assessment.scores.c}</Badge>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(assessment.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Perfil DISC - {assessment.name}</SheetTitle>
                    </SheetHeader>
                    
                    <div className="py-6">
                      {renderProfileChart(assessment)}
                      
                      <div className="mt-8">
                        <h4 className="text-sm font-medium mb-2">Dados do Avaliado</h4>
                        <dl className="divide-y divide-gray-100">
                          <div className="px-4 py-3 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Nome</dt>
                            <dd className="text-sm text-gray-900 col-span-2">{assessment.name}</dd>
                          </div>
                          <div className="px-4 py-3 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                            <dd className="text-sm text-gray-900 col-span-2">{assessment.email}</dd>
                          </div>
                          <div className="px-4 py-3 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Data da Avaliação</dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                              {format(new Date(assessment.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </dd>
                          </div>
                          {assessment.invited_by && (
                            <div className="px-4 py-3 grid grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">Convidado por</dt>
                              <dd className="text-sm text-gray-900 col-span-2">{assessment.invited_by}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
