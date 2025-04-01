
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Room } from "@/services/roomService";

export interface RoomFormValues extends Omit<Room, 'id'> {}

export function useRoomForm(room?: Room, onSubmit?: (data: Omit<Room, 'id'>) => void) {
  const [amenities, setAmenities] = useState<string[]>(room?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const form = useForm<RoomFormValues>({
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
    if (onSubmit) {
      onSubmit({
        ...data,
        amenities
      });
    }
  });

  return {
    form,
    amenities,
    newAmenity,
    setNewAmenity,
    handleAddAmenity,
    handleKeyPress,
    handleRemoveAmenity,
    handleSubmit
  };
}
