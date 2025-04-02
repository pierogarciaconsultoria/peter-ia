
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobPosition } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResponsibilitiesSectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ResponsibilitiesSection({ formData, onChange }: ResponsibilitiesSectionProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="main_responsibilities" className="text-base font-medium">Principais responsabilidades</Label>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="junior">Júnior</TabsTrigger>
            <TabsTrigger value="mid">Pleno</TabsTrigger>
            <TabsTrigger value="senior">Sênior</TabsTrigger>
          </TabsList>
        
          <TabsContent value="general" className={activeTab === "general" ? "block" : "hidden"}>
            <Textarea 
              id="main_responsibilities" 
              name="main_responsibilities" 
              rows={4}
              placeholder="Responsabilidades gerais do cargo"
              value={formData.main_responsibilities || ""} 
              onChange={onChange} 
            />
          </TabsContent>
          
          <TabsContent value="junior" className={activeTab === "junior" ? "block" : "hidden"}>
            <Textarea 
              id="responsibilities_junior" 
              name="responsibilities_junior" 
              rows={4}
              placeholder="Responsabilidades específicas para nível Júnior"
              value={formData.responsibilities_junior || ""} 
              onChange={onChange} 
            />
          </TabsContent>
          
          <TabsContent value="mid" className={activeTab === "mid" ? "block" : "hidden"}>
            <Textarea 
              id="responsibilities_mid" 
              name="responsibilities_mid" 
              rows={4}
              placeholder="Responsabilidades específicas para nível Pleno"
              value={formData.responsibilities_mid || ""} 
              onChange={onChange} 
            />
          </TabsContent>
          
          <TabsContent value="senior" className={activeTab === "senior" ? "block" : "hidden"}>
            <Textarea 
              id="responsibilities_senior" 
              name="responsibilities_senior" 
              rows={4}
              placeholder="Responsabilidades específicas para nível Sênior"
              value={formData.responsibilities_senior || ""} 
              onChange={onChange} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
