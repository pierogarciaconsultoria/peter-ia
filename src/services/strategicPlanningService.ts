
import { BscPerspective, BscObjective, BscMeasure, SwotItem, BusinessModelCanvas } from "@/types/strategic-planning";

// Mock data for BSC
const mockBscPerspectives: BscPerspective[] = [
  {
    id: "1",
    perspective: "financial",
    objectives: [
      {
        id: "1",
        perspective_id: "1",
        title: "Aumentar o faturamento em 15%",
        description: "Expandir operações para novas regiões e segmentos de mercado",
        measures: [
          {
            id: "1",
            objective_id: "1",
            name: "Receita total",
            target: 1000000,
            unit: "R$",
            current_value: 850000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    perspective: "customer",
    objectives: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    perspective: "internal_process",
    objectives: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    perspective: "learning_growth",
    objectives: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock data for SWOT analysis
const mockSwotItems: SwotItem[] = [
  {
    id: "1",
    category: "strength",
    description: "Equipe altamente qualificada",
    impact_level: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    category: "weakness",
    description: "Processos internos ainda não otimizados",
    impact_level: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    category: "opportunity",
    description: "Crescimento do mercado de produtos sustentáveis",
    impact_level: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    category: "threat",
    description: "Novos concorrentes entrando no mercado",
    impact_level: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock data for Business Model Canvas
const mockBusinessModelCanvas: BusinessModelCanvas = {
  id: "1",
  key_partners: "Fornecedores estratégicos, distribuidores",
  key_activities: "Desenvolvimento de produto, marketing digital",
  key_resources: "Equipe de P&D, plataforma tecnológica",
  value_propositions: "Soluções inovadoras e sustentáveis",
  customer_relationships: "Suporte personalizado, programa de fidelidade",
  channels: "E-commerce, parceiros de distribuição",
  customer_segments: "Empresas de médio porte, consumidores finais",
  cost_structure: "Desenvolvimento, marketing, infraestrutura",
  revenue_streams: "Vendas diretas, assinaturas, serviços",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// BSC functions
export async function getBscPerspectives(): Promise<BscPerspective[]> {
  // Return mock data
  return Promise.resolve(mockBscPerspectives);
}

export async function createBscObjective(objective: Omit<BscObjective, 'id' | 'created_at' | 'updated_at' | 'measures'>): Promise<BscObjective | null> {
  // Mock create - in a real app this would insert into the database
  const perspective = mockBscPerspectives.find(p => p.perspective === objective.perspective_id);
  
  if (perspective) {
    const newObjective: BscObjective = {
      id: (Date.now()).toString(),
      ...objective,
      measures: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    perspective.objectives.push(newObjective);
    return Promise.resolve(newObjective);
  }
  
  return Promise.resolve(null);
}

export async function createBscMeasure(measure: Omit<BscMeasure, 'id' | 'created_at' | 'updated_at'>): Promise<BscMeasure | null> {
  // Mock create - in a real app this would insert into the database
  for (const perspective of mockBscPerspectives) {
    const objective = perspective.objectives.find(o => o.id === measure.objective_id);
    
    if (objective) {
      const newMeasure: BscMeasure = {
        id: (Date.now()).toString(),
        ...measure,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      objective.measures.push(newMeasure);
      return Promise.resolve(newMeasure);
    }
  }
  
  return Promise.resolve(null);
}

// SWOT functions
export async function getSwotItems(): Promise<SwotItem[]> {
  // Return mock data
  return Promise.resolve(mockSwotItems);
}

export async function createSwotItem(item: Omit<SwotItem, 'id' | 'created_at' | 'updated_at'>): Promise<SwotItem | null> {
  // Mock create - in a real app this would insert into the database
  const newItem: SwotItem = {
    id: (mockSwotItems.length + 1).toString(),
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockSwotItems.push(newItem);
  return Promise.resolve(newItem);
}

export async function updateSwotItem(id: string, item: Partial<Omit<SwotItem, 'id' | 'created_at' | 'updated_at'>>): Promise<SwotItem | null> {
  // Mock update - in a real app this would update the database
  const index = mockSwotItems.findIndex(i => i.id === id);
  
  if (index >= 0) {
    mockSwotItems[index] = { 
      ...mockSwotItems[index], 
      ...item, 
      updated_at: new Date().toISOString() 
    };
    
    return Promise.resolve(mockSwotItems[index]);
  }
  
  return Promise.resolve(null);
}

export async function deleteSwotItem(id: string): Promise<boolean> {
  // Mock delete - in a real app this would delete from the database
  const index = mockSwotItems.findIndex(i => i.id === id);
  
  if (index >= 0) {
    mockSwotItems.splice(index, 1);
    return Promise.resolve(true);
  }
  
  return Promise.resolve(false);
}

// Business Model Canvas functions
export async function getBusinessModelCanvas(): Promise<BusinessModelCanvas> {
  // Return mock data
  return Promise.resolve(mockBusinessModelCanvas);
}

export async function updateBusinessModelCanvas(updates: Partial<Omit<BusinessModelCanvas, 'id' | 'created_at' | 'updated_at'>>): Promise<BusinessModelCanvas> {
  // Mock update - in a real app this would update the database
  const updatedCanvas = {
    ...mockBusinessModelCanvas,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Update our mock data
  Object.assign(mockBusinessModelCanvas, updatedCanvas);
  
  return Promise.resolve(updatedCanvas);
}

// Re-export from other strategic planning service files
export * from './strategic-planning/strategicIdentityService';
