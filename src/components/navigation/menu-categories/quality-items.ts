import { 
  Building, AlertTriangle, FileText, ClipboardCheck, 
  ThumbsUp, SlidersHorizontal, Truck, BarChart3, Cog,
  ClipboardList, Check, CalendarClock, CheckSquare, Users, Book, List
} from "lucide-react";
import { MenuItem } from "../types";

export const qualityItems: MenuItem[] = [
  {
    title: "Qualidade",
    icon: ClipboardCheck,
    href: "#",
    modulo: "qualidade",
    children: [
      { 
        title: "Contexto da Organização", 
        icon: Building, 
        href: "/organization-context", 
        modulo: "contexto_organizacao" 
      },
      { 
        title: "Partes Interessadas", 
        icon: Users, 
        href: "/stakeholders", 
        modulo: "partes_interessadas" 
      },
      { 
        title: "Gerenciamento de Riscos", 
        icon: AlertTriangle, 
        href: "/risk-management", 
        modulo: "gerenciamento_riscos" 
      },
      { 
        title: "Política da Qualidade", 
        icon: FileText, 
        href: "/quality-policy", 
        modulo: "politica_qualidade" 
      },
      { 
        title: "Objetivos da Qualidade", 
        icon: ClipboardCheck, 
        href: "/quality-objectives", 
        modulo: "objetivos_qualidade" 
      },
      { 
        title: "Informação documentada", 
        icon: FileText, 
        href: "/documents", 
        modulo: "informacao_documentada" 
      },
      { 
        title: "Avaliação de Provedores Externos", 
        icon: Truck, 
        href: "/supplier-evaluation", 
        modulo: "avaliacao_fornecedores" 
      },
      { 
        title: "Inspeção de Matéria Prima", 
        icon: BarChart3, 
        href: "/raw-material-inspection", 
        modulo: "inspecao_materia_prima" 
      },
      { 
        title: "Calibração de Equipamentos", 
        icon: Cog, 
        href: "/equipment-calibration", 
        modulo: "calibracao_equipamentos" 
      },
      { 
        title: "Produtos Não Conforme", 
        icon: AlertTriangle, 
        href: "/non-conforming-products", 
        modulo: "produtos_nao_conformes" 
      },
      { 
        title: "Controle de Qualidade", 
        icon: SlidersHorizontal, 
        href: "/quality-control", 
        modulo: "controle_qualidade" 
      },
      { 
        title: "Reclamações de Clientes", 
        icon: ThumbsUp, 
        href: "/customer-complaints", 
        modulo: "reclamacoes_clientes" 
      },
      { 
        title: "Pesquisa de Satisfação", 
        icon: ThumbsUp, 
        href: "/satisfaction-survey", 
        modulo: "pesquisa_satisfacao" 
      },
      { 
        title: "Não Conformidades e ação corretiva", 
        icon: AlertTriangle, 
        href: "/non-compliance", 
        modulo: "nao_conformidades" 
      },
      { 
        title: "Auditoria", 
        icon: CheckSquare, 
        href: "/audit",             // Agora tudo linka pra /audit
        modulo: "auditoria"
      },
      { 
        title: "Análise Crítica", 
        icon: ClipboardCheck, 
        href: "/critical-analysis", 
        modulo: "analise_critica" 
      },
    ]
  }
];
