
import { StrategicIdentity } from "@/types/strategic-planning";

// Mock data for strategic identity
let strategicIdentityData: StrategicIdentity = {
  id: "1",
  mission: "Fornecer soluções inovadoras e sustentáveis que melhorem a qualidade de vida das pessoas",
  vision: "Ser referência em inovação e sustentabilidade no mercado global até 2030",
  values: ["Inovação", "Sustentabilidade", "Integridade", "Excelência", "Colaboração"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Strategic Identity Services
export async function getStrategicIdentity(): Promise<StrategicIdentity | null> {
  return Promise.resolve(strategicIdentityData);
}

export async function updateStrategicIdentity(identity: Partial<StrategicIdentity>): Promise<StrategicIdentity | null> {
  strategicIdentityData = {
    ...strategicIdentityData,
    ...identity,
    updated_at: new Date().toISOString()
  };

  return Promise.resolve(strategicIdentityData);
}
