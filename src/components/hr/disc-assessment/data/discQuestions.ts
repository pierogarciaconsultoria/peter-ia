export interface DiscQuestion {
  id: string;
  question: string;
  options: {
    value: 'D' | 'I' | 'S' | 'C';
    label: string;
  }[];
}

export const discQuestions: DiscQuestion[] = [
  {
    id: "q1",
    question: "Como você se comporta em situações de pressão?",
    options: [
      { value: "D", label: "Tomo decisões rapidamente e sigo em frente" },
      { value: "I", label: "Converso com outros para aliviar a pressão" },
      { value: "S", label: "Mantenho a calma e sigo um plano estabelecido" },
      { value: "C", label: "Analiso a situação detalhadamente antes de agir" }
    ]
  },
  {
    id: "q2",
    question: "Ao trabalhar em equipe, você prefere:",
    options: [
      { value: "D", label: "Liderar e direcionar a equipe" },
      { value: "I", label: "Motivar e entusiasmar os membros da equipe" },
      { value: "S", label: "Apoiar os outros e manter a harmonia" },
      { value: "C", label: "Garantir que tudo seja feito corretamente" }
    ]
  },
  {
    id: "q3",
    question: "Quando enfrenta um problema, você geralmente:",
    options: [
      { value: "D", label: "Age rapidamente para resolver o problema" },
      { value: "I", label: "Discute com outros para encontrar soluções criativas" },
      { value: "S", label: "Considera como a solução afetará as pessoas envolvidas" },
      { value: "C", label: "Reúne todos os fatos e considera cuidadosamente as opções" }
    ]
  },
  {
    id: "q4",
    question: "Em relação a regras e procedimentos, você:",
    options: [
      { value: "D", label: "Questiona ou ignora regras que atrasam resultados" },
      { value: "I", label: "Prefere flexibilidade e espaço para criatividade" },
      { value: "S", label: "Segue regras e procedimentos estabelecidos" },
      { value: "C", label: "Valoriza regras claras e consistentes" }
    ]
  },
  {
    id: "q5",
    question: "Ao comunicar ideias, você tende a:",
    options: [
      { value: "D", label: "Ser direto e ir direto ao ponto" },
      { value: "I", label: "Ser animado e usar linguagem expressiva" },
      { value: "S", label: "Ser gentil e considerar os sentimentos dos outros" },
      { value: "C", label: "Ser preciso e fornecer detalhes" }
    ]
  },
  {
    id: "q6",
    question: "No ambiente de trabalho, você valoriza mais:",
    options: [
      { value: "D", label: "Resultados e progresso" },
      { value: "I", label: "Reconhecimento e aprovação" },
      { value: "S", label: "Estabilidade e cooperação" },
      { value: "C", label: "Qualidade e precisão" }
    ]
  },
  {
    id: "q7",
    question: "Quando você discorda de alguém, você geralmente:",
    options: [
      { value: "D", label: "Expressa sua opinião diretamente" },
      { value: "I", label: "Tenta persuadir com entusiasmo" },
      { value: "S", label: "Evita conflito e busca compromisso" },
      { value: "C", label: "Apresenta evidências lógicas para seu ponto de vista" }
    ]
  },
  {
    id: "q8",
    question: "Em relação à mudança, você:",
    options: [
      { value: "D", label: "Abraça mudanças que levam a melhores resultados" },
      { value: "I", label: "Gosta de mudanças que trazem novas oportunidades de interação" },
      { value: "S", label: "Prefere mudanças graduais e bem planejadas" },
      { value: "C", label: "Aceita mudanças quando bem justificadas com dados" }
    ]
  },
  {
    id: "q9",
    question: "Ao tomar decisões, você tende a:",
    options: [
      { value: "D", label: "Decidir rapidamente com base em resultados" },
      { value: "I", label: "Confiar em seus instintos e no que parece bom" },
      { value: "S", label: "Considerar como a decisão afetará os outros" },
      { value: "C", label: "Analisar cuidadosamente todas as opções" }
    ]
  },
  {
    id: "q10",
    question: "Quando trabalha em projetos, você prefere:",
    options: [
      { value: "D", label: "Ter controle sobre o resultado final" },
      { value: "I", label: "Colaborar com outros de forma criativa" },
      { value: "S", label: "Seguir um processo estabelecido e confiável" },
      { value: "C", label: "Ter instruções claras e padrões definidos" }
    ]
  }
];
