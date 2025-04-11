
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/custom-badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { useAuth } from "@/hooks/useAuth";

interface Company {
  id: string;
  name: string;
  slug: string;
  cnpj?: string;
  plan: string;
  active: boolean;
  created_at: string;
  user_count?: number;
}

export default function CompanyManagement() {
  const { isSuperAdmin } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    cnpj: "",
    plan: "free"
  });
  
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("You don't have permission to access this page");
      return;
    }
    
    fetchCompanies();
  }, [isSuperAdmin]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      const filtered = companies.filter(
        company => company.name.toLowerCase().includes(normalizedQuery) ||
                  company.slug.toLowerCase().includes(normalizedQuery) ||
                  (company.cnpj && company.cnpj.includes(normalizedQuery))
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);
  
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');
        
      if (companiesError) throw companiesError;
      
      // Fetch user counts per company - Using correct method for PostgresJS
      const { data: userCounts, error: userCountsError } = await supabase
        .from('user_profiles')
        .select('company_id, count(*)')
        .groupBy('company_id');
        
      if (userCountsError) throw userCountsError;
      
      // Combine the data
      const companiesWithCounts = companiesData.map(company => {
        const userCount = userCounts.find(uc => uc.company_id === company.id);
        return {
          ...company,
          user_count: userCount ? parseInt(userCount.count) : 0
        };
      });
      
      setCompanies(companiesWithCounts);
      setFilteredCompanies(companiesWithCounts);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCompany = async () => {
    try {
      // Generate slug if not provided
      let slug = formData.slug;
      if (!slug) {
        slug = formData.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');
      }
      
      const { data, error } = await supabase
        .from('companies')
        .insert([
          { 
            name: formData.name,
            slug,
            cnpj: formData.cnpj,
            plan: formData.plan,
            active: true,
            active_modules: ['core']
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Company added successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", slug: "", cnpj: "", plan: "free" });
      fetchCompanies();
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
    }
  };
  
  const handleEditCompany = async () => {
    if (!selectedCompany) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({ 
          name: formData.name,
          slug: formData.slug,
          cnpj: formData.cnpj,
          plan: formData.plan 
        })
        .eq('id', selectedCompany.id);
        
      if (error) throw error;
      
      toast.success("Company updated successfully");
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    }
  };
  
  const handleToggleActive = async (company: Company) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ active: !company.active })
        .eq('id', company.id);
        
      if (error) throw error;
      
      toast.success(`Company ${company.active ? 'deactivated' : 'activated'} successfully`);
      fetchCompanies();
    } catch (error) {
      console.error("Error toggling company status:", error);
      toast.error("Failed to update company status");
    }
  };
  
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>
      
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
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
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(company)}>
                            Edit
                          </Button>
                          <Button 
                            variant={company.active ? "destructive" : "outline"} 
                            size="sm"
                            onClick={() => handleToggleActive(company)}
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
      
      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company in the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-slug">Slug (URL identifier)</Label>
              <Input
                id="company-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="company-slug (or leave empty to auto-generate)"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from the company name
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-cnpj">CNPJ (optional)</Label>
              <Input
                id="company-cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="Enter CNPJ if available"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-plan">Subscription Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} (${plan.price}/month)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompany} disabled={!formData.name}>
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">Company Name</Label>
              <Input
                id="edit-company-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-company-slug">Slug</Label>
              <Input
                id="edit-company-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-company-cnpj">CNPJ</Label>
              <Input
                id="edit-company-cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-company-plan">Subscription Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} (${plan.price}/month)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCompany}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
