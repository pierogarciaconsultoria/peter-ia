
import { ProcessMapping } from '@/types/analysis-integration';

export class ProcessMapper {
  static mapProcesses(aiSuggestions: any, companyData: any): ProcessMapping[] {
    const processes: ProcessMapping[] = [];
    
    // Processos baseados no setor da empresa
    const sector = companyData.company_sector || 'Geral';
    const defaultProcesses = this.getDefaultProcessesBySector(sector);
    
    defaultProcesses.forEach((process, index) => {
      processes.push({
        name: process.name,
        description: process.description,
        objective: process.objective,
        processType: 'Operacional',
        owner: 'A definir',
        status: 'Ativo',
        version: '1.0'
      });
    });

    return processes;
  }

  private static getDefaultProcessesBySector(sector: string) {
    const processMap: Record<string, any[]> = {
      'Tecnologia': [
        { name: 'Desenvolvimento de Software', description: 'Processo de desenvolvimento de produtos de software', objective: 'Entregar software de qualidade' },
        { name: 'Suporte Técnico', description: 'Atendimento e suporte aos clientes', objective: 'Resolver problemas técnicos rapidamente' }
      ],
      'Manufatura': [
        { name: 'Produção', description: 'Processo de fabricação de produtos', objective: 'Produzir com qualidade e eficiência' },
        { name: 'Controle de Qualidade', description: 'Verificação da qualidade dos produtos', objective: 'Garantir padrões de qualidade' }
      ],
      'Serviços': [
        { name: 'Atendimento ao Cliente', description: 'Processo de atendimento e relacionamento', objective: 'Satisfazer as necessidades dos clientes' },
        { name: 'Prestação de Serviços', description: 'Execução dos serviços contratados', objective: 'Entregar serviços de excelência' }
      ]
    };

    return processMap[sector] || [
      { name: 'Processo Principal', description: 'Processo core da organização', objective: 'Atingir os objetivos organizacionais' }
    ];
  }
}
