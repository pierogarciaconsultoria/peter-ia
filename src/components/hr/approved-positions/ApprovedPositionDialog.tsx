import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobPositions } from "@/hooks/useJobPositions";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "sonner";

interface ApprovedPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (positionData: any) => void;
  position?: any;
}

export function ApprovedPositionDialog({
  isOpen,
  onClose,
  onSave,
  position,
}: ApprovedPositionDialogProps) {
  const { jobPositions, isLoading: loadingJobs } = useJobPositions();
  const { departments, isLoading: loadingDepts } = useDepartments();
  const isEditing = !!position;

  const [formData, setFormData] = useState({
    job_position_id: "",
    department_id: "",
    approved_count: 1,
    filled_count: 0,
    notes: "",
  });

  useEffect(() => {
    if (position) {
      setFormData({
        job_position_id: position.job_position_id || "",
        department_id: position.department_id || "",
        approved_count: position.approved_count || 1,
        filled_count: position.filled_count || 0,
        notes: position.notes || "",
      });
    } else {
      setFormData({
        job_position_id: "",
        department_id: "",
        approved_count: 1,
        filled_count: 0,
        notes: "",
      });
    }
  }, [position]);

  const handleJobPositionChange = (jobPositionId: string) => {
    const selectedJob = jobPositions.find(job => job.id === jobPositionId);
    setFormData(prev => ({
      ...prev,
      job_position_id: jobPositionId,
      // Use department from job position if available
      department_id: selectedJob?.department || prev.department_id
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.job_position_id || !formData.department_id) {
      toast.error("Por favor, selecione um cargo e departamento");
      return;
    }

    if (formData.approved_count < 1) {
      toast.error("O número de posições aprovadas deve ser maior que zero");
      return;
    }

    if (formData.filled_count > formData.approved_count) {
      toast.error("O número de posições preenchidas não pode ser maior que as aprovadas");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Posição Aprovada" : "Nova Posição Aprovada"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job_position_id">Cargo</Label>
            <Select
              value={formData.job_position_id}
              onValueChange={handleJobPositionChange}
              disabled={loadingJobs}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} {job.code && `(${job.code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Departamento</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}
              disabled={loadingDepts}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approved_count">Posições Aprovadas</Label>
            <Input
              id="approved_count"
              type="number"
              min="1"
              value={formData.approved_count}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                approved_count: parseInt(e.target.value) || 1 
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filled_count">Posições Preenchidas</Label>
            <Input
              id="filled_count"
              type="number"
              min="0"
              max={formData.approved_count}
              value={formData.filled_count}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                filled_count: parseInt(e.target.value) || 0 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações opcionais..."
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
