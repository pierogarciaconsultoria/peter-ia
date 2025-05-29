
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Link, Clock, CheckCircle, Plus } from "lucide-react";
import { DiscAssessment, DiscEvaluationLink } from "@/hooks/useDiscAssessments";

interface DiscAssessmentContentProps {
  assessments: DiscAssessment[];
  evaluationLinks?: DiscEvaluationLink[];
  isLoading: boolean;
  onCreateAssessment: () => void;
}

export function DiscAssessmentContent({ 
  assessments, 
  evaluationLinks = [], 
  isLoading, 
  onCreateAssessment 
}: DiscAssessmentContentProps) {
  const getStatusBadge = (link: DiscEvaluationLink) => {
    if (link.is_used) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Usado</Badge>;
    }
    
    const isExpired = new Date(link.expires_at) < new Date();
    if (isExpired) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expirado</Badge>;
    }
    
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ativo</Badge>;
  };

  const getProfileBadge = (type: string) => {
    const profileTypes = {
      'D': { label: 'Dominância', color: 'bg-red-50 text-red-700 border-red-200' },
      'I': { label: 'Influência', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      'S': { label: 'Estabilidade', color: 'bg-green-50 text-green-700 border-green-200' },
      'C': { label: 'Conformidade', color: 'bg-blue-50 text-blue-700 border-blue-200' }
    };
    
    const profile = profileTypes[type as keyof typeof profileTypes] || profileTypes['D'];
    return <Badge variant="outline" className={profile.color}>{profile.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Carregando avaliações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Avaliações
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Link className="h-4 w-4 mr-2" />
                Links Ativos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluationLinks.filter(link => 
                !link.is_used && new Date(link.expires_at) > new Date()
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Avaliações Completas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluationLinks.filter(link => link.is_used).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Links Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluationLinks.filter(link => 
                !link.is_used && new Date(link.expires_at) > new Date()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="assessments">Avaliações Completas</TabsTrigger>
          <TabsTrigger value="links">Links de Avaliação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessments" className="space-y-4">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Crie links de avaliação para começar a coletar dados DISC.
                </p>
                <Button onClick={onCreateAssessment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil Principal</TableHead>
                    <TableHead>Pontuações</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Convidado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.name}</TableCell>
                      <TableCell>{assessment.email}</TableCell>
                      <TableCell>{getProfileBadge(assessment.primary_type)}</TableCell>
                      <TableCell className="text-sm">
                        D: {assessment.scores.d}, I: {assessment.scores.i}, 
                        S: {assessment.scores.s}, C: {assessment.scores.c}
                      </TableCell>
                      <TableCell>{new Date(assessment.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{assessment.invited_by || 'Sistema'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          {evaluationLinks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Link className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum link criado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie links de avaliação para funcionários ou candidatos.
                </p>
                <Button onClick={onCreateAssessment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">{link.name}</TableCell>
                      <TableCell>{link.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {link.entity_type === 'employee' ? 'Funcionário' : 'Candidato'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(link)}</TableCell>
                      <TableCell>{new Date(link.expires_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(link.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
