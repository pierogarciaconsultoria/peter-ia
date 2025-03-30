
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { JobPosition } from "../../types";

interface BasicInfoSectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
}

export function BasicInfoSection({ formData, onChange, onCheckboxChange }: BasicInfoSectionProps) {
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
          <Label htmlFor="immediate_supervisor_position">Cargo do superior imediato</Label>
          <Input 
            id="immediate_supervisor_position" 
            name="immediate_supervisor_position" 
            value={formData.immediate_supervisor_position} 
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2 flex items-center pt-6">
          <Checkbox 
            id="is_supervisor" 
            checked={formData.is_supervisor} 
            onCheckedChange={onCheckboxChange}
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
