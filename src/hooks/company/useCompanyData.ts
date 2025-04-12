
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";

export function useCompanyData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
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
      
      // Fetch user counts per company - corrected approach
      const { data: userCounts, error: userCountsError } = await supabase
        .from('user_profiles')
        .select('company_id')
        .not('company_id', 'is', null);
      
      let countsByCompany: Record<string, number> = {};
      
      if (userCounts) {
        userCounts.forEach(profile => {
          if (profile.company_id) {
            countsByCompany[profile.company_id] = (countsByCompany[profile.company_id] || 0) + 1;
          }
        });
      }
      
      if (userCountsError) throw userCountsError;
      
      // Combine the data
      const companiesWithCounts = companiesData.map(company => {
        return {
          ...company,
          user_count: countsByCompany[company.id] || 0
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
  
  const addCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'active' | 'user_count'>) => {
    try {
      // Generate slug if not provided
      let slug = companyData.slug;
      if (!slug) {
        slug = companyData.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');
      }
      
      const { data, error } = await supabase
        .from('companies')
        .insert([
          { 
            name: companyData.name,
            slug,
            cnpj: companyData.cnpj,
            plan: companyData.plan,
            active: true,
            active_modules: ['core']
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Company added successfully");
      await fetchCompanies();
      return true;
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
      return false;
    }
  };
  
  const updateCompany = async (id: string, companyData: Partial<Company>) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ 
          name: companyData.name,
          slug: companyData.slug,
          cnpj: companyData.cnpj,
          plan: companyData.plan 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Company updated successfully");
      await fetchCompanies();
      return true;
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
      return false;
    }
  };
  
  const toggleCompanyStatus = async (company: Company) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ active: !company.active })
        .eq('id', company.id);
        
      if (error) throw error;
      
      toast.success(`Company ${company.active ? 'deactivated' : 'activated'} successfully`);
      await fetchCompanies();
      return true;
    } catch (error) {
      console.error("Error toggling company status:", error);
      toast.error("Failed to update company status");
      return false;
    }
  };
  
  return {
    companies: filteredCompanies,
    loading,
    searchQuery,
    setSearchQuery,
    fetchCompanies,
    addCompany,
    updateCompany,
    toggleCompanyStatus
  };
}
