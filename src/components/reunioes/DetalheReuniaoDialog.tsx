
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle2,
  XCircle,
  PlusCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NovaAcaoDialog } from "./NovaAcaoDialog";

interface Participante {
  id: string;
  employee_id: string;
  presente: boolean;
  employee: {
    name: string;
    avatar_url?: string;
  };
  registro?: {
    id: string;
    o_que_fiz: string;
    o_que_vou_fazer: string;
    dificuldades: string;
  };
}

interface Reuniao {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  criado_por: string;
}

interface DetalheReuniaoDialogProps {
  reuniaoId: string;
  isOpen: boolean;
  onClose: () => void;
  onRealizarReuniao: () => void;
}

export function DetalheReuniaoDialog({ 
  reuniaoId, 
  isOpen, 
  onClose,
  onRealizarReuniao
}: DetalheReuniaoDialogProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [reuniao, setReuniao] = useState<Reuniao | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [isNovaAcaoOpen, setIsNovaAcaoOpen] = useState(false);

  useEffect(() => {
    if (isOpen && reuniaoId) {
      carregarDetalhes();
    }
  }, [isOpen, reuniaoId]);

  async function carregarDetalhes() {
    try {
      setLoading(true);
      
      // Buscar detalhes da reunião
      const { data: reuniaoData, error: reuniaoError } = await supabase
        .from('reunioes')
        .select('*')
        .eq('id', reuniaoId)
        .single();
      
      if (reuniaoError) throw reuniaoError;
      
      setReuniao(reuniaoData);
      
      // Buscar participantes e seus registros
      const { data: participantesData, error: participantesError } = await supabase
        .from('reunioes_participantes')
        .select(`
          id,
          employee_id,
          presente,
          employee:employees(name, avatar_url),
          registro:reunioes_registros(id, o_que_fiz, o_que_vou_fazer, dificuldades)
        `)
        .eq('reuniao_id', reuniaoId);
      
      if (participantesError) throw participantesError;
      
      setParticipantes(participantesData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da reunião:", error);
      toast.error("Não foi possível carregar os detalhes da reunião");
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataString: string) {
    try {
      const data = new Date(dataString);
      return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  }

  function togglePresenca(participanteId: string) {
    setParticipantes(prev => prev.map(p => 
      p.id === participanteId 
        ? { ...p, presente: !p.presente } 
        : p
    ));
  }

  async function iniciarReuniao() {
    if (!reuniao || participantes.length === 0) return;
    
    try {
      setSalvando(true);
      
      // Atualizar presença dos participantes
      const presencaPromises = participantes.map(p => 
        supabase
          .from('reunioes_participantes')
          .update({ presente: p.presente })
          .eq('id', p.id)
      );
      
      await Promise.all(presencaPromises);
      
      // Criar registros vazios para os participantes presentes
      const participantesPresentes = participantes.filter(p => p.presente);
      
      for (const participante of participantesPresentes) {
        if (!participante.registro) {
          await supabase
            .from('reunioes_registros')
            .insert({
              reuniao_id: reuniaoId,
              employee_id: participante.employee_id,
              o_que_fiz: '',
              o_que_vou_fazer: '',
              dificuldades: ''
            });
        }
      }
      
      toast.success("Reunião iniciada com sucesso");
      onRealizarReuniao();
      onClose();
    } catch (error) {
      console.error("Erro ao iniciar reunião:", error);
      toast.error("Não foi possível iniciar a reunião");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{loading ? "Carregando..." : reuniao?.titulo}</DialogTitle>
            <DialogDescription>
              {loading ? "" : "Detalhes da reunião e lista de participantes"}
            </DialogDescription>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="mt-2 text-sm text-muted-foreground">Carregando detalhes...</span>
              </div>
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="participantes">Participantes</TabsTrigger>
                  <TabsTrigger value="acoes">Plano de Ação</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-1 overflow-auto">
                  <TabsContent value="info" className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{reuniao?.titulo}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatarData(reuniao?.data || '')}</span>
                      </div>
                      {reuniao?.local && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{reuniao.local}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{participantes.length} participantes</span>
                      </div>
                    </div>
                    
                    {reuniao?.descricao && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Descrição</h4>
                        <p className="text-sm whitespace-pre-line">{reuniao.descricao}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="participantes" className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Lista de Participantes</h3>
                        <Badge variant="outline">
                          {participantes.filter(p => p.presente).length}/{participantes.length} presentes
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {participantes.map((participante) => (
                          <div key={participante.id} className="flex items-center space-x-3 py-2 border-b">
                            <Checkbox 
                              checked={participante.presente}
                              onCheckedChange={() => togglePresenca(participante.id)}
                              id={`presente-${participante.id}`}
                            />
                            
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participante.employee?.avatar_url} />
                              <AvatarFallback>
                                {participante.employee?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <Label 
                              htmlFor={`presente-${participante.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              {participante.employee?.name}
                            </Label>
                            
                            {participante.presente ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="acoes" className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Plano de Ação</h3>
                        <Button onClick={() => setIsNovaAcaoOpen(true)} size="sm">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Nova Ação
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Durante a reunião, você pode adicionar ações que precisam ser realizadas.
                        Cada ação pode ser atribuída a um responsável e ter um prazo definido.
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button onClick={iniciarReuniao} disabled={salvando}>
                  {salvando ? "Salvando..." : "Iniciar Reunião"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <NovaAcaoDialog
        isOpen={isNovaAcaoOpen}
        onClose={() => setIsNovaAcaoOpen(false)}
        reuniaoId={reuniaoId}
        onSave={() => setIsNovaAcaoOpen(false)}
      />
    </>
  );
}
