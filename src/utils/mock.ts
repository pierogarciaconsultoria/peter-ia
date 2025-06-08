
export interface MockTask {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
}

export const generateRandomData = (count: number): MockTask[] => {
  const tasks: MockTask[] = [];
  const statuses = ['Pendente', 'Em Andamento', 'Concluído', 'Atrasado'];
  const taskTitles = [
    'Revisar documentação',
    'Implementar melhorias',
    'Realizar auditoria',
    'Atualizar sistema',
    'Treinamento equipe',
    'Análise de riscos',
    'Verificação qualidade',
    'Manutenção equipamentos'
  ];

  for (let i = 0; i < count; i++) {
    tasks.push({
      id: `task-${i + 1}`,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    });
  }

  return tasks;
};
