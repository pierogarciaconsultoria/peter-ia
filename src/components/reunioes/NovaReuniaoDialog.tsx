
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NovaReuniaoDialog() {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState<{ id: string; name: string }[]>([]);
  const [participantesSelecionados, setParticipantesSelecionados] = useState<string[]>([]);
  
  // Campos do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState("09:00");

  useEffect(() => {
    if (open) {
      buscarFuncionarios();
    }
  }, [open]);

  async function buscarFuncionarios() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      
      setFuncionarios(data || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      toast.error("Não foi possível carregar a lista de funcionários");
    }
  }

  function toggleParticipante(id: string) {
    setParticipantesSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!titulo || !data) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    if (participantesSelecionados.length === 0) {
      toast.error("Selecione pelo menos um participante");
      return;
    }
    
    try {
      setLoading(true);
      
      const dataHora = new Date(data);
      const [hours, minutes] = hora.split(':').map(Number);
      dataHora.setHours(hours, minutes);
      
      // Inserir reunião
      const { data: reuniaoData, error: reuniaoError } = await supabase
        .from('reunioes')
        .insert({
          titulo,
          descricao,
          local,
          data: dataHora.toISOString(),
          criado_por: user?.id
        })
        .select('id')
        .single();
      
      if (reuniaoError) throw reuniaoError;
      
      // Inserir participantes
      const participantesData = participantesSelecionados.map(employeeId => ({
        reuniao_id: reuniaoData.id,
        employee_id: employeeId
      }));
      
      const { error: participantesError } = await supabase
        .from('reunioes_participantes')
        .insert(participantesData);
      
      if (participantesError) throw participantesError;
      
      toast.success("Reunião agendada com sucesso");
      
      // Limpar formulário
      setTitulo("");
      setDescricao("");
      setLocal("");
      setData(undefined);
      setHora("09:00");
      setParticipantesSelecionados([]);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      toast.error("Não foi possível agendar a reunião");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Reunião
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Agendar Nova Reunião</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma nova reunião com a equipe.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="titulo" className="text-right">
                  Título*
                </Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título da reunião"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descricao" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição ou pauta da reunião"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="local" className="text-right">
                  Local
                </Label>
                <Input
                  id="local"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Onde será realizada"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Data*
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !data && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={data}
                        onSelect={setData}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hora" className="text-right">
                  Horário*
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Participantes*
                </Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {participantesSelecionados.length === 0 ? (
                      <span className="text-sm text-muted-foreground">Nenhum participante selecionado</span>
                    ) : (
                      funcionarios
                        .filter(f => participantesSelecionados.includes(f.id))
                        .map(f => (
                          <Badge 
                            key={f.id} 
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {f.name}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleParticipante(f.id)}
                            />
                          </Badge>
                        ))
                    )}
                  </div>
                  
                  <Select 
                    onValueChange={(value) => {
                      if (value) {
                        toggleParticipante(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os participantes" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((funcionario) => (
                        <SelectItem 
                          key={funcionario.id} 
                          value={funcionario.id}
                        >
                          {funcionario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Agendando..." : "Agendar Reunião"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
