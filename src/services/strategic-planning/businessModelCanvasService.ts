
import { BusinessModelCanvas } from "@/types/strategic-planning";

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

export async function getBusinessModelCanvas(): Promise<BusinessModelCanvas | null> {
  // Return mock data
  return Promise.resolve(mockBusinessModelCanvas);
}

export async function updateBusinessModelCanvas(canvas: Partial<BusinessModelCanvas>): Promise<BusinessModelCanvas | null> {
  // Mock update - in a real app this would update the database
  const updatedCanvas = { ...mockBusinessModelCanvas, ...canvas, updated_at: new Date().toISOString() };
  
  return Promise.resolve(updatedCanvas);
}
