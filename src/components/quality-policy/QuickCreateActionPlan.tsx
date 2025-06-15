
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  companyId: string;
  onCreated: (plan: { id: string; title: string }) => void;
};

export function QuickCreateActionPlan({ companyId, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Título obrigatório para plano de ação.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("action_plans")
      .insert([{ title: title.trim(), company_id: companyId }])
      .select("id, title")
      .single();
    setLoading(false);
    if (error || !data) {
      toast.error("Erro ao criar plano de ação.");
      return;
    }
    toast.success("Plano criado!");
    setTitle("");
    onCreated({ id: data.id, title: data.title });
  }

  return (
    <form onSubmit={handleCreate} className="flex gap-2 mb-2 mt-1">
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Novo plano de ação..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !title.trim()}>
        Adicionar
      </Button>
    </form>
  );
}
