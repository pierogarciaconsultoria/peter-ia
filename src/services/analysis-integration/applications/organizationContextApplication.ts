
import { OrganizationContextMapping } from '@/types/analysis-integration';
import { createOrganizationContext } from '@/services/organizationContextService';

export class OrganizationContextApplication {
  static async applyOrganizationContext(contexts: OrganizationContextMapping[], companyId: string): Promise<boolean> {
    try {
      for (const context of contexts) {
        await createOrganizationContext(context);
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar contexto da organização:', error);
      return false;
    }
  }
}
