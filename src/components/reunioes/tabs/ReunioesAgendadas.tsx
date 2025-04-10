
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DetalheReuniaoDialog } from "../DetalheReuniaoDialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

type Reuniao = {
  id: string;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  participantes_count: number;
}

export function ReunioesAgendadas() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReunioes();
  }, []);

  async function fetchReunioes() {
    try {
      setLoading(true);
      
      // Buscar reuniões futuras
      const { data: reunioesData, error: reunioesError } = await supabase
        .from('reunioes')
        .select(`
          id,
          titulo,
          data,
          local,
          descricao
        `)
        .gt('data', new Date().toISOString())
        .order('data', { ascending: true });
      
      if (reunioesError) throw reunioesError;
      
      // Buscar contagem de participantes para cada reunião
      const reunioesProcessadas: Reuniao[] = [];
      
      for (const reuniao of reunioesData || []) {
        const { count, error: countError } = await supabase
          .from('reunioes_participantes')
          .select('*', { count: 'exact', head: true })
          .eq('reuniao_id', reuniao.id);
          
        if (countError) throw countError;
        
        reunioesProcessadas.push({
          ...reuniao,
          participantes_count: count || 0
        });
      }
      
      setReunioes(reunioesProcessadas);
    } catch (error) {
      console.error("Erro ao buscar reuniões:", error);
      toast.error("Não foi possível carregar as reuniões");
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

  function abrirDetalhes(id: string) {
    setReuniaoSelecionada(id);
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="mt-2 text-sm text-muted-foreground">Carregando reuniões...</span>
          </div>
        </div>
      ) : reunioes.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma reunião agendada</h3>
            <p className="text-muted-foreground mb-4">
              Você não tem reuniões agendadas para os próximos dias.
            </p>
            <Button onClick={() => {}}>Agendar Nova Reunião</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reunioes.map((reuniao) => (
                  <TableRow key={reuniao.id} className="cursor-pointer hover:bg-muted/50" onClick={() => abrirDetalhes(reuniao.id)}>
                    <TableCell>
                      <div className="font-medium">{reuniao.titulo}</div>
                      {reuniao.descricao && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {reuniao.descricao}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatarData(reuniao.data)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{reuniao.local || "Não especificado"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{reuniao.participantes_count}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); abrirDetalhes(reuniao.id); }}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Realizar Reunião</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Cancelar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {reuniaoSelecionada && (
        <DetalheReuniaoDialog 
          reuniaoId={reuniaoSelecionada}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onRealizarReuniao={() => fetchReunioes()}
        />
      )}
    </div>
  );
}
