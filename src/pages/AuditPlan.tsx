
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchAuditPlans, createAuditPlan, AuditPlan } from "@/services/auditPlanService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeSelectorField } from "@/components/shared/EmployeeSelectorField";
import { toast } from "sonner";

const FormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  responsible_id: z.string().min(1, "Responsável deve ser selecionado"),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de término é obrigatória"),
  audited_areas: z.string().min(3, "Áreas auditadas devem ser especificadas"),
  team: z.string().optional(),
  status: z.enum(["rascunho", "planejada", "em_andamento", "finalizada"]),
  summary: z.string().optional(),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const AuditPlanPage = () => {
  const [plans, setPlans] = useState<AuditPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      responsible_id: "",
      start_date: "",
      end_date: "",
      audited_areas: "",
      team: "",
      status: "rascunho",
      summary: "",
      observations: "",
    },
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const result = await fetchAuditPlans();
    setPlans(result);
    setLoading(false);
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    
    const company_id = localStorage.getItem("company_id") || "";
    if (!company_id) {
      toast.error("ID da empresa não encontrado.");
      setLoading(false);
      return;
    }

    const planData = {
      ...values,
      responsible: "", // mantém compatibilidade
      company_id,
    };
    
    const result = await createAuditPlan(planData as any);
    if (result) {
      toast.success("Plano criado!");
      form.reset();
      loadPlans();
    } else {
      toast.error("Erro ao criar plano.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-3">Plano de Auditoria</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cadastrar Novo Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do plano de auditoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <EmployeeSelectorField
                  control={form.control}
                  name="responsible_id"
                  label="Responsável"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Término *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="audited_areas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Áreas Auditadas *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva as áreas que serão auditadas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipe</FormLabel>
                      <FormControl>
                        <Input placeholder="Membros da equipe de auditoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                          <SelectItem value="planejada">Planejada</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="finalizada">Finalizada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Input placeholder="Resumo do plano" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações adicionais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Salvando..." : "Salvar Plano"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-2">Planos Cadastrados</h2>
      <div className="space-y-3">
        {loading ? (
          <div className="text-muted-foreground">Carregando...</div>
        ) : plans.length === 0 ? (
          <div className="text-muted-foreground">Nenhum plano cadastrado.</div>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.title}
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    ({plan.status.replace("_", " ")})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <strong>Responsável:</strong> {plan.responsible} <br/>
                  <strong>Período:</strong> {plan.start_date} - {plan.end_date} <br/>
                  <strong>Áreas:</strong> {plan.audited_areas} <br/>
                  {plan.team && (<><strong>Equipe:</strong> {plan.team} <br/></>)}
                  {plan.summary && (<><strong>Resumo:</strong> {plan.summary} <br/></>)}
                  {plan.observations && (<><strong>Obs:</strong> {plan.observations} <br/></>)}
                  <small className="text-gray-400">Criado em {new Date(plan.created_at).toLocaleString()}</small>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditPlanPage;
