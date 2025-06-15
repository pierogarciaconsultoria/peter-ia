
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  value: string;
  onSave: (policy: string) => Promise<void>;
  loading?: boolean;
};

export default function QualityPolicyForm({
  value,
  onSave,
  loading,
}: Props) {
  const [text, setText] = useState(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Insira o texto da política da qualidade.");
      return;
    }
    await onSave(text.trim());
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={7}
        placeholder="Digite a Política da Qualidade da sua empresa..."
        disabled={loading}
        maxLength={2000}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
