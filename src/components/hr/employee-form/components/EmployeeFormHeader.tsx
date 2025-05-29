
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EmployeeFormHeader() {
  return (
    <TabsList className="grid grid-cols-5 w-full">
      <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
      <TabsTrigger value="documents">Documentos</TabsTrigger>
      <TabsTrigger value="job">Dados Profissionais</TabsTrigger>
      <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
      <TabsTrigger value="family">Dados Familiares</TabsTrigger>
    </TabsList>
  );
}
