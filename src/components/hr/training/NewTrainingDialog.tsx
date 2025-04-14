
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Training } from "@/services/trainingService";

interface NewTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  employees: { id: string; name: string; department: string }[];
  procedures: string[];
  onTrainingCreated: (training: Training) => void;
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
    duration: 1,
    status: "planned",
    evaluation_method: "",
    participants: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        duration: Number(formData.duration),
        status: formData.status as "planned" | "in_progress" | "completed" | "canceled",
        evaluation_method: formData.evaluation_method,
        participants: formData.participants.map(id => {
          const employee = employees.find(e => e.id === id);
          return {
            id,
            name: employee?.name || "Desconhecido",
            status: "confirmed"
          };
        })
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
      duration: 1,
      status: "planned",
      evaluation_method: "",
      participants: []
    });
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (horas)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="Ex: 4"
                value={formData.duration}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planejado</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluation_method">Método de Avaliação</Label>
            <Input
              id="evaluation_method"
              placeholder="Ex: Prova teórica, avaliação prática, etc."
              value={formData.evaluation_method}
              onChange={(e) => handleChange("evaluation_method", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Participantes</Label>
            <MultiSelect
              options={employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.department})` }))}
              value={formData.participants.map(id => ({ value: id, label: employees.find(e => e.id === id)?.name || id }))}
              onChange={(selected) => handleChange("participants", selected.map(item => item.value))}
              placeholder="Selecione os participantes"
            />
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
