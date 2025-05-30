
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionBuilder } from "./QuestionBuilder";
import { CompanyValuesSelector } from "./CompanyValuesSelector";
import { DiscAssessmentSettings } from "./DiscAssessmentSettings";
import { AssessmentQuestion } from "@/types/recruitment";
import { createAssessment } from "@/services/candidateAssessmentService";

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentCreated: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  active: z.boolean().default(true),
  include_company_values: z.boolean().default(true),
  include_disc: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function NewAssessmentDialog({ 
  open, 
  onOpenChange,
  onAssessmentCreated
}: NewAssessmentDialogProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();
  const { userCompany } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      active: true,
      include_company_values: true,
      include_disc: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (questions.length === 0 && !values.include_company_values && !values.include_disc) {
      toast({
        title: "Avaliação vazia",
        description: "Adicione pelo menos uma pergunta ou habilite avaliação de valores/DISC",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAssessment = {
        title: values.title,
        description: values.description || "",
        active: values.active,
        company_id: userCompany?.id || "",
        questions: [
          ...questions,
          ...(values.include_company_values ? [
            {
              id: "company_values",
              text: "Quais valores da empresa você mais se identifica?",
              type: "multiple_choice" as const,
              options: selectedValues,
              required: true
            }
          ] : []),
          ...(values.include_disc ? [
            {
              id: "disc_assessment",
              text: "Avaliação de perfil comportamental DISC",
              type: "boolean" as const,
              required: true
            }
          ] : [])
        ]
      };

      await createAssessment(newAssessment);
      
      toast({
        title: "Avaliação criada",
        description: "A avaliação foi criada com sucesso"
      });
      
      onAssessmentCreated();
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Erro ao criar avaliação",
        description: "Ocorreu um erro ao criar a avaliação",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação de Candidato</DialogTitle>
          <DialogDescription>
            Crie uma avaliação personalizada para candidatos com base no cargo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
                <TabsTrigger value="values">Valores da Empresa</TabsTrigger>
                <TabsTrigger value="disc">Avaliação DISC</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Avaliação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Avaliação para Desenvolvedor React" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição da finalidade desta avaliação..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Ativar Avaliação
                        </FormLabel>
                        <FormDescription>
                          Avaliações ativas podem ser enviadas para candidatos
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="questions">
                <QuestionBuilder 
                  questions={questions} 
                  onChange={setQuestions} 
                />
              </TabsContent>
              
              <TabsContent value="values">
                <FormField
                  control={form.control}
                  name="include_company_values"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Incluir Avaliação de Valores
                        </FormLabel>
                        <FormDescription>
                          Permite comparar os valores do candidato com os valores da empresa
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("include_company_values") && (
                  <CompanyValuesSelector 
                    selectedValues={selectedValues}
                    onChange={setSelectedValues}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="disc">
                <FormField
                  control={form.control}
                  name="include_disc"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Incluir Avaliação DISC
                        </FormLabel>
                        <FormDescription>
                          Permite avaliar o perfil comportamental do candidato
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("include_disc") && (
                  <DiscAssessmentSettings />
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Avaliação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
