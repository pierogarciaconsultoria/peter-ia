import { SegmentTemplate } from "./types";

/**
 * Template de indústria de pequeno e médio porte.
 * Processos, indicadores e riscos que praticamente toda fábrica tem.
 * O onboarding aplica o que o usuário marcar; a IA complementa com
 * identidade, pilares, SWOT, objetivos e plano de 90 dias.
 */
export const industriaTemplate: SegmentTemplate = {
  key: 'industria',
  label: 'Indústria',
  subsegments: [
    'Metalmecânica', 'Alimentos e bebidas', 'Plásticos e embalagens', 'Móveis e madeira',
    'Têxtil e confecção', 'Química e cosméticos', 'Eletroeletrônica', 'Gráfica', 'Outro',
  ],
  processes: [
    { key: 'comercial', name: 'Comercial e Atendimento', type: 'Negócio', description: 'Prospecção, orçamento, negociação e entrada de pedidos.', objective: 'Converter oportunidades em pedidos com requisitos claros e viáveis.' },
    { key: 'pcp', name: 'Planejamento e Controle da Produção', type: 'Negócio', description: 'Programação da produção, sequenciamento e controle de prazos.', objective: 'Entregar no prazo com o melhor uso da capacidade.' },
    { key: 'compras', name: 'Compras e Suprimentos', type: 'Apoio', description: 'Seleção e avaliação de fornecedores, cotações e pedidos de compra.', objective: 'Comprar na especificação, no prazo e ao menor custo total.' },
    { key: 'recebimento', name: 'Recebimento e Inspeção de Materiais', type: 'Negócio', description: 'Conferência e inspeção de matéria-prima e insumos.', objective: 'Impedir que material fora de especificação entre na produção.' },
    { key: 'producao', name: 'Produção', type: 'Negócio', description: 'Fabricação, montagem e controle em processo.', objective: 'Produzir conforme especificação, com segurança e sem desperdício.' },
    { key: 'qualidade', name: 'Inspeção Final e Liberação', type: 'Negócio', description: 'Inspeção do produto acabado e liberação para expedição.', objective: 'Garantir que só produto conforme chegue ao cliente.' },
    { key: 'expedicao', name: 'Expedição e Logística', type: 'Negócio', description: 'Embalagem, separação, carregamento e entrega.', objective: 'Entregar completo, no prazo e sem avarias.' },
    { key: 'manutencao', name: 'Manutenção', type: 'Apoio', description: 'Manutenção preventiva e corretiva de máquinas e instalações.', objective: 'Manter os equipamentos disponíveis e seguros.' },
    { key: 'pessoas', name: 'Gestão de Pessoas', type: 'Apoio', description: 'Admissão, treinamento, competências e segurança do trabalho.', objective: 'Ter pessoas competentes e seguras em cada posto.' },
    { key: 'direcao', name: 'Gestão da Direção', type: 'Gestão', description: 'Estratégia, metas, análise crítica e melhoria contínua.', objective: 'Dirigir a empresa com base em dados e decisões registradas.' },
  ],
  indicators: [
    { name: 'OTIF (entregas completas e no prazo)', description: 'Percentual de pedidos entregues completos e na data combinada.', processKey: 'expedicao', goal_type: 'higher_better', goal_value: 95, unit: '%', calculation_type: 'average' },
    { name: 'Refugo e retrabalho', description: 'Percentual da produção refugada ou retrabalhada no mês.', processKey: 'producao', goal_type: 'lower_better', goal_value: 2, unit: '%', calculation_type: 'average' },
    { name: 'Produtividade (peças por hora-homem)', description: 'Unidades produzidas por hora trabalhada.', processKey: 'producao', goal_type: 'higher_better', goal_value: 100, unit: 'un/hh', calculation_type: 'average' },
    { name: 'Paradas não programadas de máquina', description: 'Horas de parada por quebra no mês.', processKey: 'manutencao', goal_type: 'lower_better', goal_value: 8, unit: 'h', calculation_type: 'sum' },
    { name: 'Não conformidades internas', description: 'Quantidade de não conformidades abertas no mês.', processKey: 'qualidade', goal_type: 'lower_better', goal_value: 3, unit: 'un', calculation_type: 'sum' },
    { name: 'Reclamações de clientes', description: 'Reclamações recebidas no mês.', processKey: 'comercial', goal_type: 'lower_better', goal_value: 1, unit: 'un', calculation_type: 'sum' },
    { name: 'Materiais reprovados no recebimento', description: 'Percentual de lotes reprovados na inspeção de recebimento.', processKey: 'recebimento', goal_type: 'lower_better', goal_value: 3, unit: '%', calculation_type: 'average' },
    { name: 'Aderência ao programa de produção', description: 'Percentual das ordens concluídas na data programada.', processKey: 'pcp', goal_type: 'higher_better', goal_value: 90, unit: '%', calculation_type: 'average' },
    { name: 'Acidentes de trabalho', description: 'Acidentes com afastamento no mês.', processKey: 'pessoas', goal_type: 'lower_better', goal_value: 0, unit: 'un', calculation_type: 'sum' },
    { name: 'Horas de treinamento por colaborador', description: 'Média de horas de treinamento por pessoa no mês.', processKey: 'pessoas', goal_type: 'higher_better', goal_value: 2, unit: 'h', calculation_type: 'average' },
    { name: 'Faturamento', description: 'Receita bruta do mês.', processKey: 'direcao', goal_type: 'higher_better', goal_value: 0, unit: 'R$', calculation_type: 'sum' },
    { name: 'Margem de contribuição', description: 'Percentual da receita que sobra após custos variáveis.', processKey: 'direcao', goal_type: 'higher_better', goal_value: 30, unit: '%', calculation_type: 'average' },
  ],
  risks: [
    { title: 'Parada de equipamento crítico', description: 'Quebra de máquina sem reserva interrompe a produção.', category: 'Operacional', processKey: 'manutencao', probability: 3, impact: 5, mitigation_plan: 'Plano de manutenção preventiva e peças críticas em estoque.' },
    { title: 'Dependência de fornecedor único', description: 'Insumo essencial com uma única fonte de fornecimento.', category: 'Suprimentos', processKey: 'compras', probability: 3, impact: 4, mitigation_plan: 'Homologar segundo fornecedor e manter estoque de segurança.' },
    { title: 'Matéria-prima fora de especificação', description: 'Material não conforme entra na produção e gera refugo ou devolução.', category: 'Qualidade', processKey: 'recebimento', probability: 3, impact: 4, mitigation_plan: 'Plano de inspeção de recebimento e avaliação de fornecedores.' },
    { title: 'Falta de mão de obra qualificada', description: 'Dificuldade de contratar e reter operadores treinados.', category: 'Pessoas', processKey: 'pessoas', probability: 4, impact: 3, mitigation_plan: 'Matriz de competências, treinamento interno e plano de retenção.' },
    { title: 'Atraso de entrega ao cliente', description: 'Pedidos saem fora do prazo por falha de programação ou capacidade.', category: 'Operacional', processKey: 'pcp', probability: 3, impact: 4, mitigation_plan: 'Programação semanal com capacidade real e acompanhamento diário.' },
    { title: 'Acidente de trabalho', description: 'Lesão em operação de máquina ou movimentação de carga.', category: 'Segurança', processKey: 'producao', probability: 2, impact: 5, mitigation_plan: 'EPIs, proteções de máquina, treinamento e inspeções de segurança.' },
  ],
};
