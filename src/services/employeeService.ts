
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave' | 'pending_onboarding';
  company_id: string;
  phone?: string;
  salary?: number;
  avatar_url?: string;
  sector?: string;
  immediate_supervisor_id?: string;
  job_position_id?: string;
  department_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const employeeService = {
  async getEmployees(companyId: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      return (data || []).map(emp => ({
        ...emp,
        status: emp.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      }));
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching employee:', error);
        throw error;
      }

      return data ? {
        ...data,
        status: data.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      } : null;
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) {
        console.error('Error creating employee:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      };
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      };
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async getEmployeesByDepartment(companyId: string, department: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', companyId)
        .eq('department', department)
        .order('name');

      if (error) {
        console.error('Error fetching employees by department:', error);
        throw error;
      }

      return (data || []).map(emp => ({
        ...emp,
        status: emp.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      }));
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  },

  async getQualityInspectors(companyId: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching quality inspectors:', error);
        throw error;
      }

      return (data || []).map(emp => ({
        ...emp,
        status: emp.status as 'active' | 'inactive' | 'on_leave' | 'pending_onboarding'
      }));
    } catch (error) {
      console.error('Employee service error:', error);
      throw error;
    }
  }
};
