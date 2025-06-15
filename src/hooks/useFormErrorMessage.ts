
import { FieldError } from "react-hook-form";

/**
 * Retorna a mensagem de erro padrão ou null para um campo de formulário.
 */
export function useFormErrorMessage(error?: FieldError): string | null {
  if (!error) return null;
  if (typeof error.message === "string") return error.message;
  return "Campo obrigatório";
}
