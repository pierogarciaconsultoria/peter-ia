
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RoomHeaderProps {
  onAddRoom: () => void;
}

export function RoomHeader({ onAddRoom }: RoomHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ambientes</h1>
        <p className="text-muted-foreground">
          Gerencie salas de reuniões, treinamentos e atendimentos
        </p>
      </div>
      
      <Button onClick={onAddRoom}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Ambiente
      </Button>
    </div>
  );
}
