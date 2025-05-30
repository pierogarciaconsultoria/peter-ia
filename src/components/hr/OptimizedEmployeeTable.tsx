
import React, { memo, useMemo, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { useOptimizedEmployees } from '@/hooks/useOptimizedEmployees';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { debounce } from '@/utils/performanceUtils';

const EmployeeRow = memo(({ employee, onEdit }: {
  employee: any;
  onEdit: (employee: any) => void;
}) => (
  <TableRow>
    <TableCell className="font-medium">{employee.name}</TableCell>
    <TableCell>{employee.email}</TableCell>
    <TableCell>{employee.position}</TableCell>
    <TableCell>{employee.department}</TableCell>
    <TableCell>
      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
        {employee.status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    </TableCell>
    <TableCell>
      <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>
        Editar
      </Button>
    </TableCell>
  </TableRow>
));

EmployeeRow.displayName = 'EmployeeRow';

interface OptimizedEmployeeTableProps {
  onEditEmployee?: (employee: any) => void;
}

export const OptimizedEmployeeTable = memo(({ onEditEmployee }: OptimizedEmployeeTableProps) => {
  const { empresaId } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // Debounce da pesquisa para evitar consultas excessivas
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  const { employees, employeesByDepartment, isLoading } = useOptimizedEmployees({
    companyId: empresaId,
    department: selectedDepartment || undefined,
    searchTerm: searchTerm || undefined,
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleEditEmployee = useCallback((employee: any) => {
    onEditEmployee?.(employee);
  }, [onEditEmployee]);

  const departments = useMemo(() => 
    Object.keys(employeesByDepartment).sort(), 
    [employeesByDepartment]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {['Nome', 'Email', 'Cargo', 'Departamento', 'Status', 'Ações'].map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros otimizados */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar funcionários..."
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <select
          className="px-3 py-2 border rounded-md bg-background"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Todos os departamentos</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Tabela otimizada */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                onEdit={handleEditEmployee}
              />
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum funcionário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

OptimizedEmployeeTable.displayName = 'OptimizedEmployeeTable';
