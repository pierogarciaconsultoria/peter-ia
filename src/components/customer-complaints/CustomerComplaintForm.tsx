
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ImagePlus, X, Upload, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { createCustomerComplaint } from "@/services/customerComplaintService";
import { generateRandomCode } from "@/utils/codeGenerator";

// Define the form schema with Zod
const formSchema = z.object({
  customer_name: z.string().min(2, { message: "Nome do cliente é obrigatório" }),
  contact_email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  contact_phone: z.string().min(10, { message: "Telefone inválido" }).optional().or(z.literal("")),
  complaint_date: z.string(),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assigned_to: z.string().optional(),
  invoice_number: z.string().optional().or(z.literal("")),
  product: z.string().optional().or(z.literal("")),
  return_deadline: z.string().optional().or(z.literal("")),
  identification_code: z.string(),
  treatment_option: z.enum(["return", "credit", "warranty", "other"]),
  action_schedule_id: z.string().optional().or(z.literal(""))
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerComplaintFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CustomerComplaintForm({ onSuccess, onCancel }: CustomerComplaintFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      contact_email: "",
      contact_phone: "",
      complaint_date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      priority: "medium",
      assigned_to: "",
      invoice_number: "",
      product: "",
      return_deadline: format(new Date(), "yyyy-MM-dd"),
      identification_code: generateRandomCode("RC"),
      treatment_option: "return",
      action_schedule_id: ""
    },
  });

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      if (photos.length + newFiles.length > 3) {
        toast.error("Máximo de 3 fotos permitidas");
        return;
      }
      
      setPhotos([...photos, ...newFiles]);
      
      // Create URLs for preview
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoUrls([...photoUrls, ...newUrls]);
    }
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoUrls[index]); // Clean up the URL
    
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
    
    const updatedUrls = [...photoUrls];
    updatedUrls.splice(index, 1);
    setPhotoUrls(updatedUrls);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // For now, we're not handling photo upload to Supabase storage
      // We'll just submit the form data
      await createCustomerComplaint({
        customer_name: values.customer_name,
        contact_email: values.contact_email || "",
        contact_phone: values.contact_phone || "",
        complaint_date: values.complaint_date,
        description: values.description,
        priority: values.priority,
        assigned_to: values.assigned_to || "",
        invoice_number: values.invoice_number || "",
        product: values.product || "",
        return_deadline: values.return_deadline || "",
        identification_code: values.identification_code,
        treatment_option: values.treatment_option,
        action_schedule_id: values.action_schedule_id || "",
        status: "open",
        resolution: ""
      });
      
      toast.success("Reclamação criada com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Error creating complaint:", error);
      toast.error("Erro ao criar reclamação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="identification_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Identificação</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormDescription>
                  Código único para identificar esta reclamação
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complaint_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Reclamação</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="treatment_option"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Opção de Tratativa</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="return" />
                        </FormControl>
                        <FormLabel className="font-normal">Devolução</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit" />
                        </FormControl>
                        <FormLabel className="font-normal">Crédito</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="warranty" />
                        </FormControl>
                        <FormLabel className="font-normal">Garantia</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Outro</FormLabel>
                      </FormItem>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Email do Cliente" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de Contato</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da NF</FormLabel>
                <FormControl>
                  <Input placeholder="Número da Nota Fiscal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Reclamação</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva a reclamação do cliente..." 
                  className="h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável" {...field} />
                </FormControl>
                <FormDescription>
                  Responsável pelo tratamento da reclamação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="return_deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo de Retorno</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <h3 className="font-medium mb-2 flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Cronograma de Ação
          </h3>
          <div className="flex items-center gap-2">
            <Link 
              to="/action-schedule"
              className="text-primary flex items-center hover:underline"
              target="_blank"
            >
              Criar nova ação
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <FormField
            control={form.control}
            name="action_schedule_id"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>ID da Ação</FormLabel>
                <FormControl>
                  <Input placeholder="Código da ação relacionada" {...field} />
                </FormControl>
                <FormDescription>
                  Associe esta reclamação a uma ação existente no cronograma
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel className="block mb-2">Fotos</FormLabel>
          <div className="flex items-center gap-2 mb-3">
            <label className="cursor-pointer">
              <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md border-gray-300 hover:border-primary">
                <ImagePlus className="w-8 h-8 text-gray-400" />
              </div>
              <Input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload} 
                multiple
                disabled={photos.length >= 3}
              />
            </label>
            
            {photoUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img 
                  src={url} 
                  alt={`Foto ${index + 1}`} 
                  className="object-cover w-full h-full rounded-md"
                />
                <button 
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Máximo de 3 fotos. As fotos ajudam a analisar melhor a reclamação.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Reclamação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
