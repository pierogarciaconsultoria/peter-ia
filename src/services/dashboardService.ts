
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalRequirements: number;
  implementedRequirements: number;
  pendingRequirements: number;
  totalDocuments: number;
  totalAudits: number;
  nextAuditDate: string | null;
}

export interface MockDashboardData {
  upcomingAudits: Array<{
    title: string;
    date: string;
  }>;
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

export function getMockDashboardData(): MockDashboardData {
  return {
    upcomingAudits: [
      {
        title: "Auditoria Interna de Qualidade",
        date: new Date().toISOString()
      },
      {
        title: "Auditoria Externa ISO 9001",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };
}
