
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Mapeamento de rotas para requisitos ISO
const routeToRequirementsMap: Record<string, string[]> = {
  '/organization-context': ['4.1', '4.2'],
  '/strategic-planning': ['4.3', '5.2', '6.2'],
  '/processo': ['4.4'],
  '/human-resources': ['5.3', '7.1', '7.2'],
  '/risk-management': ['6.1'],
  '/performance-indicators': ['6.2', '9.1'],
  '/action-schedule': ['6.3', '10.3'],
  '/documents': ['7.5'],
  '/customer-complaints': ['8.2'],
  '/supplier-evaluation': ['8.4'],
  '/quality-control': ['8.5'],
  '/non-conforming-products': ['8.7'],
  '/audit-schedule': ['9.2'],
  '/critical-analysis': ['5.1', '9.3'],
  '/non-compliance': ['10.2']
};

export const useISOIntegration = () => {
  const location = useLocation();
  
  const relatedRequirements = useMemo(() => {
    const currentPath = location.pathname;
    
    // Busca requisitos para a rota exata
    let requirements = routeToRequirementsMap[currentPath] || [];
    
    // Se não encontrar para a rota exata, busca por rotas que começam com o path atual
    if (requirements.length === 0) {
      for (const [route, reqs] of Object.entries(routeToRequirementsMap)) {
        if (currentPath.startsWith(route) || route.startsWith(currentPath)) {
          requirements = reqs;
          break;
        }
      }
    }
    
    return requirements;
  }, [location.pathname]);

  const hasISORequirements = relatedRequirements.length > 0;

  return {
    relatedRequirements,
    hasISORequirements,
    currentRoute: location.pathname
  };
};
