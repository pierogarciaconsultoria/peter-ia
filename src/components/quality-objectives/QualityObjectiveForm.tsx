
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { QualityObjective } from "@/services/qualityObjectivesService";

type Props = {
  initial?: Partial<QualityObjective> | null;
  onSave: (data: Omit<QualityObjective, "id" | "created_at" | "updated_at">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export default function QualityObjectiveForm({ initial, onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState<Omit<QualityObjective, "id" | "created_at" | "updated_at">>({
    title: initial?.title || "",
    description: initial?.description || "",
    target_value: initial?.target_value ?? undefined,
    unit: initial?.unit || "",
    status: (initial?.status as "ativo" | "inativo" | "concluido") || "ativo",
    company_id: initial?.company_id || "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "target_value" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.status) {
      toast.error("Preencha o título e o status!");
      return;
    }
    await onSave(form);
  }

  return (
    <form className="space-y-4 py-4" onSubmit={handleSubmit}>
      <div>
        <Label>Título *</Label>
        <Input name="title" value={form.title} onChange={onChange} required />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea name="description" value={form.description || ""} onChange={onChange} rows={2} />
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label>Meta numérica</Label>
          <Input
            name="target_value"
            type="number"
            value={form.target_value ?? ""}
            onChange={onChange}
            min={0}
          />
        </div>
        <div className="w-1/2">
          <Label>Unidade</Label>
          <Input name="unit" value={form.unit || ""} onChange={onChange} />
        </div>
      </div>
      <div>
        <Label>Status *</Label>
        <Select value={form.status} onValueChange={(val) => setForm((prev) => ({ ...prev, status: val as any }))}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
