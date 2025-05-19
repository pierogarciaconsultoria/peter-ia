
import { supabase } from "@/integrations/supabase/client";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";

// Types for dashboard data
export interface DashboardData {
  upcomingAudits: any[];
  recentDocuments: any[];
  nonConformities: any[];
  pendingActions: any[];
}

// Function to get mock data when in development mode or when database access fails
export const getMockDashboardData = (): DashboardData => {
  return {
    upcomingAudits: [
      { id: 'mock-1', title: 'Auditoria Interna - Processos', audit_date: new Date().toISOString(), status: 'planned' },
      { id: 'mock-2', title: 'Auditoria Externa ISO 9001', audit_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'scheduled' }
    ],
    recentDocuments: [
      { id: 'doc-1', title: 'Política da Qualidade', document_type: 'policy', created_at: new Date().toISOString() },
      { id: 'doc-2', title: 'Procedimento de Auditoria Interna', document_type: 'procedure', created_at: new Date().toISOString() }
    ],
    nonConformities: [
      { id: 'nc-1', title: 'Falha no processo de calibração', status: 'open', created_at: new Date().toISOString() },
      { id: 'nc-2', title: 'Documento desatualizado', status: 'in_progress', created_at: new Date().toISOString() }
    ],
    pendingActions: [
      { id: 'act-1', title: 'Revisar manual da qualidade', due_date: new Date().toISOString(), status: 'pending', responsible: 'Coordenador da Qualidade' },
      { id: 'act-2', title: 'Atualizar lista de fornecedores', due_date: new Date().toISOString(), status: 'pending', responsible: 'Setor de Compras' }
    ]
  };
};

// Function to fetch dashboard data with timeout and fallback
export const getDashboardData = async (): Promise<DashboardData> => {
  // If in Lovable editor mode or specifically want free access, return mock data
  if (isSuperAdminInLovable()) {
    console.log("Using mock data for Lovable Editor");
    return getMockDashboardData();
  }

  try {
    // Set up a timeout promise
    const timeoutPromise = new Promise<DashboardData>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout ao buscar dados do Dashboard"));
      }, 10000); // 10 seconds timeout
    });

    // Set up the actual data fetch promise
    const fetchDataPromise = fetchRealDashboardData();

    // Race between timeout and real data fetch
    const result = await Promise.race([fetchDataPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    console.log("Falling back to mock data due to error");
    // Return mock data as fallback
    return getMockDashboardData();
  }
};

// Function that actually fetches data from Supabase
async function fetchRealDashboardData(): Promise<DashboardData> {
  console.log("Fetching real dashboard data from Supabase");
  
  // Initialize the result object
  const result: DashboardData = {
    upcomingAudits: [],
    recentDocuments: [],
    nonConformities: [],
    pendingActions: []
  };

  // Fetch upcoming audits (internal)
  const { data: internalAudits, error: internalAuditsError } = await supabase
    .from('audits')
    .select('*')
    .eq('status', 'planned')
    .order('audit_date', { ascending: true })
    .limit(5);

  if (internalAuditsError) {
    console.error("Error fetching internal audits:", internalAuditsError);
  } else {
    result.upcomingAudits = [...result.upcomingAudits, ...internalAudits];
  }

  // Fetch upcoming audits (external)
  const { data: externalAudits, error: externalAuditsError } = await supabase
    .from('external_audits')
    .select('*')
    .eq('status', 'scheduled')
    .order('audit_date', { ascending: true })
    .limit(5);

  if (externalAuditsError) {
    console.error("Error fetching external audits:", externalAuditsError);
  } else {
    result.upcomingAudits = [...result.upcomingAudits, ...externalAudits];
  }

  // Fetch recent documents
  const { data: documents, error: documentsError } = await supabase
    .from('iso_documents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (documentsError) {
    console.error("Error fetching documents:", documentsError);
  } else {
    result.recentDocuments = documents;
  }

  // Fetch non-conformities
  const { data: nonConformities, error: nonConformitiesError } = await supabase
    .from('non_conformities')
    .select('*')
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(5);

  if (nonConformitiesError) {
    console.error("Error fetching non-conformities:", nonConformitiesError);
  } else {
    result.nonConformities = nonConformities;
  }

  // Fetch pending actions
  const { data: actions, error: actionsError } = await supabase
    .from('quality_actions')
    .select('*')
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(5);

  if (actionsError) {
    console.error("Error fetching actions:", actionsError);
  } else {
    result.pendingActions = actions;
  }

  // If all fetches failed, throw an error to trigger the fallback
  if (
    internalAuditsError && 
    externalAuditsError && 
    documentsError && 
    nonConformitiesError && 
    actionsError
  ) {
    throw new Error("Falha ao buscar todos os dados do dashboard");
  }

  return result;
}
