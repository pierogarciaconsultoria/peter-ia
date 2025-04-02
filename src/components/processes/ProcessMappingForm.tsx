
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

interface ProcessActivity {
  id: string;
  activity: string;
  actor: string;
  resources: string;
  documentation: string;
}

interface ProcessFormValues {
  name: string;
  objective: string;
  painProblems: string;
  risks: string;
  inputRequirements: string;
  expectedOutput: string;
  performanceIndicators: string;
  processType: "gestao" | "negocio" | "apoio";
  activities: ProcessActivity[];
}

interface ProcessMappingFormProps {
  onSubmit: (data: ProcessFormValues) => void;
}

export function ProcessMappingForm({ onSubmit }: ProcessMappingFormProps) {
  const form = useForm<ProcessFormValues>({
    defaultValues: {
      name: "",
      objective: "",
      painProblems: "",
      risks: "",
      inputRequirements: "",
      expectedOutput: "",
      performanceIndicators: "",
      processType: "negocio",
      activities: [
        {
          id: "1",
          activity: "",
          actor: "",
          resources: "",
          documentation: ""
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "activities",
    control: form.control
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (values: ProcessFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real application, you would save this to your database here
      console.log("Process form values:", values);
      toast.success("Mapeamento de processo salvo com sucesso!");
      
      // Pass the data to the parent component
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting process form:", error);
      toast.error("Erro ao salvar o mapeamento de processo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewActivity = () => {
    append({
      id: `activity-${Date.now()}`,
      activity: "",
      actor: "",
      resources: "",
      documentation: ""
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mapeamento de Processos</h1>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário abaixo para mapear um novo processo utilizando a metodologia SIPOC
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Processo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do processo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo do processo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o objetivo principal deste processo" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="painProblems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dores/Problemas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva as dores ou problemas relacionados ao processo" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="risks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Riscos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Identifique os riscos associados ao processo" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Processo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gestao" id="r1" />
                        <Label htmlFor="r1">Gestão</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="negocio" id="r2" />
                        <Label htmlFor="r2">Negócio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apoio" id="r3" />
                        <Label htmlFor="r3">Apoio</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="inputRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisitos de entrada (início do processo)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste os requisitos necessários para iniciar o processo" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="expectedOutput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado esperado do processo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva qual é o resultado esperado após a conclusão do processo" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="performanceIndicators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicadores de Desempenho (KPIs)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste os principais indicadores de desempenho que serão utilizados para medir o sucesso deste processo (ex: tempo médio de ciclo, taxa de erros, satisfação do cliente)" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Atividades do Processo</h3>
            </div>

            <div className="bg-muted/40 rounded-md p-4">
              <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Atividade</div>
                <div className="col-span-2">Ator do Processo</div>
                <div className="col-span-3">Recursos</div>
                <div className="col-span-3">Documentação</div>
                <div className="col-span-1">Ações</div>
              </div>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="border border-muted">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`activities.${index}.activity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva a atividade a ser realizada"
                                className="min-h-[80px] text-sm"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`activities.${index}.actor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Responsável pela atividade"
                                className="text-sm"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`activities.${index}.resources`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Liste os recursos necessários para a execução"
                                className="min-h-[80px] text-sm"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`activities.${index}.documentation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva a documentação relacionada a esta atividade"
                                className="min-h-[80px] text-sm"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewActivity}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Atividade
            </Button>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              size="lg"
              className="bg-teal-700 hover:bg-teal-800"
            >
              {isSubmitting ? "Salvando..." : "Salvar Mapeamento"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
