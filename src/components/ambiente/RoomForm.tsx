
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Room } from "@/services/roomService";
import { RoomBasicFields } from "./room-form/RoomBasicFields";
import { AmenitiesField } from "./room-form/AmenitiesField";
import { useRoomForm } from "./room-form/useRoomForm";

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Room, 'id'>) => void;
  room?: Room;
}

export function RoomForm({ isOpen, onClose, onSubmit, room }: RoomFormProps) {
  const {
    form,
    amenities,
    newAmenity,
    setNewAmenity,
    handleAddAmenity,
    handleKeyPress,
    handleRemoveAmenity,
    handleSubmit
  } = useRoomForm(room, onSubmit);

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
            <RoomBasicFields form={form} />
            
            <AmenitiesField 
              amenities={amenities}
              newAmenity={newAmenity}
              setNewAmenity={setNewAmenity}
              handleAddAmenity={handleAddAmenity}
              handleKeyPress={handleKeyPress}
              handleRemoveAmenity={handleRemoveAmenity}
            />
            
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
