
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ActionFormValues } from "../schema/actionFormSchema";

interface StatusSectionProps {
  control: Control<ActionFormValues>;
}

export function StatusSection({ control }: StatusSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="delayed">Atrasada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="process_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de Processo</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                >
                  <option value="manufacturing">Produção</option>
                  <option value="Produção">Produção</option>
                  <option value="quality">Qualidade</option>
                  <option value="Qualidade">Qualidade</option>
                  <option value="management">Gestão</option>
                  <option value="hr">Recursos Humanos</option>
                  <option value="RH">RH</option>
                  <option value="sales">Vendas</option>
                  <option value="Comercial">Comercial</option>
                  <option value="supply_chain">Cadeia de Suprimentos</option>
                  <option value="Logística">Logística</option>
                  <option value="Compras">Compras</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="TI">TI</option>
                  <option value="Treinamento">Treinamento</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="other">Outro</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comentários Adicionais</FormLabel>
            <FormControl>
              <Textarea placeholder="Observações ou comentários adicionais" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
