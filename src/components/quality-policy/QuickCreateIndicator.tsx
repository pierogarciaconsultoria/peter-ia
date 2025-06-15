
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  companyId: string;
  onCreated: (indicator: { id: string; name: string }) => void;
};

export function QuickCreateIndicator({ companyId, onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome obrigatório para indicador.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("performance_indicators")
      .insert([{ name: name.trim(), company_id: companyId, process: "", goal_type: "higher_better", goal_value: 0, calculation_type: "sum" }])
      .select("id, name")
      .single();
    setLoading(false);
    if (error || !data) {
      toast.error("Erro ao criar indicador.");
      return;
    }
    toast.success("Indicador criado!");
    setName("");
    onCreated({ id: data.id, name: data.name });
  }

  return (
    <form onSubmit={handleCreate} className="flex gap-2 mb-2 mt-1">
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Novo indicador de desempenho..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !name.trim()}>
        Adicionar
      </Button>
    </form>
  );
}
