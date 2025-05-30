
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { JobPositionTrainingRequirement } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  job_position_id: z.string().min(1, "Cargo é obrigatório"),
  training_id: z.string().optional(),
  procedure_id: z.string().optional(),
  is_mandatory: z.boolean().default(true),
  completion_deadline_days: z.number().min(1, "Prazo deve ser maior que 0").default(30),
}).refine(data => data.training_id || data.procedure_id, {
  message: "Selecione um treinamento ou procedimento",
  path: ["training_id"]
});

interface TrainingRequirementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: JobPositionTrainingRequirement | null;
  onSaved: () => void;
  companyId: string;
}

export function TrainingRequirementDialog({
  isOpen,
  onOpenChange,
  requirement,
  onSaved,
  companyId
}: TrainingRequirementDialogProps) {
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requirementType, setRequirementType] = useState<'training' | 'procedure'>('training');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_position_id: "",
      training_id: "",
      procedure_id: "",
      is_mandatory: true,
      completion_deadline_days: 30,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (requirement) {
        form.reset({
          job_position_id: requirement.job_position_id,
          training_id: requirement.training_id || "",
          procedure_id: requirement.procedure_id || "",
          is_mandatory: requirement.is_mandatory,
          completion_deadline_days: requirement.completion_deadline_days,
        });
        setRequirementType(requirement.training_id ? 'training' : 'procedure');
      } else {
        form.reset({
          job_position_id: "",
          training_id: "",
          procedure_id: "",
          is_mandatory: true,
          completion_deadline_days: 30,
        });
      }
    }
  }, [isOpen, requirement, form]);

  const loadData = async () => {
    try {
      const [jobPositionsData, trainingsData, proceduresData] = await Promise.all([
        supabase.from('job_positions').select('id, title, department:departments(name)').eq('company_id', companyId),
        supabase.from('hr_trainings').select('id, title, description').eq('company_id', companyId),
        supabase.from('iso_documents').select('id, title, document_type').eq('document_type', 'procedure')
      ]);

      setJobPositions(jobPositionsData.data || []);
      setTrainings(trainingsData.data || []);
      setProcedures(proceduresData.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const payload = {
        job_position_id: values.job_position_id,
        training_id: requirementType === 'training' ? values.training_id || null : null,
        procedure_id: requirementType === 'procedure' ? values.procedure_id || null : null,
        is_mandatory: values.is_mandatory,
        completion_deadline_days: values.completion_deadline_days,
        company_id: companyId,
      };

      if (requirement) {
        await TrainingMatrixService.updateJobPositionRequirement(requirement.id, payload);
      } else {
        await TrainingMatrixService.createJobPositionRequirement(payload);
      }

      onSaved();
    } catch (error) {
      console.error("Error saving requirement:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o requisito de treinamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {requirement ? "Editar Requisito" : "Novo Requisito de Treinamento"}
          </DialogTitle>
          <DialogDescription>
            Configure os requisitos de treinamento para um cargo específico.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="job_position_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title} - {position.department?.name || 'N/A'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs value={requirementType} onValueChange={(value) => setRequirementType(value as 'training' | 'procedure')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="training">Treinamento</TabsTrigger>
                <TabsTrigger value="procedure">Procedimento</TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="space-y-4">
                <FormField
                  control={form.control}
                  name="training_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {trainings.map((training) => (
                            <SelectItem key={training.id} value={training.id}>
                              {training.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="procedure" className="space-y-4">
                <FormField
                  control={form.control}
                  name="procedure_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedimento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o procedimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {procedures.map((procedure) => (
                            <SelectItem key={procedure.id} value={procedure.id}>
                              {procedure.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="completion_deadline_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo para Conclusão (dias)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_mandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Obrigatório</FormLabel>
                      <div className="text-[0.8rem] text-muted-foreground">
                        O treinamento é obrigatório para este cargo
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
