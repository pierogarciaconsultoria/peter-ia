
import { ISODocument } from "@/utils/isoTypes";

export async function fetchDocumentsForSelection(): Promise<ISODocument[]> {
  console.log('Job position service - using mock documents until database setup');
  
  // Mock documents since iso_documents table doesn't exist
  const mockDocuments: ISODocument[] = [
    {
      id: '1',
      title: 'Manual de Qualidade',
      document_type: 'manual',
      description: 'Manual principal do sistema de qualidade',
      content: 'Conteúdo do manual...',
      associated_requirement: '4.1',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      document_code: 'MQ-001',
      revision: '02'
    },
    {
      id: '2',
      title: 'Procedimento de Controle de Documentos',
      document_type: 'procedure',
      description: 'Procedimento para controle de documentos',
      content: 'Conteúdo do procedimento...',
      associated_requirement: '4.2.3',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      document_code: 'PR-001',
      revision: '01'
    }
  ];
  
  return mockDocuments;
}
