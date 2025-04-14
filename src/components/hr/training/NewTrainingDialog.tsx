
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeSelector } from "@/components/hr/departments/EmployeeSelector";
import { DocumentSelector } from "@/components/hr/job-salary/job-position-form/DocumentSelector";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Training } from "@/services/trainingService";
import { Checkbox } from "@/components/ui/checkbox";
import { ISODocument } from "@/utils/isoTypes";

interface NewTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  employees: { id: string; name: string; department: string }[];
  procedures: { id: string; title: string; document_type: string; associated_requirement: string; created_at: string; updated_at: string }[];
  onTrainingCreated: (training: Training) => void;
}

interface Participant {
  id: string;
  name: string;
  attended: boolean;
}

export function NewTrainingDialog({
  open,
  onOpenChange,
  departments,
  employees,
  procedures,
  onTrainingCreated
}: NewTrainingDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    trainer: "",
    training_date: new Date(),
    start_time: "",
    end_time: "",
    duration: 0,
    status: "planned",
    procedure_id: "",
    participants: [] as Participant[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate duration whenever start or end time changes
  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`1970-01-01T${formData.start_time}`);
      const end = new Date(`1970-01-01T${formData.end_time}`);
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      setFormData(prev => ({
        ...prev,
        duration: diffHours > 0 ? diffHours : 0
      }));
    }
  }, [formData.start_time, formData.end_time]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParticipantAdd = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && !formData.participants.some(p => p.id === employeeId)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, {
          id: employeeId,
          name: employee.name,
          attended: false
        }]
      }));
    }
  };

  const handleParticipantRemove = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== employeeId)
    }));
  };

  const toggleAttendance = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === employeeId ? { ...p, attended: !p.attended } : p
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.department || !formData.trainer || formData.participants.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      const newTraining: Training = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        department: formData.department,
        trainer: formData.trainer,
        training_date: format(formData.training_date, 'yyyy-MM-dd'),
        start_time: formData.start_time,
        end_time: formData.end_time,
        duration: formData.duration,
        status: formData.status as "planned" | "in_progress" | "completed" | "canceled",
        procedure_id: formData.procedure_id,
        participants: formData.participants
      };

      onTrainingCreated(newTraining);
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar treinamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      department: "",
      trainer: "",
      training_date: new Date(),
      start_time: "",
      end_time: "",
      duration: 0,
      status: "planned",
      procedure_id: "",
      participants: []
    });
  };

  // Convert procedures array to ISODocument format
  const proceduresAsISODocuments: ISODocument[] = procedures.map(proc => ({
    id: proc.id,
    title: proc.title,
    document_type: proc.document_type || "procedure",
    associated_requirement: proc.associated_requirement || "",
    created_at: proc.created_at || new Date().toISOString(),
    updated_at: proc.updated_at || new Date().toISOString()
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Treinamento</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo treinamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Treinamento</Label>
              <Input
                id="title"
                placeholder="Ex: Treinamento de ISO 9001"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo e conteúdo do treinamento"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Instrutor</Label>
              <Input
                id="trainer"
                placeholder="Nome do instrutor"
                value={formData.trainer}
                onChange={(e) => handleChange("trainer", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="training_date">Data do Treinamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.training_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.training_date ? (
                      format(formData.training_date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.training_date}
                    onSelect={(date) => handleChange("training_date", date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora Início</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleChange("start_time", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_time">Hora Fim</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleChange("end_time", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duração (horas)</Label>
              <Input
                value={formData.duration}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Procedimento</Label>
            <DocumentSelector
              documents={proceduresAsISODocuments}
              selectedDocuments={formData.procedure_id ? [formData.procedure_id] : []}
              onSelectionChange={(docId) => handleChange("procedure_id", docId)}
              onRemove={() => handleChange("procedure_id", "")}
              isLoading={false}
            />
          </div>

          <div className="space-y-4">
            <Label>Participantes</Label>
            <EmployeeSelector
              value={null}
              onChange={handleParticipantAdd}
              placeholder="Adicionar participante..."
            />
            
            <div className="space-y-2">
              {formData.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={participant.attended}
                      onCheckedChange={() => toggleAttendance(participant.id)}
                    />
                    <span>{participant.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleParticipantRemove(participant.id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Treinamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
