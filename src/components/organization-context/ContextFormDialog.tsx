
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createOrganizationContext } from "@/services/organizationContextService";

const formSchema = z.object({
  description: z.string({ required_error: "A descrição é obrigatória" })
    .min(3, "A descrição deve ter pelo menos 3 caracteres"),
  context_type: z.enum(["internal_factor", "external_factor", "interested_party", "swot"], {
    required_error: "O tipo de contexto é obrigatório",
  }),
  swot_category: z.enum(["strength", "weakness", "opportunity", "threat"]).optional(),
  analysis: z.string().optional(),
  update_date: z.date({ required_error: "A data de atualização é obrigatória" }),
  created_by: z.string({ required_error: "Responsável é obrigatório" })
    .min(3, "O nome do responsável deve ter pelo menos 3 caracteres"),
}).refine(data => {
  // If context_type is swot, then swot_category is required
  if (data.context_type === "swot") {
    return !!data.swot_category;
  }
  return true;
}, {
  message: "A categoria SWOT é obrigatória para análise SWOT",
  path: ["swot_category"],
});

type FormValues = z.infer<typeof formSchema>;

interface ContextFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const getContextTypeLabel = (type: string) => {
  switch (type) {
    case "internal_factor":
      return "Fator Interno";
    case "external_factor":
      return "Fator Externo";
    case "interested_party":
      return "Parte Interessada";
    case "swot":
      return "Análise SWOT";
    default:
      return type;
  }
};

const getSwotCategoryLabel = (category: string) => {
  switch (category) {
    case "strength":
      return "Ponto Forte";
    case "weakness":
      return "Ponto Fraco";
    case "opportunity":
      return "Oportunidade";
    case "threat":
      return "Ameaça";
    default:
      return category;
  }
};

export function ContextFormDialog({ open, onOpenChange, onSuccess }: ContextFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      context_type: "internal_factor",
      analysis: "",
      update_date: new Date(),
      created_by: "",
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;
  const contextType = form.watch("context_type");
  const isSwotSelected = contextType === "swot";

  async function onSubmit(values: FormValues) {
    try {
      await createOrganizationContext({
        description: values.description,
        context_type: values.context_type,
        swot_category: values.swot_category,
        analysis: values.analysis || "",
        update_date: format(values.update_date, "yyyy-MM-dd"),
        created_by: values.created_by,
      });
      
      toast.success("Item de contexto criado com sucesso!");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar item de contexto:", error);
      toast.error("Falha ao criar item de contexto");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Novo Item de Contexto</DialogTitle>
          <DialogDescription>
            Adicione um novo item de contexto organizacional para análise.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="context_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Contexto</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset SWOT category when changing context type
                      if (value !== "swot") {
                        form.setValue("swot_category", undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de contexto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="internal_factor">Fator Interno</SelectItem>
                        <SelectItem value="external_factor">Fator Externo</SelectItem>
                        <SelectItem value="interested_party">Parte Interessada</SelectItem>
                        <SelectItem value="swot">Análise SWOT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isSwotSelected && (
              <FormField
                control={form.control}
                name="swot_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria SWOT</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria SWOT" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="strength">Ponto Forte</SelectItem>
                          <SelectItem value="weakness">Ponto Fraco</SelectItem>
                          <SelectItem value="opportunity">Oportunidade</SelectItem>
                          <SelectItem value="threat">Ameaça</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Descreva o item de contexto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="analysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Análise</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Detalhes da análise (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="update_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Atualização</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="created_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Nome do responsável"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
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
