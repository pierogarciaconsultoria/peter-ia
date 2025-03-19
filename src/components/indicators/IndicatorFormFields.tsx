
import { Control } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndicatorFormValues } from "./IndicatorFormSchema";

interface IndicatorFormFieldsProps {
  control: Control<IndicatorFormValues>;
}

export function IndicatorFormFields({ control }: IndicatorFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Indicador</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descrição detalhada do indicador" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="process"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Processo</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Ex: Produção, Qualidade, RH" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="goal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Meta</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="higher_better">Quanto maior, melhor</SelectItem>
                  <SelectItem value="lower_better">Quanto menor, melhor</SelectItem>
                  <SelectItem value="target">Valor exato</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="goal_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Meta</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="calculation_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cálculo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cálculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sum">Somatório</SelectItem>
                  <SelectItem value="average">Média</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ex: %, un, horas" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
