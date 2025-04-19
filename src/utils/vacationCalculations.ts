
import { differenceInYears, addYears, isBefore, addMonths, format } from 'date-fns';

export interface VacationPeriod {
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'expired' | 'scheduled' | 'completed';
  isExpiring: boolean;
  type: 'regular' | 'proportional';
  daysAvailable: number;
}

export const calculateVacationPeriods = (hireDate: Date): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  
  const yearsEmployed = differenceInYears(today, hireDate);
  
  // Calculate all vacation periods
  for (let i = 1; i <= yearsEmployed + 1; i++) {
    const periodStart = addYears(hireDate, i - 1);
    const periodEnd = addYears(hireDate, i);
    const vacationStart = addYears(hireDate, i);
    const vacationDeadline = addMonths(vacationStart, 11); // Deadline is 11 months after acquisition
    
    const isCurrentPeriod = isBefore(periodStart, today) && isBefore(today, periodEnd);
    const isPastPeriod = isBefore(periodEnd, today);
    
    let status: VacationPeriod['status'] = 'pending';
    let isExpiring = false;
    
    // Check if vacation period is about to expire
    if (isPastPeriod && isBefore(vacationDeadline, today)) {
      status = 'expired';
    } else if (isBefore(addMonths(vacationDeadline, -2), today)) {
      // Mark as expiring if within 2 months of deadline
      isExpiring = true;
    }
    
    periods.push({
      startDate: periodStart,
      endDate: periodEnd,
      status,
      isExpiring,
      type: 'regular',
      daysAvailable: 30 // Standard vacation days in Brazil
    });
  }
  
  return periods;
};

export const formatVacationDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};
