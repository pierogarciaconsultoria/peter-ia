
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ScrollArea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from "@/components/ui";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users, FileText, Download, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportarRelatorioReuniao } from "./ExportarRelatorioReuniao";

interface Registro {
  id: string;
  o_que_fiz: string;
  o_que_vou_fazer: string;
  dificuldades: string;
}

interface Participante {
  id: string;
  presente: boolean;
  employee: {
    name: string;
    avatar_url?: string;
  };
  registro?: Registro;
}

interface Reuniao {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  criado_por: string;
}

interface Acao {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: string;
  responsavel: {
    name: string;
  };
}

interface VisualizarAtaProps {
  reuniaoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VisualizarAta({ 
  reuniaoId, 
  isOpen, 
  onClose
}: VisualizarAtaProps) {
  const [activeTab, setActiveTab] = useState('resumo');
  const [loading, setLoading] = useState(true);
  const [reuniao, setReuniao] = useState<Reuniao | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);

  useEffect(() => {
    if (isOpen && reuniaoId) {
      carregarDetalhes();
    }
  }, [isOpen, reuniaoId]);

  async function carregarDetalhes() {
    try {
      setLoading(true);
      
      const { data: reuniaoData, error: reuniaoError } = await supabase
        .from('reunioes')
        .select('*')
        .eq('id', reuniaoId)
        .single();
      
      if (reuniaoError) throw reuniaoError;
      
      setReuniao(reuniaoData);
      
      const { data: participantesData, error: participantesError } = await supabase
        .from('reunioes_participantes')
        .select(`
          id,
          presente,
          employee:employees(name, avatar_url)
        `)
        .eq('reuniao_id', reuniaoId);
      
      if (participantesError) throw participantesError;
      
      const { data: registrosData, error: registrosError } = await supabase
        .from('reunioes_registros')
        .select('*')
        .eq('reuniao_id', reuniaoId);
      
      if (registrosError) throw registrosError;
      
      const participantesComRegistros = participantesData.map(participante => {
        // Obtenha o employee_id a partir do nome do employee para fazer a correspondência
        const employee = participante.employee as { name: string; avatar_url?: string };
        const registro = registrosData?.find(r => 
          r.employee_name === employee.name
        );
        
        return {
          ...participante,
          registro: registro || undefined
        };
      });
      
      setParticipantes(participantesComRegistros);
      
      const { data: acoesData, error: acoesError } = await supabase
        .from('reunioes_acoes')
        .select(`
          id,
          titulo,
          descricao,
          prazo,
          status,
          responsavel:employees(name)
        `)
        .eq('reuniao_id', reuniaoId);
      
      if (acoesError) throw acoesError;
      
      setAcoes(acoesData);
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

  function formatarDataSimples(dataString: string) {
    if (!dataString) return "";
    
    try {
      const data = new Date(dataString);
      return format(data, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  }

  function getBadgeStatus(status: string) {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "em_andamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em andamento</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {loading ? "Carregando..." : `Ata de Reunião: ${reuniao?.titulo}`}
          </DialogTitle>
          <DialogDescription>
            {loading ? "" : formatarData(reuniao?.data || '')}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="mt-2 text-sm text-muted-foreground">Carregando ata...</span>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="participantes">Participantes</TabsTrigger>
                <TabsTrigger value="acoes">Plano de Ação</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 overflow-auto p-4">
                <TabsContent value="resumo" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Reunião</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium mr-2">Data e Hora:</span>
                          <span>{formatarData(reuniao?.data || '')}</span>
                        </div>
                        {reuniao?.local && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium mr-2">Local:</span>
                            <span>{reuniao.local}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium mr-2">Participantes:</span>
                          <span>{participantes.filter(p => p.presente).length} presentes de {participantes.length} convidados</span>
                        </div>
                      </div>
                      
                      {reuniao?.descricao && (
                        <div className="pt-2 border-t">
                          <h4 className="font-medium mb-2">Descrição/Pauta</h4>
                          <p className="text-sm whitespace-pre-line">{reuniao.descricao}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo da Reunião</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Atividades Reportadas</h4>
                        <p className="text-sm text-muted-foreground">
                          {participantes.filter(p => p.presente && p.registro?.o_que_fiz).length} de {participantes.filter(p => p.presente).length} participantes reportaram atividades
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Plano de Ação</h4>
                        <p className="text-sm text-muted-foreground">
                          {acoes.length} ações registradas
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="participantes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lista de Participantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {participantes.map((participante) => (
                          <div key={participante.id} className="border rounded-md p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participante.employee?.avatar_url} />
                                <AvatarFallback>
                                  {participante.employee?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="font-medium">{participante.employee?.name}</div>
                              </div>
                              
                              {participante.presente ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Presente
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Ausente
                                </Badge>
                              )}
                            </div>
                            
                            {participante.presente && participante.registro && (
                              <div className="space-y-3 text-sm">
                                {participante.registro.o_que_fiz && (
                                  <div>
                                    <div className="font-medium mb-1">O que fiz:</div>
                                    <div className="text-muted-foreground whitespace-pre-line">
                                      {participante.registro.o_que_fiz}
                                    </div>
                                  </div>
                                )}
                                
                                {participante.registro.o_que_vou_fazer && (
                                  <div>
                                    <div className="font-medium mb-1">O que vou fazer:</div>
                                    <div className="text-muted-foreground whitespace-pre-line">
                                      {participante.registro.o_que_vou_fazer}
                                    </div>
                                  </div>
                                )}
                                
                                {participante.registro.dificuldades && (
                                  <div>
                                    <div className="font-medium mb-1">Dificuldades:</div>
                                    <div className="text-muted-foreground whitespace-pre-line">
                                      {participante.registro.dificuldades}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="acoes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plano de Ação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {acoes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma ação registrada para esta reunião.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {acoes.map((acao) => (
                            <div key={acao.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{acao.titulo}</h4>
                                {getBadgeStatus(acao.status)}
                              </div>
                              
                              {acao.descricao && (
                                <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                                  {acao.descricao}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">Responsável:</span>
                                  <span>{acao.responsavel?.name || "Não atribuído"}</span>
                                </div>
                                
                                {acao.prazo && (
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Prazo:</span>
                                    <span>{formatarDataSimples(acao.prazo)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
            
            <DialogFooter className="mt-4 gap-2">
              <ExportarRelatorioReuniao reuniaoId={reuniaoId} />
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
