
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateSelectorProps {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  currentYear: number;
}

export function DateSelector({ month, setMonth, year, setYear, currentYear }: DateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="month">Mês</Label>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger id="month">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Janeiro</SelectItem>
            <SelectItem value="2">Fevereiro</SelectItem>
            <SelectItem value="3">Março</SelectItem>
            <SelectItem value="4">Abril</SelectItem>
            <SelectItem value="5">Maio</SelectItem>
            <SelectItem value="6">Junho</SelectItem>
            <SelectItem value="7">Julho</SelectItem>
            <SelectItem value="8">Agosto</SelectItem>
            <SelectItem value="9">Setembro</SelectItem>
            <SelectItem value="10">Outubro</SelectItem>
            <SelectItem value="11">Novembro</SelectItem>
            <SelectItem value="12">Dezembro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="year">Ano</Label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger id="year">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
            <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
            <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
