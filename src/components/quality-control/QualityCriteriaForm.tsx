
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { QualityCriteria, createQualityCriteria, updateQualityCriteria } from "@/services/qualityControlService";
import { useToast } from "@/hooks/use-toast";

interface QualityCriteriaFormProps {
  criteria?: QualityCriteria;
  onSuccess?: () => void;
}

export function QualityCriteriaForm({ criteria, onSuccess }: QualityCriteriaFormProps) {
  const [name, setName] = useState(criteria?.name || "");
  const [description, setDescription] = useState(criteria?.description || "");
  const [expectedValue, setExpectedValue] = useState(criteria?.expected_value || "");
  const [tolerance, setTolerance] = useState(criteria?.tolerance || "");
  const [measurementUnit, setMeasurementUnit] = useState(criteria?.measurement_unit || "");
  const [category, setCategory] = useState(criteria?.category || "");
  const [companySegment, setCompanySegment] = useState(criteria?.company_segment || "");
  const [isActive, setIsActive] = useState(criteria?.is_active !== false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const criteriaData = {
        name,
        description,
        expected_value: expectedValue,
        tolerance,
        measurement_unit: measurementUnit,
        category,
        company_segment: companySegment,
        is_active: isActive
      };

      if (criteria) {
        await updateQualityCriteria(criteria.id, criteriaData);
        toast({
          title: "Critério atualizado",
          description: "O critério de qualidade foi atualizado com sucesso."
        });
      } else {
        await createQualityCriteria(criteriaData);
        toast({
          title: "Critério criado",
          description: "O novo critério de qualidade foi criado com sucesso."
        });

        // Reset form if creating new
        setName("");
        setDescription("");
        setExpectedValue("");
        setTolerance("");
        setMeasurementUnit("");
        setCategory("");
        setCompanySegment("");
        setIsActive(true);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving quality criteria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar o critério de qualidade."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{criteria ? "Editar Critério" : "Novo Critério de Qualidade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Critério</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="expected_value">Valor Esperado</Label>
              <Input 
                id="expected_value" 
                value={expectedValue} 
                onChange={(e) => setExpectedValue(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerância</Label>
              <Input 
                id="tolerance" 
                value={tolerance} 
                onChange={(e) => setTolerance(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurement_unit">Unidade de Medida</Label>
              <Input 
                id="measurement_unit" 
                value={measurementUnit} 
                onChange={(e) => setMeasurementUnit(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Segmento da Empresa</Label>
            <Select value={companySegment} onValueChange={setCompanySegment}>
              <SelectTrigger id="segment">
                <SelectValue placeholder="Selecione o segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentos">Alimentos</SelectItem>
                <SelectItem value="Automotivo">Automotivo</SelectItem>
                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                <SelectItem value="Farmacêutico">Farmacêutico</SelectItem>
                <SelectItem value="Plásticos">Plásticos</SelectItem>
                <SelectItem value="Químico">Químico</SelectItem>
                <SelectItem value="Têxtil">Têxtil</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Critério Ativo</Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
