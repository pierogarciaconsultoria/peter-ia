
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AmenitiesFieldProps {
  amenities: string[];
  newAmenity: string;
  setNewAmenity: (value: string) => void;
  handleAddAmenity: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleRemoveAmenity: (index: number) => void;
}

export function AmenitiesField({
  amenities,
  newAmenity,
  setNewAmenity,
  handleAddAmenity,
  handleKeyPress,
  handleRemoveAmenity
}: AmenitiesFieldProps) {
  return (
    <FormItem>
      <FormLabel>Recursos</FormLabel>
      <div className="flex gap-2">
        <Input
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ex: Projetor, Wi-Fi"
        />
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
  );
}
