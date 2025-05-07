
import { Employee } from "@/components/hr/types/employee";

/**
 * Generates mock employee data for demonstration purposes
 * @returns Array of mock employee objects
 */
export const generateMockEmployees = (): Employee[] => {
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@exemplo.com",
      department: "Produção",
      position: "Gerente de Produção",
      position_id: "pos1", 
      status: "active",
      hire_date: "2020-03-15",
      avatar_url: "",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria.oliveira@exemplo.com",
      department: "Recursos Humanos",
      position: "Coordenadora de RH",
      position_id: "pos2",
      status: "active",
      hire_date: "2019-08-22",
      avatar_url: "",
    },
    {
      id: "3",
      name: "Pedro Santos",
      email: "pedro.santos@exemplo.com",
      department: "TI",
      position: "Desenvolvedor Sênior",
      position_id: "pos3",
      status: "active",
      hire_date: "2021-01-10",
      avatar_url: "",
    },
    {
      id: "4",
      name: "Ana Ferreira",
      email: "ana.ferreira@exemplo.com",
      department: "Vendas",
      position: "Executiva de Contas",
      position_id: "pos4",
      status: "on_leave",
      hire_date: "2018-11-05",
      avatar_url: "",
    },
    {
      id: "5",
      name: "Carlos Mendes",
      email: "carlos.mendes@exemplo.com",
      department: "Financeiro",
      position: "Analista Financeiro",
      position_id: "pos5",
      status: "inactive",
      hire_date: "2017-05-18",
      avatar_url: "",
    },
  ];
};
