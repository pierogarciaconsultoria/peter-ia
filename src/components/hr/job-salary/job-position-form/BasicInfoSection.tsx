
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { JobPosition } from "../../types";
import { SuperiorPositionSelector } from "./SuperiorPositionSelector";

interface BasicInfoSectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (field: string, checked: boolean) => void;
  onSuperiorPositionChange: (value: string) => void;
}

export function BasicInfoSection({ 
  formData, 
  onChange, 
  onCheckboxChange, 
  onSuperiorPositionChange 
}: BasicInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código da DC *</Label>
          <Input 
            id="code" 
            name="code" 
            value={formData.code} 
            onChange={onChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Descrição *</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={onChange} 
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
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="approval_date">Data de Aprovação</Label>
          <Input 
            id="approval_date" 
            name="approval_date" 
            type="date" 
            value={formData.approval_date} 
            onChange={onChange} 
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
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input 
            id="department" 
            name="department" 
            value={formData.department} 
            onChange={onChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="superior_position">Cargo do superior imediato</Label>
          <SuperiorPositionSelector
            value={formData.superior_position_id}
            departmentFilter={formData.department}
            onChange={onSuperiorPositionChange}
          />
        </div>
        
        <div className="space-y-2 grid grid-cols-2 items-start pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_supervisor" 
              checked={formData.is_supervisor} 
              onCheckedChange={(checked) => onCheckboxChange("is_supervisor", checked as boolean)}
            />
            <Label htmlFor="is_supervisor" className="ml-2">É superior imediato</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_department_head" 
              checked={formData.is_department_head} 
              onCheckedChange={(checked) => onCheckboxChange("is_department_head", checked as boolean)}
            />
            <Label htmlFor="is_department_head" className="ml-2">É responsável pelo departamento</Label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cbo_code">Código da CBO</Label>
          <Input 
            id="cbo_code" 
            name="cbo_code" 
            value={formData.cbo_code} 
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="norm">Norma</Label>
          <Input 
            id="norm" 
            name="norm" 
            value={formData.norm} 
            onChange={onChange} 
          />
        </div>
      </div>
    </>
  );
}
