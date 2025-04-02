
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const getMonthName = (month: number): string => {
  return new Intl.DateTimeFormat('pt-BR', { 
    month: 'long' 
  }).format(new Date(2023, month - 1, 1));
};
