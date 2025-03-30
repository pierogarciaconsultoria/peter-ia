
import { PersonnelRequest } from "./types";

// Mock data for personnel movement requests
export const mockRequests: PersonnelRequest[] = [
  {
    id: "1",
    type: "hiring",
    department: "Engenharia",
    position: "Engenheiro de Produção",
    position_id: "pos-001",
    requestDate: "2023-07-15",
    status: "pending",
    requester: "João Silva"
  },
  {
    id: "2",
    type: "transfer",
    department: "Financeiro",
    position: "Analista Financeiro",
    position_id: "pos-002",
    requestDate: "2023-07-10",
    status: "approved",
    requester: "Maria Oliveira"
  },
  {
    id: "3",
    type: "termination",
    department: "TI",
    position: "Desenvolvedor Frontend",
    position_id: "pos-003",
    requestDate: "2023-07-05",
    status: "rejected",
    requester: "Pedro Santos"
  },
  {
    id: "4",
    type: "salary_change",
    department: "Marketing",
    position: "Coordenador de Marketing",
    position_id: "pos-004",
    requestDate: "2023-07-01",
    status: "pending",
    requester: "Ana Costa"
  }
];
