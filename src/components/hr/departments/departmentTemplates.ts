
interface TraditionalDepartment {
  name: string;
  description: string;
  sector: string;
}

export const traditionalDepartments: TraditionalDepartment[] = [
  {
    name: "Produção",
    description: "Responsável pela fabricação de produtos, controle de qualidade e gestão da linha de produção.",
    sector: "Operacional"
  },
  {
    name: "Manutenção",
    description: "Responsável pela manutenção preventiva e corretiva de máquinas e equipamentos.",
    sector: "Operacional"
  },
  {
    name: "Logística",
    description: "Responsável pelo recebimento de materiais, gestão de estoques e expedição de produtos.",
    sector: "Operacional"
  },
  {
    name: "Qualidade",
    description: "Responsável por garantir os padrões de qualidade dos produtos e processos.",
    sector: "Operacional"
  },
  {
    name: "Engenharia",
    description: "Responsável pelo desenvolvimento de produtos, processos e melhorias técnicas.",
    sector: "Técnico"
  },
  {
    name: "Recursos Humanos",
    description: "Responsável pelo recrutamento, seleção, treinamento e gestão de pessoas.",
    sector: "Administrativo"
  },
  {
    name: "Comercial",
    description: "Responsável pelas vendas, relacionamento com clientes e desenvolvimento de negócios.",
    sector: "Administrativo"
  },
  {
    name: "Financeiro",
    description: "Responsável pelo controle financeiro, orçamentos, contas a pagar e receber.",
    sector: "Administrativo"
  },
  {
    name: "Compras",
    description: "Responsável pela aquisição de matérias-primas, insumos e gestão de fornecedores.",
    sector: "Administrativo"
  },
  {
    name: "Tecnologia da Informação",
    description: "Responsável pela infraestrutura tecnológica, sistemas e suporte técnico.",
    sector: "Administrativo"
  },
  {
    name: "P&D",
    description: "Responsável pela pesquisa e desenvolvimento de novos produtos e inovações.",
    sector: "Técnico"
  },
  {
    name: "Marketing",
    description: "Responsável pela promoção da marca, produtos e comunicação com o mercado.",
    sector: "Administrativo"
  }
];
