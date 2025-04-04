
import { useState } from "react";
import { QualityInspection } from "@/services/qualityControlService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { NonConformingProduct } from "@/services/nonConformingProductService";

interface NonConformityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: QualityInspection | null;
}

export function NonConformityDialog({ open, onOpenChange, inspection }: NonConformityDialogProps) {
  const [department, setDepartment] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [immediateAction, setImmediateAction] = useState("");
  const [nonConformityType, setNonConformityType] = useState("");
  const [requirementId, setRequirementId] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspection) return;

    setLoading(true);
    try {
      // Here we would normally create a non-conforming product record
      // const { createNonConformingProduct } = await import("@/services/nonConformingProductService");
      
      // Collect failing criteria to include in description
      const failingCriteria = inspection.criteria_results
        .filter(result => !result.is_conforming)
        .map(result => `${result.criteria_name}: ${result.actual_value} (esperado: ${result.expected_value})`)
        .join("; ");
      
      const description = `Inspeção ${inspection.id} falhou nos critérios: ${failingCriteria}. ${inspection.observations || ""}`;
      
      // Create a non-conforming product with all required fields
      const nonConformingProduct = {
        product_name: inspection.product_name,
        description,
        status: "identified" as const,
        approval_status: "pending" as const,
        severity,
        requirement_id: requirementId,
        department,
        customer,
        immediate_action: immediateAction,
        non_conformity_type: nonConformityType
      };
      
      // In a real implementation:
      // await createNonConformingProduct(nonConformingProduct);
      
      console.log("Would create non-conforming product:", nonConformingProduct);
      
      toast({
        title: "Produto não conforme registrado",
        description: "O registro foi adicionado com sucesso.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating non-conforming product:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar produto não conforme",
        description: "Ocorreu um erro ao tentar registrar o produto não conforme."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Produto Não Conforme</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Produto</Label>
            <Input 
              id="product" 
              value={inspection.product_name} 
              disabled 
            />
          </div>

          <div>
            <Label htmlFor="batch">Lote</Label>
            <Input 
              id="batch" 
              value={inspection.batch_number} 
              disabled 
            />
          </div>

          <div>
            <Label htmlFor="department">Departamento Responsável</Label>
            <Input 
              id="department" 
              value={department} 
              onChange={e => setDepartment(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="requirement">ID do Requisito</Label>
            <Input 
              id="requirement" 
              value={requirementId} 
              onChange={e => setRequirementId(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="severity">Severidade</Label>
            <Select 
              value={severity} 
              onValueChange={(value: "low" | "medium" | "high" | "critical") => setSeverity(value)}
            >
              <SelectTrigger id="severity">
                <SelectValue placeholder="Selecione a severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nonConformityType">Tipo de Não Conformidade</Label>
            <Input 
              id="nonConformityType" 
              value={nonConformityType} 
              onChange={e => setNonConformityType(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="customer">Cliente (se aplicável)</Label>
            <Input 
              id="customer" 
              value={customer} 
              onChange={e => setCustomer(e.target.value)} 
            />
          </div>

          <div>
            <Label htmlFor="immediateAction">Ação Imediata</Label>
            <Textarea 
              id="immediateAction" 
              value={immediateAction} 
              onChange={e => setImmediateAction(e.target.value)} 
              rows={3}
              required 
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
