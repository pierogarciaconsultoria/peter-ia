
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneralInfoSectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  plannedDate: Date | undefined;
  setPlannedDate: (date: Date | undefined) => void;
  status: "planned" | "in-progress" | "completed";
  setStatus: (status: "planned" | "in-progress" | "completed") => void;
  subject: string;
  setSubject: (subject: string) => void;
  participants: string;
  setParticipants: (participants: string) => void;
  documents: string;
  setDocuments: (documents: string) => void;
}

export function GeneralInfoSection({
  date,
  setDate,
  plannedDate,
  setPlannedDate,
  status,
  setStatus,
  subject,
  setSubject,
  participants,
  setParticipants,
  documents,
  setDocuments
}: GeneralInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Data
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="plannedDate" className="text-right">
          Data Planejada
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !plannedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {plannedDate ? format(plannedDate, "PPP", { locale: ptBR }) : <span>Selecione a data planejada (opcional)</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={plannedDate}
                onSelect={setPlannedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select value={status} onValueChange={(value: "planned" | "in-progress" | "completed") => setStatus(value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o status da análise" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="planned">Planejada</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subject" className="text-right">
          Assunto
        </Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="participants" className="text-right">
          Participantes
        </Label>
        <Input
          id="participants"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="col-span-3"
          placeholder="Separe por vírgulas"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="documents" className="text-right">
          Documentos
        </Label>
        <Input
          id="documents"
          value={documents}
          onChange={(e) => setDocuments(e.target.value)}
          className="col-span-3"
          placeholder="Separe por vírgulas"
        />
      </div>
    </>
  );
}
