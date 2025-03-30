
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PersonalInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
  photoPreview: string | null;
  setPhotoPreview: (preview: string | null) => void;
}

export function PersonalInfoTab({ 
  formData, 
  setFormData, 
  photoPreview,
  setPhotoPreview
}: PersonalInfoTabProps) {
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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

  return (
    <div className="space-y-4">
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
                    setFormData((prev: any) => ({ ...prev, birthDate: date }))
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
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="RG">RG</option>
              <option value="CNH">CNH</option>
              <option value="Passaporte">Passaporte</option>
            </select>
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
    </div>
  );
}
