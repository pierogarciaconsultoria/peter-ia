
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Room } from "@/services/roomService";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Room, 'id'>) => void;
  room?: Room;
}

export function RoomForm({ isOpen, onClose, onSubmit, room }: RoomFormProps) {
  const [amenities, setAmenities] = useState<string[]>(room?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const roomTypes = [
    { value: 'meeting', label: 'Sala de Reunião' },
    { value: 'training', label: 'Sala de Treinamento' },
    { value: 'service', label: 'Sala de Atendimento' },
    { value: 'other', label: 'Outro' }
  ];

  const form = useForm<Omit<Room, 'id'>>({
    defaultValues: {
      name: room?.name || '',
      type: room?.type || 'meeting',
      capacity: room?.capacity || 0,
      description: room?.description || '',
      amenities: room?.amenities || [],
      location: room?.location || '',
    }
  });

  useEffect(() => {
    if (room) {
      form.reset({
        name: room.name,
        type: room.type,
        capacity: room.capacity,
        description: room.description,
        amenities: room.amenities,
        location: room.location,
      });
      setAmenities(room.amenities);
    } else {
      form.reset({
        name: '',
        type: 'meeting',
        capacity: 0,
        description: '',
        amenities: [],
        location: '',
      });
      setAmenities([]);
    }
  }, [room, form]);

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      const updatedAmenities = [...amenities, newAmenity.trim()];
      setAmenities(updatedAmenities);
      form.setValue('amenities', updatedAmenities);
      setNewAmenity('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
    }
  };

  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(updatedAmenities);
    form.setValue('amenities', updatedAmenities);
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      amenities
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {room ? 'Editar Ambiente' : 'Novo Ambiente'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do ambiente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="type"
                rules={{ required: 'Tipo é obrigatório' }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                rules={{ 
                  required: 'Capacidade é obrigatória',
                  min: { value: 1, message: 'Mínimo de 1 pessoa' }
                }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Capacidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        placeholder="Capacidade" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o ambiente" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1º andar, Bloco B" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Recursos</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ex: Projetor, Wi-Fi"
                  />
                </FormControl>
                <Button type="button" onClick={handleAddAmenity}>
                  Adicionar
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {amenity}
                    <button 
                      type="button" 
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveAmenity(index)}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </FormItem>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {room ? 'Atualizar' : 'Criar'} Ambiente
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
