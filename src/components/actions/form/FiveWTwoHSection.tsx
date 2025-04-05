
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ActionFormValues } from "../schema/actionFormSchema";

interface FiveWTwoHSectionProps {
  control: Control<ActionFormValues>;
}

export function FiveWTwoHSection({ control }: FiveWTwoHSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="what"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O que? (What)</FormLabel>
              <FormControl>
                <Textarea placeholder="O que deve ser feito" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="why"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Por que? (Why)</FormLabel>
              <FormControl>
                <Textarea placeholder="Por que deve ser feito" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="where"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onde? (Where)</FormLabel>
              <FormControl>
                <Input placeholder="Onde deve ser feito" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quem? (Who)</FormLabel>
              <FormControl>
                <Input placeholder="Quem é responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="involved_people"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Envolvidos</FormLabel>
            <FormControl>
              <Textarea placeholder="Pessoas envolvidas na execução da ação" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quando começar? (When)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quando terminar? (When)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="how"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como? (How)</FormLabel>
            <FormControl>
              <Textarea placeholder="Como deve ser feito" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
