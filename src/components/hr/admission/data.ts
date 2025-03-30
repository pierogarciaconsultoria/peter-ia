
import { AdmissionProcess } from "./types";

export const mockAdmissionProcesses: AdmissionProcess[] = [
  {
    id: "adm1",
    name: "João Silva",
    position: "Desenvolvedor React",
    department: "Tecnologia",
    startDate: "2023-10-25",
    status: "documentos_pendentes",
    completion: 65,
    email: "joao.silva@example.com",
    phone: "5511987654321"
  },
  {
    id: "adm2",
    name: "Maria Souza",
    position: "Analista de Marketing",
    department: "Marketing",
    startDate: "2023-11-01",
    status: "exame_medico",
    completion: 40,
    email: "maria.souza@example.com"
  },
  {
    id: "adm3",
    name: "Carlos Santos",
    position: "Gerente de Projetos",
    department: "Operações",
    startDate: "2023-10-15",
    status: "contrato_assinado",
    completion: 85,
    phone: "5511998765432"
  },
  {
    id: "adm4",
    name: "Ana Oliveira",
    position: "Designer UX",
    department: "Tecnologia",
    startDate: "2023-11-05",
    status: "documentos_enviados",
    completion: 25,
    email: "ana.oliveira@example.com",
    phone: "5511987651234"
  }
];
