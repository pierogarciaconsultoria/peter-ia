
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MessageSquare, Plus, X } from "lucide-react";
import { FeedbackFormData, FeedbackType, FeedbackVisibility } from "./types";
import { toast } from "sonner";
import { Employee } from "@/services/employee/types";
import { EmployeeSelector } from "../departments/EmployeeSelector";

interface NewFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void;
  employees: Employee[];
  isLoading?: boolean;
}

export function NewFeedbackDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employees,
  isLoading = false 
}: NewFeedbackDialogProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "recognition",
    title: "",
    content: "",
    visibility: "private",
    sender_id: "",
    receiver_id: "",
    tags: [],
    action_items: [],
  });
  const [newTag, setNewTag] = useState("");
  const [newActionItem, setNewActionItem] = useState("");

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.receiver_id) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    onSubmit(formData);
    onClose();
    toast.success("Feedback enviado com sucesso!");
  };

  const handleTagAdd = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag("");
    }
  };

  const handleActionItemAdd = () => {
    if (newActionItem && !formData.action_items?.includes(newActionItem)) {
      setFormData(prev => ({
        ...prev,
        action_items: [...(prev.action_items || []), newActionItem]
      }));
      setNewActionItem("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Novo Feedback
          </DialogTitle>
          <DialogDescription>
            Compartilhe um feedback construtivo para ajudar no desenvolvimento da equipe.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Feedback</Label>
              <Select
                value={formData.type}
                onValueChange={(value: FeedbackType) =>
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recognition">Reconhecimento</SelectItem>
                  <SelectItem value="improvement">Ponto de Melhoria</SelectItem>
                  <SelectItem value="1on1">One-on-One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibilidade</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: FeedbackVisibility) =>
                  setFormData(prev => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a visibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver">Destinatário</Label>
            <EmployeeSelector
              employeeId={formData.receiver_id}
              setEmployeeId={(value) => setFormData(prev => ({ ...prev, receiver_id: value }))}
              employees={employees}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Excelente apresentação no projeto X"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
              placeholder="Descreva seu feedback de forma clara e construtiva..."
              className="min-h-[100px]"
            />
          </div>

          {formData.type === "improvement" && (
            <>
              <div className="space-y-2">
                <Label>Data de Acompanhamento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? (
                        format(formData.due_date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) =>
                        setFormData(prev => ({ ...prev, due_date: date || undefined }))
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Plano de Ação</Label>
                <div className="flex gap-2">
                  <Input
                    value={newActionItem}
                    onChange={(e) => setNewActionItem(e.target.value)}
                    placeholder="Adicione itens do plano de ação"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleActionItemAdd();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleActionItemAdd} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.action_items?.map((item, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {item}
                      <button
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            action_items: prev.action_items?.filter((_, i) => i !== index)
                          }))
                        }
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicione tags relevantes"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
              />
              <Button type="button" onClick={handleTagAdd} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {tag}
                  <button
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        tags: prev.tags?.filter((_, i) => i !== index)
                      }))
                    }
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="ml-2">
            Enviar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
