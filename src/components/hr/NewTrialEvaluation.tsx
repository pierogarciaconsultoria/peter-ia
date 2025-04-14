import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { createTrialEvaluation, getTrialEvaluations } from "@/services/trialEvaluationService";
import { Employee } from "@/services/employee/types";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeSelector } from "./departments/EmployeeSelector";

const formSchema = z.object({
  employee_id: z.string().min(1, {
    message: "Employee is required.",
  }),
  evaluation_date: z.string().min(1, {
    message: "Evaluation date is required.",
  }),
  evaluation_type: z.enum(['30_dias', '45_dias', '90_dias']).default('30_dias'),
});

interface NewTrialEvaluationFormValues {
  employee_id: string;
  evaluation_date: string;
  evaluation_type: '30_dias' | '45_dias' | '90_dias';
}

export default function NewTrialEvaluation() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<NewTrialEvaluationFormValues>({
    employee_id: "",
    evaluation_date: new Date().toISOString().split('T')[0],
    evaluation_type: '30_dias',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');
      
      if (error) {
        throw error;
      }

      // Cast the raw data to the Employee type
      const typedEmployees = (data || []).map(emp => ({
        ...emp,
        status: emp.status as "active" | "inactive" | "on_leave"
      }));

      setEmployees(typedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<NewTrialEvaluationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      evaluation_date: new Date().toISOString().split('T')[0],
      evaluation_type: '30_dias',
    },
  });

  async function onSubmit(data: NewTrialEvaluationFormValues) {
    try {
      const success = await createTrialEvaluation(data);
      if (success) {
        toast({
          title: "Success",
          description: "Trial evaluation created successfully.",
        });
        navigate("/human-resources", { state: { activeTab: "trial-evaluation" } });
      } else {
        toast({
          title: "Error",
          description: "Failed to create trial evaluation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleEmployeeChange = (employeeId: string) => {
    setFormData(prev => ({ ...prev, employee_id: employeeId }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Trial Evaluation</h1>
        <p className="text-muted-foreground">Create a new trial evaluation for an employee.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trial Evaluation Details</CardTitle>
          <CardDescription>Enter the details for the new trial evaluation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <FormControl>
                      <EmployeeSelector
                        employeeId={formData.employee_id} 
                        setEmployeeId={handleEmployeeChange}
                        employees={employees}
                        placeholder="Selecione um colaborador"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evaluation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evaluation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evaluation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evaluation Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select evaluation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30_dias">30 Days</SelectItem>
                        <SelectItem value="45_dias">45 Days</SelectItem>
                        <SelectItem value="90_dias">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Trial Evaluation</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
