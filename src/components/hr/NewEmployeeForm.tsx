
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon, Check, ChevronsUpDown, User, FileText, Save, Phone, Mail, MapPin, Link, Image, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Define schemas for nested objects
const dependentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória" }),
});

const documentAttachmentSchema = z.object({
  type: z.string(),
  file: z.any().optional(),
  fileName: z.string().optional(),
});

// Main form schema
const formSchema = z.object({
  // Dados pessoais
  fullName: z.string().min(5, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória" }),
  gender: z.string({ required_error: "Sexo é obrigatório" }),
  motherName: z.string().min(5, "Nome da mãe é obrigatório"),
  nationality: z.string().min(1, "Nacionalidade é obrigatória"),
  maritalStatus: z.string({ required_error: "Estado civil é obrigatório" }),
  housingType: z.string({ required_error: "Tipo de moradia é obrigatório" }),
  hasChildren: z.boolean().default(false),
  numberOfChildren: z.number().optional(),
  
  // Novos campos de contato e endereço
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(15, "WhatsApp inválido").optional(),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  
  // Informações familiares
  hasSpouse: z.boolean().default(false),
  spouseName: z.string().optional(),
  dependents: z.array(dependentSchema).optional(),
  
  // Foto do colaborador
  photo: z.any().optional(),
  photoName: z.string().optional(),
  
  // Documentação
  workCard: z.string().min(1, "CTPS é obrigatória"),
  digitalWorkCardLink: z.string().url("Link inválido").optional(),
  pisOrPasep: z.string().min(1, "Número do PIS/PASEP é obrigatório"),
  rg: z.string().min(1, "RG é obrigatório"),
  addressProof: z.boolean().default(false),
  voterCard: z.boolean().default(false),
  educationProof: z.boolean().default(false),
  birthOrMarriageCertificate: z.boolean().default(false),
  militaryService: z.boolean().optional(),
  healthCertificate: z.boolean().default(false),
  driverLicense: z.boolean().optional(),
  driverLicenseCategory: z.string().optional(),
  
  // Anexos de documentos
  documentAttachments: z.array(documentAttachmentSchema).optional(),
});

export function NewEmployeeForm() {
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      motherName: "",
      nationality: "Brasileira",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      hasChildren: false,
      hasSpouse: false,
      spouseName: "",
      dependents: [],
      addressProof: false,
      voterCard: false,
      educationProof: false,
      birthOrMarriageCertificate: false,
      militaryService: false,
      healthCertificate: false,
      driverLicense: false,
      documentAttachments: [],
    },
  });
  
  // Field array for dependents
  const { fields: dependentsFields, append: appendDependent, remove: removeDependent } = useFieldArray({
    control: form.control,
    name: "dependents",
  });
  
  // Field array for document attachments
  const { fields: documentAttachmentsFields, append: appendDocumentAttachment, remove: removeDocumentAttachment } = useFieldArray({
    control: form.control,
    name: "documentAttachments",
  });

  const hasChildren = form.watch("hasChildren");
  const hasSpouse = form.watch("hasSpouse");
  const driverLicense = form.watch("driverLicense");
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue("photo", file);
      form.setValue("photoName", file.name);
    }
  };
  
  const handleDocumentAttachment = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      appendDocumentAttachment({ 
        type: type, 
        file: file, 
        fileName: file.name 
      });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // In a real app, this would send data to an API or directly to Supabase
    toast.success("Colaborador cadastrado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Novo Colaborador</h2>
          <p className="text-muted-foreground">Cadastre um novo colaborador no sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> 
            Formulário de Cadastro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="documents">Documentação</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-6 pt-4">
                  <div className="space-y-6">
                    {/* Foto do Colaborador */}
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
                      <div className="mb-4">
                        <Image className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <FormField
                        control={form.control}
                        name="photo"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem className="w-full">
                            <FormLabel>Foto do Colaborador</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={handlePhotoChange}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {form.watch("photoName") && (
                                <span className="text-sm text-muted-foreground">
                                  Arquivo selecionado: {form.watch("photoName")}
                                </span>
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Dados básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo do colaborador" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF*</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Nascimento*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione a data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexo*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o sexo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="M">Masculino</SelectItem>
                                <SelectItem value="F">Feminino</SelectItem>
                                <SelectItem value="O">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Mãe*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo da mãe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nacionalidade*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nacionalidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado Civil*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o estado civil" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                <SelectItem value="casado">Casado(a)</SelectItem>
                                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                <SelectItem value="uniao_estavel">União Estável</SelectItem>
                                <SelectItem value="separado">Separado(a)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="housingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moradia*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo de moradia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="propria">Própria</SelectItem>
                                <SelectItem value="alugada">Alugada</SelectItem>
                                <SelectItem value="financiada">Financiada</SelectItem>
                                <SelectItem value="cedida">Cedida</SelectItem>
                                <SelectItem value="familiar">Com Familiares</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Novos campos de contato e endereço */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone*</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Se diferente do telefone principal
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail*</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="email@exemplo.com" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço*</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Endereço completo" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Informações familiares */}
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <FormField
                          control={form.control}
                          name="hasSpouse"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Possui cônjuge
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        {hasSpouse && (
                          <FormField
                            control={form.control}
                            name="spouseName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Cônjuge</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome completo do cônjuge" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="hasChildren"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Possui dependentes
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {hasChildren && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="numberOfChildren"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Dependentes</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">Dependentes</h4>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => appendDependent({ name: "", birthDate: new Date() })}
                              >
                                <Plus className="h-4 w-4 mr-1" /> Adicionar
                              </Button>
                            </div>
                            
                            {dependentsFields.map((dependentField, index) => (
                              <div key={dependentField.id} className="p-4 border rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium">Dependente {index + 1}</h5>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeDependent(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`dependents.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nome do Dependente*</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Nome completo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`dependents.${index}.birthDate`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col">
                                        <FormLabel>Data de Nascimento*</FormLabel>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant="outline"
                                                className={cn(
                                                  "w-full pl-3 text-left font-normal",
                                                  !field.value && "text-muted-foreground"
                                                )}
                                              >
                                                {field.value ? (
                                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                                ) : (
                                                  <span>Selecione a data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                              mode="single"
                                              selected={field.value}
                                              onSelect={field.onChange}
                                              disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                              }
                                              initialFocus
                                              locale={ptBR}
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("documents")}
                    >
                      Próximo: Documentação
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carteira de Trabalho (CTPS)*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número da CTPS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="digitalWorkCardLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link da Carteira de Trabalho Digital</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="https://..." {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pisOrPasep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIS/PASEP*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número do PIS/PASEP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RG*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número do RG" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="mb-3 font-medium">Documentos Recebidos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="addressProof"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Comprovante de Residência
                                  </FormLabel>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "addressProof")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="voterCard"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Título de Eleitor
                                  </FormLabel>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "voterCard")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="educationProof"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Comprovante de Escolaridade
                                  </FormLabel>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "educationProof")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="birthOrMarriageCertificate"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Certidão de Nascimento ou Casamento
                                  </FormLabel>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "birthOrMarriageCertificate")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                          
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="militaryService"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Certificado de Alistamento Militar ou Reservista
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Para homens entre 18 e 45 anos
                                  </FormDescription>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "militaryService")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="healthCertificate"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel className="font-normal">
                                    Atestado de Saúde Ocupacional (ASO)
                                  </FormLabel>
                                  <Input 
                                    type="file" 
                                    className="mt-2" 
                                    onChange={(e) => handleDocumentAttachment(e, "healthCertificate")}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="driverLicense"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="flex flex-col w-full">
                                    <FormLabel className="font-normal">
                                      Carteira Nacional de Habilitação (CNH)
                                    </FormLabel>
                                    <Input 
                                      type="file" 
                                      className="mt-2" 
                                      onChange={(e) => handleDocumentAttachment(e, "driverLicense")}
                                    />
                                  </div>
                                </FormItem>
                              )}
                            />

                            {driverLicense && (
                              <FormField
                                control={form.control}
                                name="driverLicenseCategory"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Categoria da CNH</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="AB">AB</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                        <SelectItem value="D">D</SelectItem>
                                        <SelectItem value="E">E</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Lista de documentos anexados */}
                      {documentAttachmentsFields.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Documentos Anexados</h4>
                          <ul className="space-y-1">
                            {documentAttachmentsFields.map((doc, index) => (
                              <li key={doc.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                <span>
                                  {doc.type}: {form.getValues(`documentAttachments.${index}.fileName`)}
                                </span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeDocumentAttachment(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab("personal")}
                    >
                      Voltar: Dados Pessoais
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Colaborador
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Colaborador
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
