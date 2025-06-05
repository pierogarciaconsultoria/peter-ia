
import { supabase } from '@/integrations/supabase/client';

export interface TrainingRequirement {
  id: string;
  title: string;
  description: string;
  frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly';
  target_audience: string[];
  related_documents: string[];
}

export const generateTrainingFromProcedure = async (procedureId: string): Promise<TrainingRequirement[]> => {
  try {
    console.log('Generating training from procedure - using mock data until iso_documents table exists');
    
    // Mock training requirements since iso_documents table doesn't exist
    const mockTrainingRequirements: TrainingRequirement[] = [
      {
        id: '1',
        title: 'Treinamento em Controle de Documentos',
        description: 'Treinamento obrigatório sobre os procedimentos de controle de documentos conforme ISO 9001',
        frequency: 'annual',
        target_audience: ['all_employees'],
        related_documents: [procedureId]
      },
      {
        id: '2',
        title: 'Treinamento em Qualidade',
        description: 'Capacitação em procedimentos de qualidade e melhoria contínua',
        frequency: 'biannual',
        target_audience: ['quality_team'],
        related_documents: [procedureId]
      }
    ];

    return mockTrainingRequirements;
  } catch (error) {
    console.error('Error generating training from procedure:', error);
    return [];
  }
};

export const getRelatedDocuments = async (trainingId: string) => {
  try {
    console.log('Getting related documents - using mock data until iso_documents table exists');
    
    // Mock related documents
    return [
      {
        id: '1',
        title: 'Manual de Qualidade',
        document_code: 'MQ-001'
      },
      {
        id: '2', 
        title: 'Procedimento de Controle de Documentos',
        document_code: 'PR-001'
      }
    ];
  } catch (error) {
    console.error('Error fetching related documents:', error);
    return [];
  }
};
