
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EmployeeData {
  name: string;
  email: string;
  position: string;
  department: string;
  hire_date: string;
  phone?: string;
  status?: string;
}

export function BatchEmployeeImport() {
  const { toast } = useToast();
  const { userCompany } = useAuth();
  const [importing, setImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    
    try {
      const text = await file.text();
      const rows = text.split("\n");
      const headers = rows[0].split(",").map(header => header.trim());
      
      const employees: EmployeeData[] = rows
        .slice(1) // Skip header row
        .filter(row => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(",").map(value => value.trim());
          const employee: any = {};
          
          headers.forEach((header, index) => {
            employee[header.toLowerCase()] = values[index];
          });
          
          return employee;
        });

      // Validate required fields
      const invalidEmployees = employees.filter(
        emp => !emp.name || !emp.email || !emp.position || !emp.department || !emp.hire_date
      );

      if (invalidEmployees.length > 0) {
        toast({
          title: "Dados inválidos",
          description: "Verifique se todos os campos obrigatórios estão preenchidos",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("employees").insert(
        employees.map(emp => ({
          ...emp,
          company_id: userCompany?.id,
          status: emp.status || "active",
        }))
      );

      if (error) throw error;

      toast({
        title: "Importação concluída",
        description: `${employees.length} colaboradores importados com sucesso`,
      });

      // Reset file input
      event.target.value = "";
      
    } catch (error) {
      console.error("Error importing employees:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os colaboradores",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="batch-import"
        disabled={importing}
      />
      <label htmlFor="batch-import">
        <Button
          variant="outline"
          asChild
          className="cursor-pointer"
          disabled={importing}
        >
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {importing ? "Importando..." : "Importar CSV"}
          </span>
        </Button>
      </label>
    </div>
  );
}
