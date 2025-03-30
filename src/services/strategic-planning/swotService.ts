
import { SwotItem } from "@/types/strategic-planning";

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
