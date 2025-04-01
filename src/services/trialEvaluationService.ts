
import { supabase } from "@/integrations/supabase/client";

export interface TrialEvaluation {
  id: string;
  employee_id: string;
  evaluation_date: string;
  evaluator_id: string | null;
  performance_score: number | null;
  adaptation_score: number | null;
  behavior_score: number | null;
  approved: boolean | null;
  company_id: string;
  created_at: string;
  updated_at: string;
  evaluation_type: '30_dias' | '45_dias' | '90_dias';
  comments: string | null;
  hr_approved: boolean | null;
  hr_approved_at: string | null;
  hr_approver_id: string | null;
  notification_sent: boolean;
}

export interface EmployeeDetails {
  name: string;
  position: string;
  department: string;
  avatar_url: string | null;
  hire_date: string;
  immediate_superior: string | null;
  job_position_id: string | null;
}

export interface EvaluatorDetails {
  name: string | null;
}

export interface TrialEvaluationWithEmployee extends TrialEvaluation {
  employee: EmployeeDetails;
  evaluator?: EvaluatorDetails;
}

// Get all trial evaluations with employee details
export async function getTrialEvaluations(): Promise<TrialEvaluationWithEmployee[]> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(name, position, department, avatar_url, hire_date, job_position_id),
      evaluator:evaluator_id(name)
    `)
    .order('evaluation_date', { ascending: false });

  if (error) {
    console.error("Error fetching trial evaluations:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const enhancedData = (data || []).map(item => {
    const typedItem = item as any;
    return {
      ...item,
      // Ensure HR approval fields exist
      hr_approved: typedItem.hr_approved ?? null,
      hr_approved_at: typedItem.hr_approved_at ?? null,
      hr_approver_id: typedItem.hr_approver_id ?? null,
      notification_sent: typedItem.notification_sent ?? false,
      // Ensure employee object exists with required fields
      employee: typedItem.employee || {
        name: 'Unknown',
        position: 'Unknown',
        department: 'Unknown',
        avatar_url: null,
        hire_date: 'Unknown',
        immediate_superior: null,
        job_position_id: null
      },
      // Ensure evaluator object exists
      evaluator: typedItem.evaluator || { name: null }
    } as TrialEvaluationWithEmployee;
  });

  return enhancedData;
}

// Get a specific trial evaluation
export async function getTrialEvaluationById(id: string): Promise<TrialEvaluationWithEmployee> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(name, position, department, avatar_url, hire_date, job_position_id),
      evaluator:evaluator_id(name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching trial evaluation:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const typedData = data as any;
  const enhancedData = {
    ...data,
    // Ensure HR approval fields exist
    hr_approved: typedData.hr_approved ?? null,
    hr_approved_at: typedData.hr_approved_at ?? null,
    hr_approver_id: typedData.hr_approver_id ?? null,
    notification_sent: typedData.notification_sent ?? false,
    // Ensure employee object exists with required fields
    employee: typedData.employee || {
      name: 'Unknown',
      position: 'Unknown',
      department: 'Unknown',
      avatar_url: null,
      hire_date: 'Unknown',
      immediate_superior: null,
      job_position_id: null
    },
    // Ensure evaluator object exists
    evaluator: typedData.evaluator || { name: null }
  } as TrialEvaluationWithEmployee;

  return enhancedData;
}

// Create a new trial evaluation
export async function createTrialEvaluation(evaluation: Omit<TrialEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<TrialEvaluation> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .insert([evaluation])
    .select()
    .single();

  if (error) {
    console.error("Error creating trial evaluation:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const typedData = data as any;
  const enhancedData = {
    ...data,
    // Ensure HR approval fields exist
    hr_approved: typedData.hr_approved ?? null,
    hr_approved_at: typedData.hr_approved_at ?? null,
    hr_approver_id: typedData.hr_approver_id ?? null,
    notification_sent: typedData.notification_sent ?? false,
  } as TrialEvaluation;

  return enhancedData;
}

// Update an existing trial evaluation
export async function updateTrialEvaluation(
  id: string, 
  evaluation: Partial<Omit<TrialEvaluation, 'id' | 'created_at' | 'updated_at'>>
): Promise<TrialEvaluation> {
  const updates = {
    ...evaluation,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating trial evaluation:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const typedData = data as any;
  const enhancedData = {
    ...data,
    // Ensure HR approval fields exist
    hr_approved: typedData.hr_approved ?? null,
    hr_approved_at: typedData.hr_approved_at ?? null,
    hr_approver_id: typedData.hr_approver_id ?? null,
    notification_sent: typedData.notification_sent ?? false,
  } as TrialEvaluation;

  return enhancedData;
}

// Delete a trial evaluation
export async function deleteTrialEvaluation(id: string): Promise<void> {
  const { error } = await supabase
    .from('trial_period_evaluations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting trial evaluation:", error);
    throw new Error(error.message);
  }
}

// Generate evaluations for newly hired employees
export async function generateTrialEvaluations(employee_id: string, hire_date: string): Promise<void> {
  try {
    // Get the company_id for this employee
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('company_id')
      .eq('id', employee_id)
      .single();

    if (employeeError) {
      console.error("Error fetching employee details:", employeeError);
      throw new Error(employeeError.message);
    }

    // Safely extract company_id from employee data with proper type checking
    const employee = employeeData as { company_id?: string | null } | null;
    
    // Default company_id if not found
    const company_id = (employee && 'company_id' in employee && employee.company_id) 
      ? String(employee.company_id) 
      : 'default-company-id';
    
    // Calculate evaluation dates
    const hireDate = new Date(hire_date);
    
    const thirtyDayEval = new Date(hireDate);
    thirtyDayEval.setDate(hireDate.getDate() + 30);
    
    const ninetyDayEval = new Date(hireDate);
    ninetyDayEval.setDate(hireDate.getDate() + 90);
    
    // Create 30-day evaluation without evaluator_id (will be assigned later)
    await createTrialEvaluation({
      employee_id,
      evaluator_id: null,
      evaluation_date: thirtyDayEval.toISOString().split('T')[0],
      evaluation_type: '30_dias',
      company_id,
      performance_score: null,
      adaptation_score: null,
      behavior_score: null,
      approved: null,
      comments: null,
      hr_approved: null,
      hr_approved_at: null,
      hr_approver_id: null,
      notification_sent: false
    });
    
    // Create 90-day evaluation without evaluator_id (will be assigned later)
    await createTrialEvaluation({
      employee_id,
      evaluator_id: null,
      evaluation_date: ninetyDayEval.toISOString().split('T')[0],
      evaluation_type: '90_dias',
      company_id,
      performance_score: null,
      adaptation_score: null,
      behavior_score: null,
      approved: null,
      comments: null,
      hr_approved: null,
      hr_approved_at: null,
      hr_approver_id: null,
      notification_sent: false
    });
  } catch (error) {
    console.error("Error generating trial evaluations:", error);
    throw error;
  }
}

// Get pending evaluations for a specific evaluator
export async function getPendingEvaluationsByEvaluator(evaluator_id: string): Promise<TrialEvaluationWithEmployee[]> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(name, position, department, avatar_url, hire_date, job_position_id),
      evaluator:evaluator_id(name)
    `)
    .eq('evaluator_id', evaluator_id)
    .is('approved', null)
    .order('evaluation_date', { ascending: true });

  if (error) {
    console.error("Error fetching pending evaluations:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const enhancedData = (data || []).map(item => {
    const typedItem = item as any;
    return {
      ...item,
      // Ensure HR approval fields exist
      hr_approved: typedItem.hr_approved ?? null,
      hr_approved_at: typedItem.hr_approved_at ?? null,
      hr_approver_id: typedItem.hr_approver_id ?? null,
      notification_sent: typedItem.notification_sent ?? false,
      // Ensure employee object exists with required fields
      employee: typedItem.employee || {
        name: 'Unknown',
        position: 'Unknown',
        department: 'Unknown',
        avatar_url: null,
        hire_date: 'Unknown',
        immediate_superior: null,
        job_position_id: null
      },
      // Ensure evaluator object exists
      evaluator: typedItem.evaluator || { name: null }
    } as TrialEvaluationWithEmployee;
  });

  return enhancedData;
}

