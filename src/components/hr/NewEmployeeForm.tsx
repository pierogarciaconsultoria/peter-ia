
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { JobPositionSelector } from "./job-position/JobPositionSelector";
import { JobPosition } from "./types";

interface Dependent {
  id: string;
  name: string;
  birthDate: Date | undefined;
  relationship: string;
}

interface Document {
  id: string;
  type: string;
  number: string;
  file: File | null;
}

export function NewEmployeeForm() {
  // Personal data state
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState<string>("");
  const [motherName, setMotherName] = useState("");
  const [nationality, setNationality] = useState("Brasileira");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [housingType, setHousingType] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Job position data
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");

  // Dependents state
  const [dependents, setDependents] = useState<Dependent[]>([]);

  // Documents state
  const [documents, setDocuments] = useState<Document[]>([
    { id: crypto.randomUUID(), type: "CTPS", number: "", file: null },
    { id: crypto.randomUUID(), type: "PIS/PASEP", number: "", file: null },
    { id: crypto.randomUUID(), type: "RG", number: "", file: null },
    { id: crypto.randomUUID(), type: "Comprovante de Residência", number: "", file: null },
    { id: crypto.randomUUID(), type: "Título de Eleitor", number: "", file: null },
    { id: crypto.randomUUID(), type: "Comprovante de Escolaridade", number: "", file: null },
    { id: crypto.randomUUID(), type: "Certidão", number: "", file: null },
    { id: crypto.randomUUID(), type: "Certificado Militar", number: "", file: null },
    { id: crypto.randomUUID(), type: "ASO", number: "", file: null },
    { id: crypto.randomUUID(), type: "CNH", number: "", file: null },
  ]);
  const [digitalCardLink, setDigitalCardLink] = useState("");

  const handleAddDependent = () => {
    const newDependent: Dependent = {
      id: crypto.randomUUID(),
      name: "",
      birthDate: undefined,
      relationship: "Filho(a)",
    };
    setDependents([...dependents, newDependent]);
  };

  const handleRemoveDependent = (id: string) => {
    setDependents(dependents.filter(dep => dep.id !== id));
  };

  const handleDependentChange = (id: string, field: keyof Dependent, value: any) => {
    setDependents(
      dependents.map(dep => 
        dep.id === id ? { ...dep, [field]: value } : dep
      )
    );
  };

  const handleDocumentChange = (id: string, field: keyof Document, value: any) => {
    setDocuments(
      documents.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (docId) {
      // Document file upload
      handleDocumentChange(docId, "file", file);
    } else {
      // Employee photo upload
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJobPositionSelection = (position: JobPosition | null) => {
    setSelectedJobPosition(position);
    if (position) {
      setJobTitle(position.title);
      setDepartment(position.department || "");
    }
  };

  return (
    <form className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="job">Dados Profissionais</TabsTrigger>
          <TabsTrigger value="documents">Documentação</TabsTrigger>
        </TabsList>

        {/* Personal Data Tab */}
        <TabsContent value="personal" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo*</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Nome completo" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF*</Label>
                  <Input 
                    id="cpf" 
                    value={cpf} 
                    onChange={(e) => setCpf(e.target.value)} 
                    placeholder="000.000.000-00" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Nascimento*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? (
                          format(birthDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Sexo*</Label>
                  <RadioGroup value={gender} onValueChange={setGender}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="genderM" />
                      <Label htmlFor="genderM">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="genderF" />
                      <Label htmlFor="genderF">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName">Nome da Mãe*</Label>
                <Input 
                  id="motherName" 
                  value={motherName} 
                  onChange={(e) => setMotherName(e.target.value)} 
                  placeholder="Nome completo da mãe" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidade*</Label>
                  <Input 
                    id="nationality" 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)} 
                    placeholder="Nacionalidade" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Estado Civil*</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Solteiro(a)</SelectItem>
                      <SelectItem value="married">Casado(a)</SelectItem>
                      <SelectItem value="divorced">Divorciado(a)</SelectItem>
                      <SelectItem value="widower">Viúvo(a)</SelectItem>
                      <SelectItem value="separated">Separado(a)</SelectItem>
                      <SelectItem value="stable_union">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="housingType">Moradia*</Label>
                  <Select value={housingType} onValueChange={setHousingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">Própria</SelectItem>
                      <SelectItem value="rented">Alugada</SelectItem>
                      <SelectItem value="family">Familiar</SelectItem>
                      <SelectItem value="other">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasChildren">Possui Filhos</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="hasChildren" 
                      checked={hasChildren} 
                      onCheckedChange={setHasChildren} 
                    />
                    <Label htmlFor="hasChildren">{hasChildren ? "Sim" : "Não"}</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone*</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(00) 0000-0000" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    placeholder="(00) 00000-0000" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@exemplo.com.br" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo*</Label>
                <Textarea 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Rua, número, bairro, cidade, estado, CEP" 
                  required
                />
              </div>
              
              {(maritalStatus === "married" || maritalStatus === "stable_union") && (
                <div className="space-y-2">
                  <Label htmlFor="spouseName">Nome do Cônjuge</Label>
                  <Input 
                    id="spouseName" 
                    value={spouseName} 
                    onChange={(e) => setSpouseName(e.target.value)} 
                    placeholder="Nome completo do cônjuge" 
                  />
                </div>
              )}
            </div>
            
            <div className="md:w-1/4 space-y-4">
              <div className="space-y-2">
                <Label>Foto do Colaborador</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img 
                        src={photoPreview} 
                        alt="Prévia da foto" 
                        className="w-40 h-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                      >
                        Remover Foto
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Clique para fazer upload</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Dependents Section */}
          {hasChildren && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Dependentes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDependent}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Dependente
                </Button>
              </div>
              
              {dependents.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  Nenhum dependente cadastrado. Clique no botão acima para adicionar.
                </div>
              ) : (
                <div className="space-y-4">
                  {dependents.map((dependent) => (
                    <div 
                      key={dependent.id} 
                      className="p-4 border border-gray-200 rounded-md space-y-4"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">Dependente</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDependent(dependent.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-name-${dependent.id}`}>Nome Completo*</Label>
                          <Input
                            id={`dependent-name-${dependent.id}`}
                            value={dependent.name}
                            onChange={(e) => handleDependentChange(dependent.id, "name", e.target.value)}
                            placeholder="Nome completo do dependente"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Data de Nascimento*</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !dependent.birthDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dependent.birthDate ? (
                                  format(dependent.birthDate, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={dependent.birthDate}
                                onSelect={(date) => handleDependentChange(dependent.id, "birthDate", date)}
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`dependent-relationship-${dependent.id}`}>Parentesco*</Label>
                        <Select 
                          value={dependent.relationship}
                          onValueChange={(value) => handleDependentChange(dependent.id, "relationship", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Filho(a)">Filho(a)</SelectItem>
                            <SelectItem value="Enteado(a)">Enteado(a)</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Job Data Tab */}
        <TabsContent value="job" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cargo*</Label>
              <JobPositionSelector onSelect={handleJobPositionSelection} selectedPosition={selectedJobPosition} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Título do Cargo*</Label>
                <Input 
                  id="jobTitle" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  placeholder="Cargo do colaborador" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento*</Label>
                <Input 
                  id="department" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  placeholder="Departamento" 
                  required
                />
              </div>
            </div>
            
            {selectedJobPosition && (
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">Detalhes do Cargo Selecionado</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Código:</strong> {selectedJobPosition.code || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Departamento:</strong> {selectedJobPosition.department || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Revisão:</strong> {selectedJobPosition.revision || "N/A"}
                </p>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Descrição:</strong>
                  <div className="mt-1">{selectedJobPosition.description || "Sem descrição disponível."}</div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Documentos Obrigatórios</h3>
            
            <div className="space-y-6">
              {documents.map((doc) => (
                <div key={doc.id} className="border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`doc-type-${doc.id}`}>{doc.type}*</Label>
                      <Input 
                        id={`doc-type-${doc.id}`} 
                        value={doc.number} 
                        onChange={(e) => handleDocumentChange(doc.id, "number", e.target.value)} 
                        placeholder={`Número do ${doc.type}`} 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`doc-file-${doc.id}`}>Anexo</Label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                            <Upload className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {doc.file ? doc.file.name : "Selecionar arquivo"}
                            </span>
                          </div>
                          <input
                            id={`doc-file-${doc.id}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, doc.id)}
                          />
                        </label>
                        {doc.file && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDocumentChange(doc.id, "file", null)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="digitalCardLink">Link da Carteira Digital</Label>
              <Input 
                id="digitalCardLink" 
                value={digitalCardLink} 
                onChange={(e) => setDigitalCardLink(e.target.value)} 
                placeholder="https://..." 
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL da carteira de trabalho digital do colaborador.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit">Cadastrar Colaborador</Button>
      </div>
    </form>
  );
}
