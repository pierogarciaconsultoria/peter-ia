
import { SelectGroup } from "./SelectGroup";

interface DateSelectorProps {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  currentYear: number;
}

export function DateSelector({ month, setMonth, year, setYear, currentYear }: DateSelectorProps) {
  const monthOptions = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const yearOptions = [
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectGroup
        id="month"
        label="Mês"
        value={month}
        onValueChange={setMonth}
        placeholder="Mês"
        options={monthOptions}
      />
      
      <SelectGroup
        id="year"
        label="Ano"
        value={year}
        onValueChange={setYear}
        placeholder="Ano"
        options={yearOptions}
      />
    </div>
  );
}
