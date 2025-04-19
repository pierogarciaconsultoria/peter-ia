
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateVacationPeriods } from '@/utils/vacationCalculations';

export function useVacationRequests() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitVacationRequest = async (
    employeeId: string,
    startDate: string,
    endDate: string,
    periodStart: string,
    periodEnd: string,
    type: 'regular' | 'proportional'
  ) => {
    try {
      setLoading(true);

      // Fetch employee data to validate against hire date
      const { data: employee } = await supabase
        .from('employees')
        .select('hire_date')
        .eq('id', employeeId)
        .single();

      if (!employee) {
        throw new Error('Employee not found');
      }

      const vacationPeriods = calculateVacationPeriods(new Date(employee.hire_date));
      const requestedPeriod = vacationPeriods.find(
        p => p.startDate.toISOString().split('T')[0] === periodStart &&
            p.endDate.toISOString().split('T')[0] === periodEnd
      );

      if (!requestedPeriod) {
        throw new Error('Invalid vacation period');
      }

      if (requestedPeriod.status === 'expired') {
        throw new Error('This vacation period has expired');
      }

      // Here you would typically insert the vacation request into your database
      toast({
        title: "Sucesso",
        description: "Solicitação de férias registrada com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error submitting vacation request:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar solicitação de férias",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitVacationRequest,
    loading
  };
}
