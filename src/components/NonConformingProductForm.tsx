
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash,
  Save,
  X,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Mock data types and initial values
type Emitter = { id: string; name: string };
type Customer = { id: string; name: string };
type Department = { id: string; name: string };
type Person = { id: string; name: string };
type Product = { id: string; name: string; code: string };
type NonConformanceType = { id: string; name: string };
type ImmediateAction = { id: string; name: string };

const NonConformingProductForm = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  // Form data state
  const [formData, setFormData] = useState({
    emitter: "",
    operationNumber: "",
    customer: "",
    department: "",
    responsible: "",
    product: "",
    totalPieces: 0,
    nonConformingPieces: 0,
    qualityPercentage: 100,
    nonConformanceType: "",
    problemDescription: "",
    immediateAction: "",
    actions: [{ action: "", deadline: "", responsible: "" }],
    effectivenessVerification: "",
    approvalStatus: "pending", // 'pending', 'approved', 'rejected'
  });

  // Mock data lists (would be fetched from database in a real implementation)
  const [emitters, setEmitters] = useState<Emitter[]>([
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Oliveira" },
  ]);
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "Empresa A" },
    { id: "2", name: "Empresa B" },
  ]);
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Produção" },
    { id: "2", name: "Qualidade" },
    { id: "3", name: "Engenharia" },
  ]);
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Carlos Santos" },
    { id: "2", name: "Ana Pereira" },
    { id: "3", name: "Paulo Ferreira" },
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Produto A", code: "PA001" },
    { id: "2", name: "Componente B", code: "CB002" },
  ]);
  const [nonConformanceTypes, setNonConformanceTypes] = useState<NonConformanceType[]>([
    { id: "1", name: "Dimensional" },
    { id: "2", name: "Visual" },
    { id: "3", name: "Funcional" },
  ]);
  const [immediateActions, setImmediateActions] = useState<ImmediateAction[]>([
    { id: "1", name: "Segregar" },
    { id: "2", name: "Retrabalhar" },
    { id: "3", name: "Sucatear" },
  ]);

  // States for editing modal
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{type: string, item: any, index: number | null}>({
    type: "",
    item: null,
    index: null
  });
  const [editValue, setEditValue] = useState("");

  // Calculate quality percentage when total or non-conforming pieces change
  useEffect(() => {
    if (formData.totalPieces > 0) {
      const percentage = ((formData.totalPieces - formData.nonConformingPieces) / formData.totalPieces) * 100;
      setFormData(prev => ({
        ...prev,
        qualityPercentage: Math.round(percentage * 100) / 100
      }));
    }
  }, [formData.totalPieces, formData.nonConformingPieces]);

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle action row changes
  const handleActionChange = (index: number, field: string, value: string) => {
    const updatedActions = [...formData.actions];
    updatedActions[index] = {
      ...updatedActions[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      actions: updatedActions
    }));
  };

  // Add a new action row
  const addActionRow = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { action: "", deadline: "", responsible: "" }]
    }));
  };

  // Remove an action row
  const removeActionRow = (index: number) => {
    if (formData.actions.length > 1) {
      const updatedActions = formData.actions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        actions: updatedActions
      }));
    }
  };

  // Handle opening the edit modal
  const openEditModal = (type: string, item: any = null, index: number | null = null) => {
    setEditingItem({ type, item, index });
    setEditValue(item ? item.name : "");
    setEditModal(true);
  };

  // Handle saving the edited/new item
  const saveEditedItem = () => {
    if (!editValue.trim()) {
      return;
    }

    const { type, item, index } = editingItem;
    
    switch (type) {
      case "emitter":
        if (item) {
          setEmitters(prev => prev.map(e => e.id === item.id ? { ...e, name: editValue } : e));
        } else {
          const newId = Date.now().toString();
          setEmitters(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
      case "customer":
        if (item) {
          setCustomers(prev => prev.map(c => c.id === item.id ? { ...c, name: editValue } : c));
        } else {
          const newId = Date.now().toString();
          setCustomers(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
      case "department":
        if (item) {
          setDepartments(prev => prev.map(d => d.id === item.id ? { ...d, name: editValue } : d));
        } else {
          const newId = Date.now().toString();
          setDepartments(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
      case "person":
        if (item) {
          setPeople(prev => prev.map(p => p.id === item.id ? { ...p, name: editValue } : p));
        } else {
          const newId = Date.now().toString();
          setPeople(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
      case "product":
        if (item) {
          setProducts(prev => prev.map(p => p.id === item.id ? { ...p, name: editValue } : p));
        } else {
          const newId = Date.now().toString();
          setProducts(prev => [...prev, { id: newId, name: editValue, code: `P${newId.substring(0, 3)}` }]);
        }
        break;
      case "nonConformanceType":
        if (item) {
          setNonConformanceTypes(prev => prev.map(t => t.id === item.id ? { ...t, name: editValue } : t));
        } else {
          const newId = Date.now().toString();
          setNonConformanceTypes(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
      case "immediateAction":
        if (item) {
          setImmediateActions(prev => prev.map(a => a.id === item.id ? { ...a, name: editValue } : a));
        } else {
          const newId = Date.now().toString();
          setImmediateActions(prev => [...prev, { id: newId, name: editValue }]);
        }
        break;
    }

    setEditModal(false);
    setEditValue("");
  };

  // Handle deleting an item
  const deleteItem = (type: string, id: string) => {
    switch (type) {
      case "emitter":
        setEmitters(prev => prev.filter(e => e.id !== id));
        if (formData.emitter === id) {
          setFormData(prev => ({ ...prev, emitter: "" }));
        }
        break;
      case "customer":
        setCustomers(prev => prev.filter(c => c.id !== id));
        if (formData.customer === id) {
          setFormData(prev => ({ ...prev, customer: "" }));
        }
        break;
      case "department":
        setDepartments(prev => prev.filter(d => d.id !== id));
        if (formData.department === id) {
          setFormData(prev => ({ ...prev, department: "" }));
        }
        break;
      case "person":
        setPeople(prev => prev.filter(p => p.id !== id));
        if (formData.responsible === id) {
          setFormData(prev => ({ ...prev, responsible: "" }));
        }
        // Also check action responsible fields
        setFormData(prev => ({
          ...prev,
          actions: prev.actions.map(action => 
            action.responsible === id ? { ...action, responsible: "" } : action
          )
        }));
        break;
      case "product":
        setProducts(prev => prev.filter(p => p.id !== id));
        if (formData.product === id) {
          setFormData(prev => ({ ...prev, product: "" }));
        }
        break;
      case "nonConformanceType":
        setNonConformanceTypes(prev => prev.filter(t => t.id !== id));
        if (formData.nonConformanceType === id) {
          setFormData(prev => ({ ...prev, nonConformanceType: "" }));
        }
        break;
      case "immediateAction":
        setImmediateActions(prev => prev.filter(a => a.id !== id));
        if (formData.immediateAction === id) {
          setFormData(prev => ({ ...prev, immediateAction: "" }));
        }
        break;
    }
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      // In a real app, this would make an API request to the backend
      console.log("Submitting form data:", formData);
      
      // For now, we'll just close the dialog
      onOpenChange(false);
      
      // Reset form data
      setFormData({
        emitter: "",
        operationNumber: "",
        customer: "",
        department: "",
        responsible: "",
        product: "",
        totalPieces: 0,
        nonConformingPieces: 0,
        qualityPercentage: 100,
        nonConformanceType: "",
        problemDescription: "",
        immediateAction: "",
        actions: [{ action: "", deadline: "", responsible: "" }],
        effectivenessVerification: "",
        approvalStatus: "pending",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Render select items with edit and delete actions
  const renderSelectItems = (
    items: any[],
    type: string,
    valueKey: string = "id",
    displayKey: string = "name"
  ) => {
    return (
      <>
        {items.map((item) => (
          <div key={item[valueKey]} className="flex items-center justify-between">
            <SelectItem value={item[valueKey]} className="flex-1">
              {item[displayKey]}
            </SelectItem>
            <div className="flex pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openEditModal(type, item);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteItem(type, item[valueKey]);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="border-t px-2 py-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openEditModal(type);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar novo
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Produto Não Conforme</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para registrar um produto não conforme.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome do Emitente */}
              <div className="grid gap-2">
                <Label htmlFor="emitter">Nome do Emitente</Label>
                <Select
                  value={formData.emitter}
                  onValueChange={(value) => handleChange("emitter", value)}
                >
                  <SelectTrigger id="emitter">
                    <SelectValue placeholder="Selecione o emitente" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(emitters, "emitter")}
                  </SelectContent>
                </Select>
              </div>

              {/* Número da OP */}
              <div className="grid gap-2">
                <Label htmlFor="operationNumber">Número da OP</Label>
                <Input
                  id="operationNumber"
                  placeholder="Digite o número da OP"
                  value={formData.operationNumber}
                  onChange={(e) => handleChange("operationNumber", e.target.value)}
                />
              </div>

              {/* Cliente */}
              <div className="grid gap-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select
                  value={formData.customer}
                  onValueChange={(value) => handleChange("customer", value)}
                >
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(customers, "customer")}
                  </SelectContent>
                </Select>
              </div>

              {/* Setor Responsável */}
              <div className="grid gap-2">
                <Label htmlFor="department">Setor Responsável</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(departments, "department")}
                  </SelectContent>
                </Select>
              </div>

              {/* Responsável */}
              <div className="grid gap-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Select
                  value={formData.responsible}
                  onValueChange={(value) => handleChange("responsible", value)}
                >
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(people, "person")}
                  </SelectContent>
                </Select>
              </div>

              {/* Cadastro de Produto */}
              <div className="grid gap-2">
                <Label htmlFor="product">Cadastro de Produto</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => handleChange("product", value)}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(products, "product")}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade Total de Peças da OP */}
              <div className="grid gap-2">
                <Label htmlFor="totalPieces">Quantidade Total de Peças da OP</Label>
                <Input
                  id="totalPieces"
                  type="number"
                  placeholder="Digite a quantidade total"
                  value={formData.totalPieces || ""}
                  onChange={(e) => handleChange("totalPieces", Number(e.target.value))}
                />
              </div>

              {/* Quantidade de Peças Não Conformes */}
              <div className="grid gap-2">
                <Label htmlFor="nonConformingPieces">Quantidade de Peças Não Conformes</Label>
                <Input
                  id="nonConformingPieces"
                  type="number"
                  placeholder="Digite a quantidade não conforme"
                  value={formData.nonConformingPieces || ""}
                  onChange={(e) => handleChange("nonConformingPieces", Number(e.target.value))}
                />
              </div>

              {/* % de Qualidade */}
              <div className="grid gap-2">
                <Label htmlFor="qualityPercentage">% de Qualidade</Label>
                <Input
                  id="qualityPercentage"
                  type="number"
                  step="0.01"
                  readOnly
                  value={formData.qualityPercentage}
                  className="bg-muted"
                />
              </div>

              {/* Tipo de Não Conformidade */}
              <div className="grid gap-2">
                <Label htmlFor="nonConformanceType">Tipo de Não Conformidade</Label>
                <Select
                  value={formData.nonConformanceType}
                  onValueChange={(value) => handleChange("nonConformanceType", value)}
                >
                  <SelectTrigger id="nonConformanceType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectItems(nonConformanceTypes, "nonConformanceType")}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição do Problema */}
            <div className="grid gap-2">
              <Label htmlFor="problemDescription">Descrição do Problema</Label>
              <Textarea
                id="problemDescription"
                placeholder="Descreva o problema detalhadamente"
                rows={3}
                value={formData.problemDescription}
                onChange={(e) => handleChange("problemDescription", e.target.value)}
              />
            </div>

            {/* Disposição Imediata */}
            <div className="grid gap-2">
              <Label htmlFor="immediateAction">Disposição Imediata</Label>
              <Select
                value={formData.immediateAction}
                onValueChange={(value) => handleChange("immediateAction", value)}
              >
                <SelectTrigger id="immediateAction">
                  <SelectValue placeholder="Selecione a disposição" />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectItems(immediateActions, "immediateAction")}
                </SelectContent>
              </Select>
            </div>

            {/* Plano de Ação */}
            <div className="grid gap-2">
              <Label>Plano de Ação</Label>
              <div className="border rounded-md p-3">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 font-medium text-sm mb-2">
                  <div>Ação</div>
                  <div>Prazo</div>
                  <div>Responsável</div>
                  <div></div>
                </div>
                {formData.actions.map((action, index) => (
                  <div key={index} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 mb-2">
                    <Input
                      placeholder="Descreva a ação"
                      value={action.action}
                      onChange={(e) => handleActionChange(index, "action", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={action.deadline}
                      onChange={(e) => handleActionChange(index, "deadline", e.target.value)}
                      className="w-32"
                    />
                    <Select
                      value={action.responsible}
                      onValueChange={(value) => handleActionChange(index, "responsible", value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeActionRow(index)}
                      disabled={formData.actions.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addActionRow}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar ação
                </Button>
              </div>
            </div>

            {/* Verificação da Eficácia */}
            <div className="grid gap-2">
              <Label htmlFor="effectivenessVerification">Verificação da Eficácia</Label>
              <Textarea
                id="effectivenessVerification"
                placeholder="Descreva a verificação da eficácia"
                rows={2}
                value={formData.effectivenessVerification}
                onChange={(e) => handleChange("effectivenessVerification", e.target.value)}
              />
            </div>

            {/* Status de Aprovação */}
            <div className="grid gap-2">
              <Label>Status de Aprovação</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="approved"
                    value="approved"
                    checked={formData.approvalStatus === "approved"}
                    onChange={() => handleChange("approvalStatus", "approved")}
                    className="h-4 w-4 rounded-full border-2 border-primary text-primary"
                  />
                  <Label htmlFor="approved" className="cursor-pointer">
                    Aprovado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="rejected"
                    value="rejected"
                    checked={formData.approvalStatus === "rejected"}
                    onChange={() => handleChange("approvalStatus", "rejected")}
                    className="h-4 w-4 rounded-full border-2 border-primary text-primary"
                  />
                  <Label htmlFor="rejected" className="cursor-pointer">
                    Reprovado
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add dialog */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem.item ? "Editar" : "Adicionar"} {getEditTypeLabel(editingItem.type)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editValue">Nome</Label>
              <Input
                id="editValue"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Digite o nome ${getEditTypeLabel(editingItem.type)}`}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to get label for edit type
function getEditTypeLabel(type: string) {
  switch (type) {
    case "emitter":
      return "do Emitente";
    case "customer":
      return "do Cliente";
    case "department":
      return "do Setor";
    case "person":
      return "do Responsável";
    case "product":
      return "do Produto";
    case "nonConformanceType":
      return "do Tipo de Não Conformidade";
    case "immediateAction":
      return "da Disposição Imediata";
    default:
      return "";
  }
}

export default NonConformingProductForm;
