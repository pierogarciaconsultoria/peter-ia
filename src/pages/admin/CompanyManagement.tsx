
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Company } from "@/types/company";
import { useCompanyData } from "@/hooks/company/useCompanyData";
import { CompanyList } from "./company/CompanyList";
import { CompanyDialog } from "./company/CompanyDialog";

export default function CompanyManagement() {
  const { isSuperAdmin } = useAuth();
  const { 
    companies, 
    loading, 
    searchQuery, 
    setSearchQuery,
    addCompany,
    updateCompany,
    toggleCompanyStatus
  } = useCompanyData();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    cnpj: "",
    plan: "free"
  });
  
  // Check permissions
  if (!isSuperAdmin) {
    toast.error("You don't have permission to access this page");
  }
  
  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      slug: company.slug,
      cnpj: company.cnpj || "",
      plan: company.plan
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddCompany = async () => {
    const success = await addCompany(formData);
    if (success) {
      setIsAddDialogOpen(false);
      setFormData({ name: "", slug: "", cnpj: "", plan: "free" });
    }
  };
  
  const handleEditCompany = async () => {
    if (!selectedCompany) return;
    
    const success = await updateCompany(selectedCompany.id, formData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>
      
      <CompanyList
        companies={companies}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEditCompany={openEditDialog}
        onToggleActive={toggleCompanyStatus}
      />
      
      {/* Add Company Dialog */}
      <CompanyDialog
        mode="add"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleAddCompany}
      />
      
      {/* Edit Company Dialog */}
      <CompanyDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleEditCompany}
      />
    </div>
  );
}
