import { Separator } from "@/components/ui/separator";
import { JobPosition } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface JobPositionDetailsContentProps {
  jobPosition: JobPosition;
}

export function JobPositionDetailsContent({ jobPosition }: JobPositionDetailsContentProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="space-y-6 py-2 text-sm">
      <div>
        <h4 className="font-medium text-base">Informações Básicas</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
          <div>
            <p className="text-muted-foreground">Código:</p>
            <p>{jobPosition.code || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Departamento:</p>
            <p>{jobPosition.department || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Revisão:</p>
            <p>{jobPosition.revision || '1.0'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status:</p>
            <p className="capitalize">{jobPosition.status || 'draft'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CBO:</p>
            <p>{jobPosition.cbo_code || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Norma:</p>
            <p>{jobPosition.norm || 'Não especificada'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cargo Superior:</p>
            <p>{jobPosition.immediate_supervisor_position || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cargo de Supervisão:</p>
            <p>{jobPosition.is_supervisor ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium text-base">Descrição do Cargo</h4>
        <p className="mt-2">{jobPosition.description || 'Descrição não disponível.'}</p>
      </div>
      
      <Separator />
      
      {/* Responsabilidades por nível */}
      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-base">Principais Responsabilidades</h4>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="junior">Júnior</TabsTrigger>
              <TabsTrigger value="mid">Pleno</TabsTrigger>
              <TabsTrigger value="senior">Sênior</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="general" className={activeTab === "general" ? "block mt-2" : "hidden"}>
          <p>{jobPosition.main_responsibilities || 'Não especificadas'}</p>
        </TabsContent>
        
        <TabsContent value="junior" className={activeTab === "junior" ? "block mt-2" : "hidden"}>
          <p>{jobPosition.responsibilities_junior || 'Não especificadas para nível Júnior'}</p>
        </TabsContent>
        
        <TabsContent value="mid" className={activeTab === "mid" ? "block mt-2" : "hidden"}>
          <p>{jobPosition.responsibilities_mid || 'Não especificadas para nível Pleno'}</p>
        </TabsContent>
        
        <TabsContent value="senior" className={activeTab === "senior" ? "block mt-2" : "hidden"}>
          <p>{jobPosition.responsibilities_senior || 'Não especificadas para nível Sênior'}</p>
        </TabsContent>
      </div>
      
      <Separator />
      
      {/* Competências por nível */}
      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-base">Competências</h4>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="junior">Júnior</TabsTrigger>
              <TabsTrigger value="mid">Pleno</TabsTrigger>
              <TabsTrigger value="senior">Sênior</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="general" className={activeTab === "general" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">Formação:</p>
              <p>{jobPosition.education_requirements || 'Não especificado'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Experiência:</p>
              <p>{jobPosition.experience_requirements || 'Não especificado'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Habilidades:</p>
              <p>{jobPosition.skill_requirements || 'Não especificado'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="junior" className={activeTab === "junior" ? "block" : "hidden"}>
          <div className="mt-2">
            <p className="text-muted-foreground">Habilidades - Júnior:</p>
            <p>{jobPosition.skills_junior || 'Não especificado para nível Júnior'}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="mid" className={activeTab === "mid" ? "block" : "hidden"}>
          <div className="mt-2">
            <p className="text-muted-foreground">Habilidades - Pleno:</p>
            <p>{jobPosition.skills_mid || 'Não especificado para nível Pleno'}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="senior" className={activeTab === "senior" ? "block" : "hidden"}>
          <div className="mt-2">
            <p className="text-muted-foreground">Habilidades - Sênior:</p>
            <p>{jobPosition.skills_senior || 'Não especificado para nível Sênior'}</p>
          </div>
        </TabsContent>
      </div>
      
      <Separator />
      
      {/* Treinamentos por nível */}
      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-base">Treinamentos</h4>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="junior">Júnior</TabsTrigger>
              <TabsTrigger value="mid">Pleno</TabsTrigger>
              <TabsTrigger value="senior">Sênior</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="general" className={activeTab === "general" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">Treinamentos Internos:</p>
              <p>{jobPosition.training_requirements || 'Não especificado'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Treinamentos Externos:</p>
              <p>{jobPosition.external_training || 'Não especificado'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="junior" className={activeTab === "junior" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">Treinamentos Internos - Júnior:</p>
              <p>{jobPosition.training_junior || 'Não especificado para nível Júnior'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Treinamentos Externos - Júnior:</p>
              <p>{jobPosition.external_training_junior || 'Não especificado para nível Júnior'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mid" className={activeTab === "mid" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">Treinamentos Internos - Pleno:</p>
              <p>{jobPosition.training_mid || 'Não especificado para nível Pleno'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Treinamentos Externos - Pleno:</p>
              <p>{jobPosition.external_training_mid || 'Não especificado para nível Pleno'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="senior" className={activeTab === "senior" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">Treinamentos Internos - Sênior:</p>
              <p>{jobPosition.training_senior || 'Não especificado para nível Sênior'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Treinamentos Externos - Sênior:</p>
              <p>{jobPosition.external_training_senior || 'Não especificado para nível Sênior'}</p>
            </div>
          </div>
        </TabsContent>
      </div>
      
      <Separator />
      
      {/* Faixas Salariais */}
      <div>
        <h4 className="font-medium text-base">Faixas Salariais</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <p className="text-muted-foreground">Júnior:</p>
            <p>{jobPosition.salary_junior || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pleno:</p>
            <p>{jobPosition.salary_mid || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sênior:</p>
            <p>{jobPosition.salary_senior || 'Não especificado'}</p>
          </div>
        </div>
      </div>
      
      {/* Additional sections remain the same */}
      {jobPosition.required_procedures && jobPosition.required_procedures.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium text-base">Procedimentos Requeridos</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobPosition.required_procedures.map((proc, idx) => (
                <div key={idx} className="bg-secondary p-1 px-2 rounded text-xs">
                  {proc}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {jobPosition.required_resources && jobPosition.required_resources.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium text-base">Recursos Necessários</h4>
            <div className="mt-2">
              <ul className="list-disc pl-5">
                {jobPosition.required_resources.map((resource, idx) => (
                  <li key={idx}>{resource}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      
      {jobPosition.required_ppe && jobPosition.required_ppe.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium text-base">EPIs Necessários</h4>
            <div className="mt-2">
              <ul className="list-disc pl-5">
                {jobPosition.required_ppe.map((ppe, idx) => (
                  <li key={idx}>{ppe}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
