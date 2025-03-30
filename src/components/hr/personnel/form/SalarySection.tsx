
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { FormSectionProps } from "./types";

export function SalarySection({ form }: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="currentSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salário atual</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                <Input placeholder="R$" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proposedSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salário proposto</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                <Input placeholder="R$" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
