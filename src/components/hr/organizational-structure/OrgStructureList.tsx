
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useOrgStructure } from "./OrgStructureProvider";

export function OrgStructureList() {
  const { positions, loading } = useOrgStructure();
  
  if (loading) {
    return <div className="h-96 flex items-center justify-center">Carregando lista de cargos...</div>;
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Responsável pelo Departamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="font-medium">{position.title}</TableCell>
              <TableCell>{position.department}</TableCell>
              <TableCell>
                <Badge variant="outline">{position.level}</Badge>
              </TableCell>
              <TableCell>
                {position.isDepartmentHead ? (
                  <Badge className="bg-green-100 text-green-800 border border-green-300">Sim</Badge>
                ) : (
                  <span className="text-muted-foreground">Não</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
