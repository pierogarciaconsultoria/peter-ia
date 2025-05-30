
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CompanyFormData {
  name: string;
  slug: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  responsible: string;
  plan: string;
  active_modules: string[];
}

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const availableModules = [
  { id: 'hr', label: 'Recursos Humanos' },
  { id: 'quality', label: 'Gestão da Qualidade' },
  { id: 'processes', label: 'Processos' },
  { id: 'indicators', label: 'Indicadores' },
  { id: 'risks', label: 'Gestão de Riscos' },
  { id: 'audits', label: 'Auditorias' },
  { id: 'documents', label: 'Documentos' },
  { id: 'strategic', label: 'Planejamento Estratégico' },
  { id: 'meetings', label: 'Reuniões' },
  { id: 'actions', label: 'Planos de Ação' },
  { id: 'ambiente', label: 'Ambiente' },
];

const planOptions = [
  { value: 'free', label: 'Gratuito' },
  { value: 'basic', label: 'Básico' },
  { value: 'professional', label: 'Profissional' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function CompanyForm({ onSubmit, isLoading, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    slug: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    responsible: '',
    plan: 'free',
    active_modules: [],
  });

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name') {
        updated.slug = value.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
      
      return updated;
    });
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      active_modules: checked
        ? [...prev.active_modules, moduleId]
        : prev.active_modules.filter(id => id !== moduleId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Empresa ABC Ltda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Identificador Único *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="empresa-abc"
                required
              />
              <p className="text-xs text-muted-foreground">
                Usado para URLs e identificação única da empresa
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => handleInputChange('responsible', e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contato e Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@empresa.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade - UF, CEP"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plano</Label>
              <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((plan) => (
                    <SelectItem key={plan.value} value={plan.value}>
                      {plan.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Módulos Ativos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione os módulos que estarão disponíveis para esta empresa
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableModules.map((module) => (
              <div key={module.id} className="flex items-center space-x-2">
                <Checkbox
                  id={module.id}
                  checked={formData.active_modules.includes(module.id)}
                  onCheckedChange={(checked) => handleModuleToggle(module.id, checked as boolean)}
                />
                <Label
                  htmlFor={module.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {module.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Empresa'
          )}
        </Button>
      </div>
    </form>
  );
}
