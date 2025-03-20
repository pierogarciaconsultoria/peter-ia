
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  process: z.string().min(1, "Selecione um processo"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  causes: z.string().min(5, "As causas devem ter pelo menos 5 caracteres"),
  consequences: z.string().min(5, "As consequências devem ter pelo menos 5 caracteres"),
  probability: z.string().min(1, "Selecione a probabilidade"),
  impact: z.string().min(1, "Selecione o impacto"),
  status: z.string().min(1, "Selecione o status"),
  treatment: z.string().optional(),
  responsible: z.string().min(3, "O responsável deve ter pelo menos 3 caracteres"),
  deadline: z.string().optional(),
});

export function RiskForm({ risk = null, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: risk ? {
      title: risk.title,
      process: risk.process,
      description: risk.description || "",
      causes: risk.causes || "",
      consequences: risk.consequences || "",
      probability: risk.probability,
      impact: risk.impact,
      status: risk.status,
      treatment: risk.treatment || "",
      responsible: risk.responsible || "",
      deadline: risk.deadline || "",
    } : {
      title: "",
      process: "",
      description: "",
      causes: "",
      consequences: "",
      probability: "",
      impact: "",
      status: "Aberto",
      treatment: "",
      responsible: "",
      deadline: "",
    }
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submitted:", values);
      toast.success(risk ? "Risco atualizado com sucesso!" : "Risco criado com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ocorreu um erro ao salvar o risco");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Risco</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título do risco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="process"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o processo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Compras">Compras</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o risco em detalhes" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="causes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Causas</FormLabel>
                <FormControl>
                  <Textarea placeholder="Quais são as causas potenciais?" {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="consequences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consequências</FormLabel>
                <FormControl>
                  <Textarea placeholder="Quais são as consequências potenciais?" {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impacto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aberto">Aberto</SelectItem>
                    <SelectItem value="Em tratamento">Em tratamento</SelectItem>
                    <SelectItem value="Monitorando">Monitorando</SelectItem>
                    <SelectItem value="Tratado">Tratado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano de Tratamento</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o plano de tratamento do risco" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Responsável pelo tratamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : risk ? "Atualizar Risco" : "Adicionar Risco"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