// Get evaluations pending HR approval
export async function getEvaluationsPendingHRApproval(): Promise<TrialEvaluationWithEmployee[]> {
  const { data, error } = await supabase
    .from('trial_period_evaluations')
    .select(`
      *,
      employee:employee_id(name, position, department, avatar_url, hire_date, job_position_id),
      evaluator:evaluator_id(name)
    `)
    .not('approved', 'is', null)
    .is('hr_approved', null)
    .order('evaluation_date', { ascending: true });

  if (error) {
    console.error("Error fetching evaluations pending HR approval:", error);
    throw new Error(error.message);
  }

  // Add missing properties if they don't exist in the returned data
  const enhancedData = (data || []).map(item => {
    const typedItem = item as any;
    return {
      ...item,
      // Ensure HR approval fields exist
      hr_approved: typedItem.hr_approved ?? null,
      hr_approved_at: typedItem.hr_approved_at ?? null,
      hr_approver_id: typedItem.hr_approver_id ?? null,
      notification_sent: typedItem.notification_sent ?? false,
      // Ensure employee object exists with required fields  
      employee: typedItem.employee || {
        name: 'Unknown',
        position: 'Unknown',
        department: 'Unknown',
        avatar_url: null,
        hire_date: 'Unknown',
        immediate_superior: null,
        job_position_id: null
      },
      // Ensure evaluator object exists
      evaluator: typedItem.evaluator || { name: null }
    } as TrialEvaluationWithEmployee;
  });

  return enhancedData;
}
