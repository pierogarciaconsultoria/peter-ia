
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobPosition } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CompetencySectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CompetencySection({ formData, onChange }: CompetencySectionProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Competências</Label>
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
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="education_requirements">Educação</Label>
            <Input 
              id="education_requirements" 
              name="education_requirements" 
              value={formData.education_requirements || ""} 
              onChange={onChange} 
              placeholder="Requisitos de formação educacional"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skill_requirements">Habilidades</Label>
            <Input 
              id="skill_requirements" 
              name="skill_requirements" 
              value={formData.skill_requirements || ""} 
              onChange={onChange} 
              placeholder="Habilidades gerais necessárias"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience_requirements">Experiência</Label>
            <Input 
              id="experience_requirements" 
              name="experience_requirements" 
              value={formData.experience_requirements || ""} 
              onChange={onChange} 
              placeholder="Experiência necessária"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="junior" className={activeTab === "junior" ? "block" : "hidden"}>
        <div className="space-y-2">
          <Label htmlFor="skills_junior">Habilidades - Nível Júnior</Label>
          <Input 
            id="skills_junior" 
            name="skills_junior" 
            value={formData.skills_junior || ""} 
            onChange={onChange} 
            placeholder="Habilidades específicas para nível Júnior"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="mid" className={activeTab === "mid" ? "block" : "hidden"}>
        <div className="space-y-2">
          <Label htmlFor="skills_mid">Habilidades - Nível Pleno</Label>
          <Input 
            id="skills_mid" 
            name="skills_mid" 
            value={formData.skills_mid || ""} 
            onChange={onChange} 
            placeholder="Habilidades específicas para nível Pleno"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="senior" className={activeTab === "senior" ? "block" : "hidden"}>
        <div className="space-y-2">
          <Label htmlFor="skills_senior">Habilidades - Nível Sênior</Label>
          <Input 
            id="skills_senior" 
            name="skills_senior" 
            value={formData.skills_senior || ""} 
            onChange={onChange} 
            placeholder="Habilidades específicas para nível Sênior"
          />
        </div>
      </TabsContent>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Treinamentos</Label>
      </div>

      {/* Training Requirements Section */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="junior">Júnior</TabsTrigger>
            <TabsTrigger value="mid">Pleno</TabsTrigger>
            <TabsTrigger value="senior">Sênior</TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value="general" className={activeTab === "general" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_requirements">Treinamentos Internos</Label>
              <Input 
                id="training_requirements" 
                name="training_requirements" 
                value={formData.training_requirements || ""} 
                onChange={onChange} 
                placeholder="Treinamentos internos necessários"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="external_training">Treinamentos Externos</Label>
              <Input 
                id="external_training" 
                name="external_training" 
                value={formData.external_training || ""} 
                onChange={onChange} 
                placeholder="Treinamentos externos necessários"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="junior" className={activeTab === "junior" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_junior">Treinamentos Internos - Júnior</Label>
              <Input 
                id="training_junior" 
                name="training_junior" 
                value={formData.training_junior || ""} 
                onChange={onChange} 
                placeholder="Treinamentos internos para nível Júnior"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="external_training_junior">Treinamentos Externos - Júnior</Label>
              <Input 
                id="external_training_junior" 
                name="external_training_junior" 
                value={formData.external_training_junior || ""} 
                onChange={onChange} 
                placeholder="Treinamentos externos para nível Júnior"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mid" className={activeTab === "mid" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_mid">Treinamentos Internos - Pleno</Label>
              <Input 
                id="training_mid" 
                name="training_mid" 
                value={formData.training_mid || ""} 
                onChange={onChange} 
                placeholder="Treinamentos internos para nível Pleno"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="external_training_mid">Treinamentos Externos - Pleno</Label>
              <Input 
                id="external_training_mid" 
                name="external_training_mid" 
                value={formData.external_training_mid || ""} 
                onChange={onChange} 
                placeholder="Treinamentos externos para nível Pleno"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="senior" className={activeTab === "senior" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_senior">Treinamentos Internos - Sênior</Label>
              <Input 
                id="training_senior" 
                name="training_senior" 
                value={formData.training_senior || ""} 
                onChange={onChange} 
                placeholder="Treinamentos internos para nível Sênior"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="external_training_senior">Treinamentos Externos - Sênior</Label>
              <Input 
                id="external_training_senior" 
                name="external_training_senior" 
                value={formData.external_training_senior || ""} 
                onChange={onChange} 
                placeholder="Treinamentos externos para nível Sênior"
              />
            </div>
          </div>
        </TabsContent>
      </div>
      
      <Separator className="my-4" />
      
      {/* Salary Section */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Faixas Salariais</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary_junior">Salário - Júnior</Label>
            <Input 
              id="salary_junior" 
              name="salary_junior" 
              value={formData.salary_junior || ""} 
              onChange={onChange} 
              placeholder="Faixa salarial para nível Júnior"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary_mid">Salário - Pleno</Label>
            <Input 
              id="salary_mid" 
              name="salary_mid" 
              value={formData.salary_mid || ""} 
              onChange={onChange} 
              placeholder="Faixa salarial para nível Pleno"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary_senior">Salário - Sênior</Label>
            <Input 
              id="salary_senior" 
              name="salary_senior" 
              value={formData.salary_senior || ""} 
              onChange={onChange} 
              placeholder="Faixa salarial para nível Sênior"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
