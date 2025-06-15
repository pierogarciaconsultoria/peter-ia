
import React, { useEffect, useState } from "react";
import { fetchAuditPlans, createAuditPlan, AuditPlan } from "@/services/auditPlanService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const initialForm = {
  title: "",
  responsible: "",
  start_date: "",
  end_date: "",
  audited_areas: "",
  team: "",
  status: "rascunho",
  summary: "",
  observations: "",
  company_id: "",
};

const AuditPlanPage = () => {
  const [plans, setPlans] = useState<AuditPlan[]>([]);
  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const result = await fetchAuditPlans();
    setPlans(result);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.responsible || !form.start_date || !form.end_date || !form.audited_areas) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    // Pega company_id do localStorage/contexto (por simplicidade — melhorar depois)
    let company_id = form.company_id;
    if (!company_id) {
      company_id = localStorage.getItem("company_id") || ""; // Ajuda em MVP
      if (!company_id) {
        toast.error("ID da empresa não encontrado.");
        setLoading(false);
        return;
      }
    }

    const planData = {
      ...form,
      company_id,
      status: form.status as AuditPlan["status"],
    };
    const result = await createAuditPlan(planData as any);
    if (result) {
      toast.success("Plano criado!");
      setForm(initialForm);
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
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <Input name="title" value={form.title} onChange={handleInputChange} placeholder="Título*" required />
            <Input name="responsible" value={form.responsible} onChange={handleInputChange} placeholder="Responsável*" required />
            <Input type="date" name="start_date" value={form.start_date} onChange={handleInputChange} placeholder="Início*" required />
            <Input type="date" name="end_date" value={form.end_date} onChange={handleInputChange} placeholder="Término*" required />
            <Input name="audited_areas" value={form.audited_areas} onChange={handleInputChange} placeholder="Áreas auditadas*" required />
            <Input name="team" value={form.team} onChange={handleInputChange} placeholder="Equipe" />
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border rounded px-2 py-2"
            >
              <option value="rascunho">Rascunho</option>
              <option value="planejada">Planejada</option>
              <option value="em_andamento">Em andamento</option>
              <option value="finalizada">Finalizada</option>
            </select>
            <Input name="summary" value={form.summary} onChange={handleInputChange} placeholder="Resumo" />
            <Input name="observations" value={form.observations} onChange={handleInputChange} placeholder="Observações" />
            {/* Campo oculto para company_id */}
            <input type="hidden" name="company_id" value={form.company_id} />
            <div className="md:col-span-2 mt-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Salvando..." : "Salvar Plano"}
              </Button>
            </div>
          </form>
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
