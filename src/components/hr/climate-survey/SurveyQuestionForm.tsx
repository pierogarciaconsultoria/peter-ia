
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClimateSurveyQuestion } from "@/services/climateSurveyService";
import { toast } from "sonner";

// Validação do formulário utilizando Zod
const formSchema = z.object({
  question: z.string().min(5, "A pergunta deve ter pelo menos 5 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  question_type: z.enum(["scale", "text", "multiple_choice", "boolean"]),
  required: z.boolean().default(true),
  options: z.any().optional(),
});

type QuestionFormValues = z.infer<typeof formSchema>;

interface SurveyQuestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: Omit<ClimateSurveyQuestion, "id">) => Promise<void>;
  surveyId: string;
  editingQuestion?: ClimateSurveyQuestion;
  maxOrderNumber: number;
}

export function SurveyQuestionForm({
  open,
  onOpenChange,
  onSave,
  surveyId,
  editingQuestion,
  maxOrderNumber,
}: SurveyQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optionsText, setOptionsText] = useState("");
  
  // Definir o formulário com valores padrão
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      category: "geral",
      question_type: "scale",
      required: true,
      options: {},
    },
  });
  
  // Categorias disponíveis para perguntas
  const categories = [
    { value: "geral", label: "Geral" },
    { value: "lideranca", label: "Liderança" },
    { value: "comunicacao", label: "Comunicação" },
    { value: "ambiente", label: "Ambiente de Trabalho" },
    { value: "desenvolvimento", label: "Desenvolvimento Profissional" },
    { value: "reconhecimento", label: "Reconhecimento e Recompensa" },
    { value: "trabalho_equipe", label: "Trabalho em Equipe" },
    { value: "bem_estar", label: "Bem-estar" },
  ];

  // Tipos de perguntas disponíveis
  const questionTypes = [
    { value: "scale", label: "Escala (1-5)" },
    { value: "text", label: "Texto Livre" },
    { value: "multiple_choice", label: "Múltipla Escolha" },
    { value: "boolean", label: "Sim/Não" },
  ];
  
  // Atualizar formulário quando estiver editando uma pergunta existente
  useEffect(() => {
    if (editingQuestion) {
      form.reset({
        question: editingQuestion.question,
        category: editingQuestion.category,
        question_type: editingQuestion.question_type,
        required: editingQuestion.required,
        options: editingQuestion.options,
      });
      
      // Se for múltipla escolha, formatar as opções para texto
      if (editingQuestion.question_type === "multiple_choice" && editingQuestion.options?.choices) {
        setOptionsText(editingQuestion.options.choices.join("\n"));
      } else {
        setOptionsText("");
      }
    } else {
      form.reset({
        question: "",
        category: "geral",
        question_type: "scale",
        required: true,
        options: {},
      });
      setOptionsText("");
    }
  }, [editingQuestion, form]);
  
  // Ao mudar o tipo da pergunta, resetar as opções
  const handleQuestionTypeChange = (value: string) => {
    form.setValue("question_type", value as any);
    
    if (value === "multiple_choice") {
      setOptionsText("Opção 1\nOpção 2\nOpção 3");
    } else {
      setOptionsText("");
    }
  };
  
  // Lidar com o envio do formulário
  const onSubmit = async (values: QuestionFormValues) => {
    setIsSubmitting(true);
    try {
      let options = {};
      
      // Processar opções de acordo com o tipo de pergunta
      if (values.question_type === "multiple_choice") {
        const choices = optionsText
          .split("\n")
          .map(option => option.trim())
          .filter(option => option.length > 0);
          
        if (choices.length < 2) {
          toast.error("É necessário pelo menos 2 opções para perguntas de múltipla escolha");
          return;
        }
        
        options = { choices };
      } else if (values.question_type === "scale") {
        options = { min: 1, max: 5, labels: { 1: "Discordo Totalmente", 5: "Concordo Totalmente" } };
      }
      
      // Preparar pergunta para salvar
      const questionData: Omit<ClimateSurveyQuestion, "id"> = {
        survey_id: surveyId,
        question: values.question,
        category: values.category,
        question_type: values.question_type,
        required: values.required,
        options,
        order_number: editingQuestion ? editingQuestion.order_number : maxOrderNumber + 1,
        company_id: "1", // Isso deve ser definido dinamicamente de acordo com o usuário logado
      };
      
      await onSave(questionData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pergunta</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite a pergunta..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Agrupa perguntas por temas para análise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="question_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Resposta</FormLabel>
                    <Select 
                      onValueChange={handleQuestionTypeChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define como a pergunta será respondida.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch("question_type") === "multiple_choice" && (
              <FormItem>
                <FormLabel>Opções de Resposta</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite cada opção em uma linha"
                    className="min-h-[100px]"
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Digite cada opção em uma linha separada.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Obrigatória</FormLabel>
                    <FormDescription>
                      O participante deve responder esta pergunta.
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
            
            <div className="flex justify-end gap-2">
              <Button
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Pergunta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
