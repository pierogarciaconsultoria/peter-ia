
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmployeeDirectory } from "@/components/hr/EmployeeDirectory";

interface AtividadeRegistro {
  id: string;
  reuniao_id: string;
  reuniao: {
    titulo: string;
    data: string;
  };
  o_que_fiz: string;
  o_que_vou_fazer: string;
  dificuldades: string;
}

export function MinhasAtividades() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [atividades, setAtividades] = useState<AtividadeRegistro[]>([]);
  const [employee, setEmployee] = useState<{ id: string } | null>(null);
  
  // Campos de edição
  const [atividadeAtual, setAtividadeAtual] = useState<AtividadeRegistro | null>(null);
  const [oQueFiz, setOQueFiz] = useState("");
  const [oQueVouFazer, setOQueVouFazer] = useState("");
  const [dificuldades, setDificuldades] = useState("");

  useEffect(() => {
    if (user?.id) {
      buscarFuncionario();
    }
  }, [user]);

  useEffect(() => {
    if (employee?.id) {
      buscarAtividades();
    }
  }, [employee]);

  useEffect(() => {
    if (atividadeAtual) {
      setOQueFiz(atividadeAtual.o_que_fiz || "");
      setOQueVouFazer(atividadeAtual.o_que_vou_fazer || "");
      setDificuldades(atividadeAtual.dificuldades || "");
    } else {
      setOQueFiz("");
      setOQueVouFazer("");
      setDificuldades("");
    }
  }, [atividadeAtual]);

  async function buscarFuncionario() {
    try {
      // Buscar o funcionário associado ao usuário logado
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('email', user?.email)
        .single();
      
      if (error) throw error;
      
      setEmployee(data);
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      toast.error("Não foi possível identificar seu cadastro de funcionário");
    }
  }

  async function buscarAtividades() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reunioes_registros')
        .select(`
          id,
          reuniao_id,
          o_que_fiz,
          o_que_vou_fazer,
          dificuldades,
          reuniao:reunioes(titulo, data)
        `)
        .eq('employee_id', employee?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAtividades(data || []);
      
      // Selecionar a atividade mais recente
      if (data && data.length > 0) {
        setAtividadeAtual(data[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      toast.error("Não foi possível carregar suas atividades");
    } finally {
      setLoading(false);
    }
  }

  async function salvarAtividade() {
    if (!employee?.id || !atividadeAtual?.reuniao_id) {
      toast.error("Dados de funcionário ou reunião inválidos");
      return;
    }
    
    try {
      setSalvando(true);
      
      const { error } = await supabase
        .from('reunioes_registros')
        .update({
          o_que_fiz: oQueFiz,
          o_que_vou_fazer: oQueVouFazer,
          dificuldades: dificuldades
        })
        .eq('id', atividadeAtual.id);
      
      if (error) throw error;
      
      toast.success("Atividades atualizadas com sucesso");
      buscarAtividades();
    } catch (error) {
      console.error("Erro ao salvar atividades:", error);
      toast.error("Não foi possível salvar suas atividades");
    } finally {
      setSalvando(false);
    }
  }

  function selecionarAtividade(atividade: AtividadeRegistro) {
    setAtividadeAtual(atividade);
  }

  function formatarData(dataString: string) {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-2">Cadastro não encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Não foi possível encontrar seu cadastro como funcionário. Entre em contato com o RH.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="mt-2 text-sm text-muted-foreground">Carregando suas atividades...</span>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minhas Reuniões</CardTitle>
              </CardHeader>
              <CardContent>
                {atividades.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Você ainda não participou de nenhuma reunião.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {atividades.map((atividade) => (
                      <Button
                        key={atividade.id}
                        variant={atividadeAtual?.id === atividade.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => selecionarAtividade(atividade)}
                      >
                        <div>
                          <div className="font-medium">{atividade.reuniao.titulo}</div>
                          <div className="text-xs opacity-70">{formatarData(atividade.reuniao.data)}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {atividadeAtual ? `Registro: ${atividadeAtual.reuniao.titulo}` : "Selecione uma reunião"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!atividadeAtual ? (
                  <p className="text-sm text-muted-foreground">
                    Selecione uma reunião para ver ou atualizar seu registro de atividades.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">O que fiz?</label>
                      <Textarea 
                        placeholder="Descreva as atividades que você realizou" 
                        className="min-h-[100px]"
                        value={oQueFiz}
                        onChange={(e) => setOQueFiz(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">O que vou fazer?</label>
                      <Textarea 
                        placeholder="Descreva as atividades que planeja realizar" 
                        className="min-h-[100px]"
                        value={oQueVouFazer}
                        onChange={(e) => setOQueVouFazer(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Dificuldades</label>
                      <Textarea 
                        placeholder="Descreva as dificuldades ou impedimentos encontrados" 
                        className="min-h-[100px]"
                        value={dificuldades}
                        onChange={(e) => setDificuldades(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full md:w-auto" 
                        onClick={salvarAtividade}
                        disabled={salvando}
                      >
                        {salvando ? "Salvando..." : "Salvar Atividades"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
