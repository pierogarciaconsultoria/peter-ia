
import { supabase } from "@/integrations/supabase/client";
import { JobPositionTrainingRequirement, EmployeeTrainingCompliance, TrainingMatrixData, ComplianceStats } from "@/types/trainingMatrix";

export class TrainingMatrixService {
  
  // Buscar requisitos de treinamento por cargo
  static async getJobPositionRequirements(companyId: string): Promise<JobPositionTrainingRequirement[]> {
    const { data, error } = await supabase
      .from('job_position_training_requirements')
      .select(`
        *,
        job_position:job_positions(
          id, title, department_id,
          department:departments(name)
        ),
        training:hr_trainings(id, title, description),
        procedure:iso_documents(id, title, document_type)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Criar requisito de treinamento para cargo
  static async createJobPositionRequirement(requirement: Omit<JobPositionTrainingRequirement, 'id' | 'created_at' | 'updated_at'>): Promise<JobPositionTrainingRequirement> {
    const { data, error } = await supabase
      .from('job_position_training_requirements')
      .insert(requirement)
      .select(`
        *,
        job_position:job_positions(
          id, title, department_id,
          department:departments(name)
        ),
        training:hr_trainings(id, title, description),
        procedure:iso_documents(id, title, document_type)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Atualizar requisito de treinamento
  static async updateJobPositionRequirement(id: string, updates: Partial<JobPositionTrainingRequirement>): Promise<JobPositionTrainingRequirement> {
    const { data, error } = await supabase
      .from('job_position_training_requirements')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        job_position:job_positions(
          id, title, department_id,
          department:departments(name)
        ),
        training:hr_trainings(id, title, description),
        procedure:iso_documents(id, title, document_type)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Deletar requisito de treinamento
  static async deleteJobPositionRequirement(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_position_training_requirements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Buscar compliance de funcionários
  static async getEmployeeCompliance(companyId: string, filters?: { employeeId?: string; status?: string }): Promise<EmployeeTrainingCompliance[]> {
    let query = supabase
      .from('employee_training_compliance')
      .select(`
        *,
        employee:employees(id, name, position, department),
        requirement:job_position_training_requirements(
          *,
          job_position:job_positions(id, title),
          training:hr_trainings(id, title),
          procedure:iso_documents(id, title)
        )
      `)
      .eq('company_id', companyId);

    if (filters?.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    
    // Type the data properly to ensure status field conforms to our union type
    return (data || []).map(item => ({
      ...item,
      status: item.status as EmployeeTrainingCompliance['status']
    }));
  }

  // Atualizar status de compliance
  static async updateEmployeeCompliance(id: string, updates: Partial<EmployeeTrainingCompliance>): Promise<EmployeeTrainingCompliance> {
    const { data, error } = await supabase
      .from('employee_training_compliance')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        employee:employees(id, name, position, department),
        requirement:job_position_training_requirements(
          *,
          job_position:job_positions(id, title),
          training:hr_trainings(id, title),
          procedure:iso_documents(id, title)
        )
      `)
      .single();

    if (error) throw error;
    
    // Type the data properly to ensure status field conforms to our union type
    return {
      ...data,
      status: data.status as EmployeeTrainingCompliance['status']
    };
  }

  // Gerar compliance automático para funcionário baseado no cargo
  static async generateEmployeeCompliance(employeeId: string, companyId: string): Promise<void> {
    // Buscar cargo do funcionário
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('position')
      .eq('id', employeeId)
      .single();

    if (employeeError) throw employeeError;

    // Buscar job position baseado no título do cargo
    const { data: jobPosition, error: jobPositionError } = await supabase
      .from('job_positions')
      .select('id')
      .eq('title', employee.position)
      .eq('company_id', companyId)
      .single();

    if (jobPositionError || !jobPosition) {
      console.warn('Job position not found for employee position:', employee.position);
      return;
    }

    // Buscar requisitos de treinamento para o cargo
    const { data: requirements, error: requirementsError } = await supabase
      .from('job_position_training_requirements')
      .select('*')
      .eq('job_position_id', jobPosition.id)
      .eq('company_id', companyId);

    if (requirementsError) throw requirementsError;

    // Criar registros de compliance para cada requisito
    const complianceRecords = requirements.map(req => ({
      employee_id: employeeId,
      requirement_id: req.id,
      status: 'pending' as const,
      assigned_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + req.completion_deadline_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      company_id: companyId
    }));

    if (complianceRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('employee_training_compliance')
        .insert(complianceRecords);

      if (insertError) throw insertError;
    }
  }

  // Calcular estatísticas de compliance
  static async getComplianceStats(companyId: string, filters?: { departmentId?: string; jobPositionId?: string }): Promise<ComplianceStats> {
    let query = supabase
      .from('employee_training_compliance')
      .select('status, requirement:job_position_training_requirements(job_position:job_positions(department_id))')
      .eq('company_id', companyId);

    if (filters?.departmentId) {
      query = query.eq('requirement.job_position.department_id', filters.departmentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data.length,
      completed: data.filter(item => item.status === 'completed').length,
      pending: data.filter(item => item.status === 'pending').length,
      inProgress: data.filter(item => item.status === 'in_progress').length,
      overdue: data.filter(item => item.status === 'overdue').length,
      completionRate: 0
    };

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return stats;
  }

  // Buscar dados da matriz consolidada
  static async getTrainingMatrix(companyId: string): Promise<TrainingMatrixData[]> {
    const requirements = await this.getJobPositionRequirements(companyId);
    const compliance = await this.getEmployeeCompliance(companyId);

    // Agrupar por job position
    const matrixMap = new Map<string, TrainingMatrixData>();

    requirements.forEach(req => {
      if (!req.job_position) return;

      const key = req.job_position.id;
      if (!matrixMap.has(key)) {
        matrixMap.set(key, {
          jobPosition: {
            id: req.job_position.id,
            title: req.job_position.title,
            department: req.job_position.department?.name || 'N/A'
          },
          requirements: [],
          compliance: []
        });
      }

      const matrixData = matrixMap.get(key)!;
      matrixData.requirements.push(req);
    });

    // Adicionar compliance data
    compliance.forEach(comp => {
      if (!comp.requirement?.job_position) return;

      const key = comp.requirement.job_position.id;
      const matrixData = matrixMap.get(key);
      if (matrixData) {
        matrixData.compliance.push(comp);
      }
    });

    return Array.from(matrixMap.values());
  }
}
