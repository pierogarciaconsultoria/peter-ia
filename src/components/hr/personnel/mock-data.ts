
import { PersonnelRequest } from "./types";

export const mockRequests: PersonnelRequest[] = [
  {
    id: "1",
    type: "Admissão",
    department: "Produção",
    position: "Operador de Máquina",
    position_id: "pos-123",
    requestDate: "2023-09-15",
    status: "pending",
    requester: "João Silva",
    requester_id: "emp-123",
    employeeName: "Marcos Oliveira",
    justification: "Necessidade de reposição devido ao aumento de produção."
  },
  {
    id: "2",
    type: "Aumento salarial",
    department: "Administrativo",
    position: "Auxiliar Administrativo",
    position_id: "pos-456",
    requestDate: "2023-09-10",
    status: "approved",
    requester: "Maria Santos",
    requester_id: "emp-456",
    approved_by: "Carlos Mendes",
    approval_date: "2023-09-12",
    employeeName: "Ana Paula",
    currentSalary: "R$ 2.500,00",
    proposedSalary: "R$ 2.800,00",
    justification: "Aumento de responsabilidades e bom desempenho."
  },
  {
    id: "3",
    type: "Demissão",
    department: "Comercial",
    position: "Vendedor",
    position_id: "pos-789",
    requestDate: "2023-09-08",
    status: "rejected",
    requester: "Paula Ferreira",
    requester_id: "emp-789",
    employeeName: "Roberto Almeida",
    rejection_reason: "Não foi apresentada justificativa suficiente para o desligamento."
  },
  {
    id: "4",
    type: "Mudança de horário",
    department: "TI",
    position: "Desenvolvedor",
    position_id: "pos-101",
    requestDate: "2023-09-05",
    status: "pending",
    requester: "Eduardo Costa",
    requester_id: "emp-101",
    employeeName: "Fernanda Lima",
    justification: "Necessidade de ajuste de horário para cursar especialização."
  }
];
