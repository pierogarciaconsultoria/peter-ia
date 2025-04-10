export interface Reuniao {
  id: string;
  titulo: string;
  data: string;
  local?: string;
  descricao?: string;
  criado_por?: string;
  created_at: string;
  updated_at: string;
}

export interface Participante {
  id: string;
  reuniao_id: string;
  employee_id?: string;
  presente: boolean;
  employee?: {
    name: string;
    avatar_url?: string;
  };
  registro?: Registro;
}

export interface Registro {
  id: string;
  reuniao_id: string;
  employee_id: string;
  o_que_fiz?: string;
  o_que_vou_fazer?: string;
  dificuldades?: string;
  created_at: string;
  updated_at: string;
}

export interface Acao {
  id?: string;
  reuniao_id?: string;
  titulo: string;
  descricao?: string;
  responsavel_id?: string;
  responsavel?: {
    name: string;
  };
  prazo?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VisualizarAtaProps {
  reuniaoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface ReuniaoDetalhes {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  criado_por: string;
}
