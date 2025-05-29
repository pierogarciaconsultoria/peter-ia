
import { useState } from "react";

export function useRecruitmentData() {
  // Mock data for recruitment processes
  const [recruitmentProcesses] = useState([
    {
      id: "rp1",
      title: "Desenvolvedor React Senior",
      department: "Tecnologia",
      applications: 24,
      openDate: "2023-09-15",
      status: "active",
      positions: 2,
      stage: "entrevista",
      isPublic: true,
      externalUrl: "job-portal/dev-react-senior",
      description: "Estamos em busca de um desenvolvedor React Senior para atuar em projetos desafiadores..."
    },
    {
      id: "rp2",
      title: "Analista de RH",
      department: "Recursos Humanos",
      applications: 15,
      openDate: "2023-10-01",
      status: "active",
      positions: 1,
      stage: "teste",
      isPublic: false,
      externalUrl: "",
      description: "Vaga para analista de RH com experiência em recrutamento e seleção..."
    },
    {
      id: "rp3",
      title: "Gerente de Operações",
      department: "Operações",
      applications: 8,
      openDate: "2023-08-20",
      status: "closed",
      positions: 1,
      stage: "finalizado",
      isPublic: false,
      externalUrl: "",
      description: "Buscamos gerente de operações com experiência em gestão de equipes..."
    }
  ]);

  // Mock data for candidates
  const [topCandidates] = useState([
    {
      id: "c1",
      name: "Ana Silva",
      position: "Desenvolvedor React Senior",
      score: 92,
      status: "finalista",
      avatar: ""
    },
    {
      id: "c2",
      name: "Marco Oliveira",
      position: "Analista de RH",
      score: 88,
      status: "entrevista",
      avatar: ""
    },
    {
      id: "c3",
      name: "Julia Santos",
      position: "Desenvolvedor React Senior",
      score: 85,
      status: "teste técnico",
      avatar: ""
    }
  ]);

  // Public job openings - filtered from recruitmentProcesses
  const publicJobOpenings = recruitmentProcesses.filter(job => job.isPublic && job.status === "active");

  return {
    recruitmentProcesses,
    topCandidates,
    publicJobOpenings
  };
}
