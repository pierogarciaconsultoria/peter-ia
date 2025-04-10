
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface NovaAcaoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reuniaoId?: string;
  acao?: any;
  onSave: () => void;
}

export function NovaAcaoDialog({ 
  isOpen, 
  onClose, 
  reuniaoId,
  acao,
  onSave
}: NovaAcaoDialogProps) {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [reunioes, setReunioes] = useState<{ id: string; titulo: string }[]>([]);
  const [funcionarios, setFuncionarios] = useState<{ id: string; name: string }[]>([]);
  
  // Campos do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [reuniaoSelecionadaId, setReuniaoSelecionadaId] = useState<string>("");
  const [responsavelId, setResponsavelId] = useState<string>("");
  const [prazo, setPrazo] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>("pendente");

  useEffect(() => {
    if (isOpen) {
      buscarDados();
      
      if (reuniaoId) {
        setReuniaoSelecionadaId(reuniaoId);
      }
      
      if (acao) {
        setTitulo(acao.titulo || "");
        setDescricao(acao.descricao || "");
        setReuniaoSelecionadaId(acao.reuniao_id || "");
        setResponsavelId(acao.responsavel_id || "");
        setStatus(acao.status || "pendente");
        
        if (acao.prazo) {
          setPrazo(new Date(acao.prazo));
        }
      } else {
        // Limpar formulário
        setTitulo("");
        setDescricao("");
        if (!reuniaoId) setReuniaoSelecionadaId("");
        setResponsavelId("");
        setPrazo(undefined);
        setStatus("pendente");
      }
    }
  }, [isOpen, acao, reuniaoId]);

  async function buscarDados() {
    try {
      // Buscar reuniões
      const { data: reunioesData, error: reunioesError } = await supabase
        .from('reunioes')
        .select('id, titulo')
        .order('data', { ascending: false });
      
      if (reunioesError) throw reunioesError;
      
      setReunioes(reunioesData || []);
      
      // Buscar funcionários
      const { data: funcionariosData, error: funcionariosError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (funcionariosError) throw funcionariosError;
      
      setFuncionarios(funcionariosData || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Não foi possível carregar os dados necessários");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!titulo || !reuniaoSelecionadaId) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    try {
      setLoading(true);
      
      const acaoData = {
        titulo,
        descricao,
        reuniao_id: reuniaoSelecionadaId,
        responsavel_id: responsavelId || null,
        prazo: prazo ? prazo.toISOString() : null,
        status
      };
      
      if (acao) {
        // Atualizar ação existente
        const { error } = await supabase
          .from('reunioes_acoes')
          .update(acaoData)
          .eq('id', acao.id);
        
        if (error) throw error;
        
        toast.success("Ação atualizada com sucesso");
      } else {
        // Criar nova ação
        const { error } = await supabase
          .from('reunioes_acoes')
          .insert(acaoData);
        
        if (error) throw error;
        
        toast.success("Ação criada com sucesso");
      }
      
      onSave();
    } catch (error) {
      console.error("Erro ao salvar ação:", error);
      toast.error("Não foi possível salvar a ação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{acao ? "Editar Ação" : "Nova Ação"}</DialogTitle>
            <DialogDescription>
              {acao 
                ? "Atualize os detalhes da ação no plano." 
                : "Adicione uma nova ação ao plano de ação."}
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
                placeholder="Título da ação"
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
                placeholder="Descreva a ação a ser realizada"
                className="col-span-3"
                rows={3}
              />
            </div>
            
            {!reuniaoId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reuniao" className="text-right">
                  Reunião*
                </Label>
                <Select 
                  value={reuniaoSelecionadaId} 
                  onValueChange={setReuniaoSelecionadaId}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma reunião" />
                  </SelectTrigger>
                  <SelectContent>
                    {reunioes.map((reuniao) => (
                      <SelectItem key={reuniao.id} value={reuniao.id}>
                        {reuniao.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsavel" className="text-right">
                Responsável
              </Label>
              <Select 
                value={responsavelId} 
                onValueChange={setResponsavelId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Prazo
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !prazo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {prazo ? format(prazo, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={prazo}
                      onSelect={setPrazo}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : acao ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
