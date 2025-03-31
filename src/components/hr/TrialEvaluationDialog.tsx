
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EmployeeSelector } from "./departments/EmployeeSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createNotification } from "@/services/notificationService";

interface TrialEvaluationFormValues {
  employee_id: string;
  evaluation_date: string;
  evaluation_type: '30_dias' | '45_dias' | '90_dias';
  performance_score: number;
  adaptation_score: number;
  behavior_score: number;
  approved: boolean;
  comments: string;
}

interface TrialEvaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  initialData?: any;
  mode: 'create' | 'edit' | 'evaluate' | 'hr-approve';
}

export function TrialEvaluationDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: TrialEvaluationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TrialEvaluationFormValues>({
    defaultValues: {
      employee_id: "",
      evaluation_date: new Date().toISOString().split('T')[0],
      evaluation_type: '30_dias',
      performance_score: 0,
      adaptation_score: 0,
      behavior_score: 0,
      approved: false,
      comments: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        employee_id: initialData.employee_id || "",
        evaluation_date: initialData.evaluation_date || new Date().toISOString().split('T')[0],
        evaluation_type: initialData.evaluation_type || '30_dias',
        performance_score: initialData.performance_score || 0,
        adaptation_score: initialData.adaptation_score || 0,
        behavior_score: initialData.behavior_score || 0,
        approved: initialData.approved || false,
        comments: initialData.comments || ""
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = async (data: TrialEvaluationFormValues) => {
    setIsSubmitting(true);
    try {
      let formData;

      if (mode === 'create') {
        formData = data;
      } else if (mode === 'evaluate') {
        formData = {
          performance_score: data.performance_score,
          adaptation_score: data.adaptation_score,
          behavior_score: data.behavior_score,
          approved: data.approved,
          comments: data.comments,
          notification_sent: false
        };
      } else if (mode === 'hr-approve') {
        formData = {
          hr_approved: true,
          hr_approved_at: new Date().toISOString(),
          hr_approver_id: "current-user-id" // This should be dynamically set from authentication
        };
      }

      const result = await onSubmit(formData);
      
      if (result && mode === 'evaluate' && initialData?.evaluator_id) {
        // Send notification to HR about pending approval
        try {
          // In a real app, you would get the HR user ID from your configuration or HR department
          const hrUserId = "hr-user-id"; // This is a placeholder
          await createNotification(
            hrUserId,
            "Trial Evaluation Needs Approval",
            `A trial evaluation for ${initialData.employee?.name || 'an employee'} has been completed and needs HR approval.`,
            "trial_evaluation",
            `/human-resources/trial-evaluation/${initialData.id}`,
            initialData.id
          );
        } catch (err) {
          console.error("Failed to send notification:", err);
        }
      }

      if (result) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitleByMode = () => {
    switch (mode) {
      case 'create': return "Create Trial Evaluation";
      case 'edit': return "Edit Trial Evaluation";
      case 'evaluate': return "Evaluate Employee Trial Period";
      case 'hr-approve': return "HR Approval for Trial Evaluation";
      default: return "Trial Evaluation";
    }
  };

  const getDescriptionByMode = () => {
    switch (mode) {
      case 'evaluate': return "Complete the evaluation for this employee's trial period.";
      case 'hr-approve': return "Review and approve the completed evaluation.";
      default: return "Enter the trial evaluation details.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{getTitleByMode()}</DialogTitle>
          <DialogDescription>{getDescriptionByMode()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Employee Selection - Only in Create mode */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <FormControl>
                      <EmployeeSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Read-only Employee Name - In other modes */}
            {mode !== 'create' && initialData?.employee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Employee</h4>
                  <p>{initialData.employee.name}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Department</h4>
                  <p>{initialData.employee.department}</p>
                </div>
              </div>
            )}

            {/* Evaluation Date - Only in Create/Edit mode */}
            {(mode === 'create' || mode === 'edit') && (
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
            )}

            {/* Read-only Evaluation Date - In other modes */}
            {mode !== 'create' && mode !== 'edit' && initialData?.evaluation_date && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Evaluation Date</h4>
                  <p>{new Date(initialData.evaluation_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Evaluation Type</h4>
                  <p>{initialData.evaluation_type === '30_dias' ? '30 Days' : 
                     initialData.evaluation_type === '45_dias' ? '45 Days' : '90 Days'}</p>
                </div>
              </div>
            )}

            {/* Evaluation Type Selection - Only in Create/Edit mode */}
            {(mode === 'create' || mode === 'edit') && (
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
            )}

            {/* Performance Score - In Evaluate mode */}
            {(mode === 'evaluate' || (mode === 'hr-approve' && initialData?.performance_score)) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="performance_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Performance</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            readOnly={mode === 'hr-approve'}
                          />
                        </FormControl>
                        <FormDescription>Score from 0-100</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adaptation_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adaptation</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            readOnly={mode === 'hr-approve'}
                          />
                        </FormControl>
                        <FormDescription>Score from 0-100</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="behavior_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Behavior</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            readOnly={mode === 'hr-approve'}
                          />
                        </FormControl>
                        <FormDescription>Score from 0-100</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2">
                  <FormField
                    control={form.control}
                    name="approved"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={mode === 'hr-approve'}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Approve this employee's trial period
                          </FormLabel>
                          <FormDescription>
                            This will confirm that the employee has successfully passed this evaluation
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Comments Field - In Evaluate mode */}
            {(mode === 'evaluate' || (mode === 'hr-approve' && initialData?.comments)) && (
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your evaluation comments here..." 
                        className="min-h-[100px]" 
                        {...field}
                        readOnly={mode === 'hr-approve'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* HR Approval - In HR-Approve mode only */}
            {mode === 'hr-approve' && (
              <div className="pt-2">
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox id="hr-approve-checkbox" defaultChecked={true} disabled={true} />
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor="hr-approve-checkbox"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      HR Approval
                    </label>
                    <p className="text-sm text-muted-foreground">
                      By submitting, you are approving this evaluation on behalf of HR
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  mode === 'hr-approve' ? "Approve" : "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
