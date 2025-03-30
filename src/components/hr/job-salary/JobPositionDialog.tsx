
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { JobPosition } from "../types";
import { useToast } from "@/hooks/use-toast";

interface JobPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobPosition: JobPosition) => void;
  jobPosition?: JobPosition;
}

export function JobPositionDialog({
  isOpen,
  onClose,
  onSave,
  jobPosition,
}: JobPositionDialogProps) {
  const { toast } = useToast();
  const isEditing = !!jobPosition;
  
  const [formData, setFormData] = useState<JobPosition>(
    jobPosition || {
      id: crypto.randomUUID(),
      code: "",
      title: "",
      description: "",
      department: "",
      revision: "1.0",
      is_supervisor: false,
      status: "draft",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_supervisor: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.title) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Descrição de Cargo" : "Nova Descrição de Cargo"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código da DC *</Label>
              <Input 
                id="code" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Descrição *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revision">Revisão do documento</Label>
              <Input 
                id="revision" 
                name="revision" 
                value={formData.revision} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approval_date">Data de Aprovação</Label>
              <Input 
                id="approval_date" 
                name="approval_date" 
                type="date" 
                value={formData.approval_date} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="approver">Responsável pela aprovação</Label>
              <Input 
                id="approver" 
                name="approver" 
                value={formData.approver} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="immediate_supervisor_position">Cargo do superior imediato</Label>
              <Input 
                id="immediate_supervisor_position" 
                name="immediate_supervisor_position" 
                value={formData.immediate_supervisor_position} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2 flex items-center pt-6">
              <Checkbox 
                id="is_supervisor" 
                checked={formData.is_supervisor} 
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_supervisor" className="ml-2">É superior imediato</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cbo_code">Código da CBO</Label>
              <Input 
                id="cbo_code" 
                name="cbo_code" 
                value={formData.cbo_code} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="norm">Norma</Label>
              <Input 
                id="norm" 
                name="norm" 
                value={formData.norm} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="main_responsibilities">Principais responsabilidades</Label>
            <Textarea 
              id="main_responsibilities" 
              name="main_responsibilities" 
              rows={4}
              value={formData.main_responsibilities} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Competência</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_requirements">Educação</Label>
                <Input 
                  id="education_requirements" 
                  name="education_requirements" 
                  value={formData.education_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill_requirements">Habilidades</Label>
                <Input 
                  id="skill_requirements" 
                  name="skill_requirements" 
                  value={formData.skill_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="training_requirements">Treinamento</Label>
                <Input 
                  id="training_requirements" 
                  name="training_requirements" 
                  value={formData.training_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience_requirements">Experiência</Label>
                <Input 
                  id="experience_requirements" 
                  name="experience_requirements" 
                  value={formData.experience_requirements} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_procedures">Treinamentos necessários (procedimentos)</Label>
            <Textarea 
              id="required_procedures" 
              name="required_procedures" 
              value={formData.required_procedures?.join('\n')} 
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                required_procedures: e.target.value.split('\n').filter(item => item.trim() !== '')
              }))} 
              placeholder="Digite um procedimento por linha"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_resources">Recursos necessários</Label>
            <Textarea 
              id="required_resources" 
              name="required_resources" 
              value={formData.required_resources?.join('\n')} 
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                required_resources: e.target.value.split('\n').filter(item => item.trim() !== '')
              }))} 
              placeholder="Digite um recurso por linha"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_ppe">EPI (Equipamentos de Proteção Individual)</Label>
            <Textarea 
              id="required_ppe" 
              name="required_ppe" 
              value={formData.required_ppe?.join('\n')} 
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                required_ppe: e.target.value.split('\n').filter(item => item.trim() !== '')
              }))} 
              placeholder="Digite um EPI por linha"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
