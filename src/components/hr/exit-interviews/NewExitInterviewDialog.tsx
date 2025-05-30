
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExitInterviewService } from "@/services/exitInterviewService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewExitInterviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  companyId: string;
}

export function NewExitInterviewDialog({ 
  isOpen, 
  onOpenChange, 
  onSuccess, 
  companyId 
}: NewExitInterviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [formData, setFormData] = useState({
    termination_date: "",
    termination_reason: "",
    employee_phone: ""
  });
  const { toast } = useToast();

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, phone')
        .eq('company_id', companyId)
        .eq('status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !formData.termination_date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      await ExitInterviewService.createExitInterview({
        employee_id: selectedEmployee,
        company_id: companyId,
        employee_name: employee?.name || "",
        employee_phone: formData.employee_phone || employee?.phone,
        termination_date: formData.termination_date,
        termination_reason: formData.termination_reason
      });

      onSuccess();
      setFormData({
        termination_date: "",
        termination_reason: "",
        employee_phone: ""
      });
      setSelectedEmployee("");
    } catch (error) {
      console.error("Error creating exit interview:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a entrevista de desligamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open && employees.length === 0) {
      loadEmployees();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Entrevista de Desligamento</DialogTitle>
          <DialogDescription>
            Crie uma nova entrevista de desligamento para um funcionário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Funcionário *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="termination_date">Data de Desligamento *</Label>
            <Input
              id="termination_date"
              type="date"
              value={formData.termination_date}
              onChange={(e) => setFormData({ ...formData, termination_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termination_reason">Motivo do Desligamento</Label>
            <Textarea
              id="termination_reason"
              value={formData.termination_reason}
              onChange={(e) => setFormData({ ...formData, termination_reason: e.target.value })}
              placeholder="Descreva o motivo do desligamento..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_phone">Telefone (opcional)</Label>
            <Input
              id="employee_phone"
              type="tel"
              value={formData.employee_phone}
              onChange={(e) => setFormData({ ...formData, employee_phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Entrevista"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
