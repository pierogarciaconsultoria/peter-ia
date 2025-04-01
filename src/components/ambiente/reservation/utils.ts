
import { format, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

// Helper function to generate time options
export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 7; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

export const formatDate = (date: Date): string => {
  return format(date, "PPP", { locale: ptBR });
};

export const formatTime = (date: Date): string => {
  return format(date, "HH:mm");
};

export const getInitialEndTime = (): Date => {
  return addHours(new Date(), 1);
};
