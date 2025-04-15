
import { BscPerspective, BscObjective, BscMeasure } from "@/types/strategic-planning";

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
