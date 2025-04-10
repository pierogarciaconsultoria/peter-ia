
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(dataString: string) {
  try {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    return dataString;
  }
}

export function formatarDataSimples(dataString: string) {
  if (!dataString) return "";
  
  try {
    const data = new Date(dataString);
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    return dataString;
  }
}
