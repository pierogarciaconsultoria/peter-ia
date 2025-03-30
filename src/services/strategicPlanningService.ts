
import { 
  StrategicIdentity, 
  SwotItem, 
  BscPerspective, 
  BscObjective, 
  BscMeasure, 
  BusinessModelCanvas 
} from "@/types/strategic-planning";

// Mock data for strategic identity
const mockIdentity: StrategicIdentity = {
  id: "1",
  mission: "Fornecer soluções inovadoras e sustentáveis que melhorem a qualidade de vida das pessoas",
  vision: "Ser referência em inovação e sustentabilidade no mercado global até 2030",
  values: ["Inovação", "Sustentabilidade", "Integridade", "Excelência", "Colaboração"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

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

// Mock data for Business Model Canvas
const mockBusinessModelCanvas: BusinessModelCanvas = {
  id: "1",
  key_partners: "Fornecedores de matéria-prima sustentável, distribuidores locais",
  key_activities: "Produção, P&D, Marketing",
  key_resources: "Patentes, equipe qualificada, infraestrutura",
  value_propositions: "Produtos inovadores com menor impacto ambiental",
  customer_relationships: "Suporte contínuo, programas de fidelidade",
  channels: "E-commerce, revendedores, venda direta",
  customer_segments: "Consumidores conscientes, empresas com compromissos ESG",
  cost_structure: "P&D, produção, marketing, distribuição",
  revenue_streams: "Vendas de produtos, serviços de consultoria",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Strategic Identity Services
export async function getStrategicIdentity(): Promise<StrategicIdentity | null> {
  // Return mock data
  return Promise.resolve(mockIdentity);
}

export async function updateStrategicIdentity(identity: Partial<StrategicIdentity>): Promise<StrategicIdentity | null> {
  // Mock update - in a real app this would update the database
  const updatedIdentity = { ...mockIdentity, ...identity, updated_at: new Date().toISOString() };
  
  return Promise.resolve(updatedIdentity);
}

// SWOT Analysis Services
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

// BSC Services
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

// Business Model Canvas Services
export async function getBusinessModelCanvas(): Promise<BusinessModelCanvas | null> {
  // Return mock data
  return Promise.resolve(mockBusinessModelCanvas);
}

export async function updateBusinessModelCanvas(canvas: Partial<BusinessModelCanvas>): Promise<BusinessModelCanvas | null> {
  // Mock update - in a real app this would update the database
  const updatedCanvas = { ...mockBusinessModelCanvas, ...canvas, updated_at: new Date().toISOString() };
  
  return Promise.resolve(updatedCanvas);
}
