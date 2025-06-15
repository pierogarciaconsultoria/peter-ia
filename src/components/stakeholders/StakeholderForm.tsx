
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Stakeholder } from "@/services/stakeholderService";

type FormState = Omit<Stakeholder, "id" | "created_at" | "updated_at">;

interface StakeholderFormProps {
  initial?: Partial<FormState>;
  onSubmit: (data: FormState) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function StakeholderForm({ initial, onSubmit, onCancel, loading }: StakeholderFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name || "",
    type: initial?.type || "interno",
    category: initial?.category || "",
    influence_level: initial?.influence_level || "baixo",
    interest_level: initial?.interest_level || "baixo",
    expectations: initial?.expectations || "",
    communication_method: initial?.communication_method || "",
    contact_info: initial?.contact_info || "",
    notes: initial?.notes || "",
    company_id: initial?.company_id || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelect(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category) return;
    await onSubmit(form);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <Label>Nome *</Label>
        <Input name="name" required value={form.name} onChange={handleChange} />
      </div>
      <div>
        <Label>Categoria *</Label>
        <Input name="category" required value={form.category} onChange={handleChange} />
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={v => handleSelect("type", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="interno">Interno</SelectItem>
              <SelectItem value="externo">Externo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label>Nível de Influência</Label>
          <Select value={form.influence_level} onValueChange={v => handleSelect("influence_level", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="médio">Médio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="crítico">Crítico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Nível de Interesse</Label>
        <Select value={form.interest_level} onValueChange={v => handleSelect("interest_level", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="médio">Médio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Expectativas</Label>
        <Textarea name="expectations" value={form.expectations} onChange={handleChange} rows={2}/>
      </div>
      <div>
        <Label>Meio de Comunicação</Label>
        <Input name="communication_method" value={form.communication_method} onChange={handleChange} />
      </div>
      <div>
        <Label>Contato</Label>
        <Input name="contact_info" value={form.contact_info} onChange={handleChange} />
      </div>
      <div>
        <Label>Notas</Label>
        <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2}/>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel &&
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        }
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
