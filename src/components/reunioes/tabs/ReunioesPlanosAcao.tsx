
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
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { NovaAcaoDialog } from "../NovaAcaoDialog";

type Acao = {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: string;
  reuniao: {
    titulo: string;
    data: string;
  };
  responsavel: {
    name: string;
  };
}

export function ReunioesPlanosAcao() {
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [loading, setLoading] = useState(true);
  const [acaoSelecionada, setAcaoSelecionada] = useState<Acao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAcoes();
  }, []);

  async function fetchAcoes() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reunioes_acoes')
        .select(`
          id,
          titulo,
          descricao,
          prazo,
          status,
          reuniao:reunioes(titulo, data),
          responsavel:employees(name)
        `)
        .order('prazo', { ascending: true });
      
      if (error) throw error;
      
      setAcoes(data || []);
    } catch (error) {
      console.error("Erro ao buscar ações:", error);
      toast.error("Não foi possível carregar o plano de ação");
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataString: string) {
    if (!dataString) return "Sem prazo";
    
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

  function abrirNovaPlanAcao() {
    setAcaoSelecionada(null);
    setIsDialogOpen(true);
  }

  function editarAcao(acao: Acao) {
    setAcaoSelecionada(acao);
    setIsDialogOpen(true);
  }

  function isPrazoVencido(prazo: string) {
    if (!prazo) return false;
    
    try {
      const dataPrazo = new Date(prazo);
      const hoje = new Date();
      return dataPrazo < hoje;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirNovaPlanAcao}>Nova Ação</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="mt-2 text-sm text-muted-foreground">Carregando plano de ação...</span>
          </div>
        </div>
      ) : acoes.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma ação registrada</h3>
            <p className="text-muted-foreground mb-4">
              Não há ações registradas no plano de ação.
            </p>
            <Button onClick={abrirNovaPlanAcao}>Criar Nova Ação</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Reunião</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acoes.map((acao) => (
                  <TableRow key={acao.id}>
                    <TableCell>
                      <div className="font-medium">{acao.titulo}</div>
                      {acao.descricao && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {acao.descricao}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {acao.reuniao ? acao.reuniao.titulo : "Não vinculada"}
                    </TableCell>
                    <TableCell>
                      {acao.responsavel ? acao.responsavel.name : "Não atribuído"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {isPrazoVencido(acao.prazo) && acao.status !== "concluido" ? (
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        <span className={isPrazoVencido(acao.prazo) && acao.status !== "concluido" ? "text-red-500" : ""}>
                          {formatarData(acao.prazo)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBadgeStatus(acao.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => editarAcao(acao)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          {acao.status !== "concluido" && (
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              <span>Marcar como concluída</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
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

      <NovaAcaoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        acao={acaoSelecionada}
        onSave={() => {
          fetchAcoes();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
