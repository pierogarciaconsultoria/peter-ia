
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Company } from "@/types/company";

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditCompany: (company: Company) => void;
  onToggleActive: (company: Company) => void;
}

export function CompanyList({
  companies,
  loading,
  searchQuery,
  onSearchChange,
  onEditCompany,
  onToggleActive
}: CompanyListProps) {
  const getPlanBadgeColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>
          Manage all companies in the system. You can add, edit, or deactivate companies.
        </CardDescription>
        
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.slug}</TableCell>
                    <TableCell>{company.cnpj || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getPlanBadgeColor(company.plan)}>
                        {company.plan.charAt(0).toUpperCase() + company.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{company.user_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={company.active ? "default" : "destructive"}>
                        {company.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEditCompany(company)}>
                          Edit
                        </Button>
                        <Button 
                          variant={company.active ? "destructive" : "outline"} 
                          size="sm"
                          onClick={() => onToggleActive(company)}
                        >
                          {company.active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No companies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
