
import { JobPosition } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface JobPositionDetailsContentProps {
  jobPosition: JobPosition;
}

export function JobPositionDetailsContent({ jobPosition }: JobPositionDetailsContentProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Informações Gerais</TabsTrigger>
        <TabsTrigger value="responsibilities">Responsabilidades</TabsTrigger>
        <TabsTrigger value="requirements">Requisitos</TabsTrigger>
        <TabsTrigger value="career">Carreira e Salários</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Posição</CardTitle>
            <CardDescription>Informações básicas sobre o cargo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Departamento</p>
                <p className="text-sm text-muted-foreground">{jobPosition.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Código</p>
                <p className="text-sm text-muted-foreground">{jobPosition.code || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">CBO</p>
                <p className="text-sm text-muted-foreground">{jobPosition.cbo_code || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Normas Aplicáveis</p>
                <p className="text-sm text-muted-foreground">{jobPosition.norm || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Descrição</p>
              <p className="text-sm text-muted-foreground">{jobPosition.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Superior Imediato</p>
              <p className="text-sm text-muted-foreground">
                {jobPosition.immediate_supervisor_position || 'Não definido'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Cargo de Supervisão:</p>
              <Badge variant={jobPosition.is_supervisor ? "default" : "outline"}>
                {jobPosition.is_supervisor ? "Sim" : "Não"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Cargo de Chefia:</p>
              <Badge variant={jobPosition.is_department_head ? "default" : "outline"}>
                {jobPosition.is_department_head ? "Sim" : "Não"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Aprovação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Revisão</p>
                <p className="text-sm text-muted-foreground">{jobPosition.revision || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Aprovação</p>
                <p className="text-sm text-muted-foreground">{jobPosition.approval_date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Aprovador</p>
                <p className="text-sm text-muted-foreground">{jobPosition.approver || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="responsibilities" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Responsabilidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Responsabilidades Gerais</h4>
              <p className="text-sm whitespace-pre-line">{jobPosition.main_responsibilities || 'Não definidas'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Nível Júnior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{jobPosition.responsibilities_junior || 'Não definidas'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Nível Pleno</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{jobPosition.responsibilities_mid || 'Não definidas'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Nível Sênior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{jobPosition.responsibilities_senior || 'Não definidas'}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requirements" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Requisitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Educação</h4>
              <p className="text-sm whitespace-pre-line">{jobPosition.education_requirements || 'Não definidas'}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Experiência</h4>
              <p className="text-sm whitespace-pre-line">{jobPosition.experience_requirements || 'Não definidas'}</p>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Competências por Nível</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Júnior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.skills_junior || 'Não definidas'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pleno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.skills_mid || 'Não definidas'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sênior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.skills_senior || 'Não definidas'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Treinamentos Necessários</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Júnior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.training_junior || jobPosition.training_requirements || 'Não definidos'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pleno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.training_mid || 'Não definidos'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sênior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.training_senior || 'Não definidos'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Treinamentos Externos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Júnior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.external_training_junior || jobPosition.external_training || 'Não definidos'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pleno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.external_training_mid || 'Não definidos'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sênior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{jobPosition.external_training_senior || 'Não definidos'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="career" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Salariais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Júnior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line font-medium">{jobPosition.salary_junior || 'Não definido'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pleno</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line font-medium">{jobPosition.salary_mid || 'Não definido'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sênior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line font-medium">{jobPosition.salary_senior || 'Não definido'}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
