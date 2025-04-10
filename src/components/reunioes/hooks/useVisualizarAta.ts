
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Participante, Acao, ReuniaoDetalhes, Registro } from "../types";

export function useVisualizarAta(reuniaoId: string, isOpen: boolean) {
  const [activeTab, setActiveTab] = useState('resumo');
  const [loading, setLoading] = useState(true);
  const [reuniao, setReuniao] = useState<ReuniaoDetalhes | null>(null);
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
          reuniao_id,
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
        const employee = participante.employee as { name: string; avatar_url?: string };
        const registro = registrosData?.find(r => 
          r.employee_id && employee && r.employee_id === registrosData.find(reg => 
            reg.employee_id && employee.name === participantesData.find(
              p => (p.employee as any)?.name === employee.name
            )?.employee?.name
          )?.employee_id
        );
        
        return {
          id: participante.id,
          reuniao_id: participante.reuniao_id,
          presente: participante.presente,
          employee: employee,
          registro: registro as Registro | undefined
        } as Participante;
      });
      
      setParticipantes(participantesComRegistros);
      
      const { data: acoesData, error: acoesError } = await supabase
        .from('reunioes_acoes')
        .select(`
          id,
          reuniao_id,
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

  return {
    activeTab,
    setActiveTab,
    loading,
    reuniao,
    participantes,
    acoes
  };
}
