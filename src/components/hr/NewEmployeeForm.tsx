import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { JobPositionSelector } from "./job-position/JobPositionSelector";
import { JobPosition } from "./types";

// Mock departments for the dropdown
const departments = [
  "Recursos Humanos",
  "Tecnologia da Informação",
  "Financeiro",
  "Operações",
  "Logística",
  "Marketing",
  "Comercial",
  "Administrativo",
];

export function NewEmployeeForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    birthDate: null as Date | null,
    hireDate: null as Date | null,
    department: "",
    jobTitle: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
    documentId: "",
    documentType: "RG",
    cpf: "",
    carteiraDigitalLink: "",
    spouse: "",
    dependents: [{ name: "", birthDate: null as Date | null }],
    notes: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{ name: string; file: File | null }>>([
    { name: "RG", file: null },
    { name: "CPF", file: null },
    { name: "Carteira de Trabalho", file: null },
    { name: "Comprovante de Residência", file: null },
    { name: "Certidão de Nascimento/Casamento", file: null },
  ]);
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, documentType: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedDocuments = [...documents];
      updatedDocuments[index].file = file;
      setDocuments(updatedDocuments);
    }
  };

  const handleAddDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, { name: "", birthDate: null }],
    }));
  };

  const handleRemoveDependent = (index: number) => {
    setFormData((prev) => {
      const newDependents = [...prev.dependents];
      newDependents.splice(index, 1);
      return { ...prev, dependents: newDependents };
    });
  };

  const handleDependentChange = (index: number, field: string, value: string | Date | null) => {
    setFormData((prev) => {
      const newDependents = [...prev.dependents];
      newDependents[index] = { ...newDependents[index], [field]: value };
      return { ...prev, dependents: newDependents };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit logic would go here
    console.log("Form data:", formData);
    console.log("Selected job position:", selectedJobPosition);
    console.log("Documents:", documents);
    
    // Show success toast
    toast({
      title: "Funcionário cadastrado",
      description: "As informações foram salvas com sucesso",
    });
  };

  // Function to handle job position selection
  const handleJobPositionSelect = (position: JobPosition | null) => {
    setSelectedJobPosition(position);
    if (position) {
      // Update job title based on selected position
      setFormData(prev => ({
        ...prev,
        jobTitle: position.title
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="job">Dados do Cargo</TabsTrigger>
          <TabsTrigger value="documents">Documentação</TabsTrigger>
          <TabsTrigger value="family">Informações Familiares</TabsTrigger>
          <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-md">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Foto do perfil" className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-gray-400">Sem foto</div>
                  )}
                </div>
                <Label htmlFor="photo" className="cursor-pointer mt-2 flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Upload className="mr-2 h-4 w-4" />
                  Carregar Foto
                </Label>
                <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <p className="text-xs text-muted-foreground">Tamanho máximo: 5MB. Formatos: JPG, PNG</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Nome*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formData.birthDate && "text-muted-foreground"
                      )}
                    >
                      {formData.birthDate ? (
                        format(formData.birthDate, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate || undefined}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, birthDate: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF*</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RG">RG</SelectItem>
                    <SelectItem value="CNH">CNH</SelectItem>
                    <SelectItem value="Passaporte">Passaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentId">Número do Documento</Label>
                <Input
                  id="documentId"
                  name="documentId"
                  value={formData.documentId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Data de Admissão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formData.hireDate && "text-muted-foreground"
                      )}
                    >
                      {formData.hireDate ? (
                        format(formData.hireDate, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.hireDate || undefined}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, hireDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descrição do Cargo</Label>
                <JobPositionSelector 
                  onSelect={handleJobPositionSelect} 
                  selectedPosition={selectedJobPosition}
                />
                {selectedJobPosition && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Cargo selecionado: {selectedJobPosition.title}<br />
                    Departamento: {selectedJobPosition.department}<br />
                    Código: {selectedJobPosition.code || "N/A"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Cargo</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  readOnly={!!selectedJobPosition}
                />
                {selectedJobPosition && (
                  <p className="text-xs text-muted-foreground">
                    Este campo foi preenchido automaticamente com base na descrição de cargo selecionada.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salário (R$)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                />
              </div>

              {selectedJobPosition?.description && (
                <div className="space-y-2 mt-4">
                  <Label>Descrição e Requisitos do Cargo</Label>
                  <div className="p-4 border rounded-md bg-muted/50 max-h-40 overflow-y-auto">
                    <p className="text-sm">{selectedJobPosition.description}</p>
                    {selectedJobPosition.requirements && (
                      <>
                        <h4 className="font-medium mt-2 mb-1 text-sm">Requisitos:</h4>
                        <p className="text-sm">{selectedJobPosition.requirements}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carteiraDigitalLink">Link da Carteira de Trabalho Digital</Label>
              <Input
                id="carteiraDigitalLink"
                name="carteiraDigitalLink"
                value={formData.carteiraDigitalLink}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Cole o link para a carteira de trabalho digital do colaborador
              </p>
            </div>

            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium">Anexos de Documentos</h3>
              <p className="text-sm text-muted-foreground">
                Faça o upload dos documentos necessários para o cadastro do funcionário
              </p>

              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.file ? doc.file.name : "Nenhum arquivo selecionado"}
                    </p>
                  </div>
                  <Label
                    htmlFor={`doc-${index}`}
                    className="cursor-pointer flex items-center bg-primary text-primary-foreground px-3 py-1 text-sm rounded-md"
                  >
                    <Upload className="mr-2 h-3 w-3" />
                    {doc.file ? "Trocar" : "Anexar"}
                  </Label>
                  <Input
                    id={`doc-${index}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload(index, e)}
                  />
                </div>
              ))}

              <p className="text-xs text-muted-foreground mt-2">
                Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB por arquivo.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spouse">Cônjuge</Label>
              <Input
                id="spouse"
                name="spouse"
                value={formData.spouse}
                onChange={handleInputChange}
                placeholder="Nome do cônjuge (se houver)"
              />
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Dependentes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDependent}
                >
                  Adicionar Dependente
                </Button>
              </div>

              {formData.dependents.map((dependent, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0"
                >
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`dependent-name-${index}`}>
                      Nome do Dependente
                    </Label>
                    <Input
                      id={`dependent-name-${index}`}
                      value={dependent.name}
                      onChange={(e) =>
                        handleDependentChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !dependent.birthDate && "text-muted-foreground"
                          )}
                        >
                          {dependent.birthDate ? (
                            format(dependent.birthDate, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dependent.birthDate || undefined}
                          onSelect={(date) =>
                            handleDependentChange(index, "birthDate", date)
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDependent(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Informações adicionais sobre o funcionário"
              className="min-h-[150px]"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Funcionário
        </Button>
      </div>
    </form>
  );
}
