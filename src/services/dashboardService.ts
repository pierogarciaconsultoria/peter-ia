
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalRequirements: number;
  implementedRequirements: number;
  pendingRequirements: number;
  totalDocuments: number;
  totalAudits: number;
  nextAuditDate: string | null;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    console.log('Dashboard service - using mock data until database setup');
    
    // Mock data since some tables don't exist yet
    const mockMetrics: DashboardMetrics = {
      totalRequirements: 0,
      implementedRequirements: 0,
      pendingRequirements: 0,
      totalDocuments: 0,
      totalAudits: 0,
      nextAuditDate: null
    };

    return mockMetrics;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
}
