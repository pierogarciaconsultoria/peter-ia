import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the form schema
const exitInterviewSchema = z.object({
  employeeName: z.string().min(2, "Nome do funcionário é obrigatório"),
  position: z.string().min(1, "Cargo é obrigatório"),
  department: z.string().min(1, "Departamento é obrigatório"),
  exitDate: z.date({ required_error: "Data de saída é obrigatória" }),
  reason: z.string().min(1, "Motivo do desligamento é obrigatório"),
  feedback: z.string().min(1, "Feedback é obrigatório"),
  overallExperience: z.string().min(1, "Avaliação geral é obrigatória"),
  wouldRecommend: z.string().min(1, "Recomendação é obrigatória"),
  improvementSuggestions: z.string().min(1, "Sugestões de melhoria são obrigatórias"),
});

type ExitInterviewFormValues = z.infer<typeof exitInterviewSchema>;

interface ExitInterviewFormProps {
  onSubmit: (data: ExitInterviewFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<ExitInterviewFormValues>;
}

export function ExitInterviewForm({
  onSubmit,
  onCancel,
  initialData,
}: ExitInterviewFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ExitInterviewFormValues>({
    resolver: zodResolver(exitInterviewSchema),
    defaultValues: {
      employeeName: initialData?.employeeName || "",
      position: initialData?.position || "",
      department: initialData?.department || "",
      exitDate: initialData?.exitDate || new Date(),
      reason: initialData?.reason || "",
      feedback: initialData?.feedback || "",
      overallExperience: initialData?.overallExperience || "",
      wouldRecommend: initialData?.wouldRecommend || "",
      improvementSuggestions: initialData?.improvementSuggestions || "",
    },
  });

  const handleSubmit = (values: ExitInterviewFormValues) => {
    onSubmit(values);
    toast({
      title: "Entrevista de desligamento registrada",
      description: "Os dados foram salvos com sucesso.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Funcionário</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Cargo do funcionário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input placeholder="Departamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Saída</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do Desligamento</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="proposta_melhor">Proposta melhor</SelectItem>
                  <SelectItem value="mudanca_carreira">Mudança de carreira</SelectItem>
                  <SelectItem value="realocacao">Realocação</SelectItem>
                  <SelectItem value="motivos_pessoais">Motivos pessoais</SelectItem>
                  <SelectItem value="ambiente_trabalho">Ambiente de trabalho</SelectItem>
                  <SelectItem value="lideranca">Problemas com liderança</SelectItem>
                  <SelectItem value="salario_beneficios">Salário/benefícios</SelectItem>
                  <SelectItem value="formacao_academica">Formação acadêmica</SelectItem>
                  <SelectItem value="demissao_empresa">Decisão da empresa</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overallExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como avalia sua experiência geral na empresa?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma avaliação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="boa">Boa</SelectItem>
                  <SelectItem value="neutra">Neutra</SelectItem>
                  <SelectItem value="ruim">Ruim</SelectItem>
                  <SelectItem value="muito_ruim">Muito ruim</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wouldRecommend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recomendaria a empresa para outras pessoas?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sim">Sim, definitivamente</SelectItem>
                  <SelectItem value="talvez">Talvez</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback sobre a experiência na empresa</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compartilhe sua experiência na empresa, aspectos positivos e negativos."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Esse feedback nos ajudará a melhorar nossos processos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="improvementSuggestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sugestões de melhoria</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="O que poderíamos fazer para melhorar o ambiente de trabalho?"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Entrevista
          </Button>
        </div>
      </form>
    </Form>
  );
}
