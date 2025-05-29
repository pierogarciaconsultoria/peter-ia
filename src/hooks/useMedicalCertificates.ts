
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MedicalCertificate {
  id: string;
  employee_id: string;
  company_id: string;
  type: 'sickness' | 'appointment' | 'surgery' | 'other';
  start_date: string;
  end_date: string;
  days: number;
  doctor: string;
  cid?: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  document_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Join with employee data
  employee?: {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    avatar_url?: string;
  };
}

type MedicalCertificateInsert = Omit<MedicalCertificate, 'id' | 'created_at' | 'updated_at' | 'days' | 'employee'>;
type MedicalCertificateUpdate = Partial<Omit<MedicalCertificate, 'id' | 'created_at' | 'updated_at' | 'employee'>>;

export const useMedicalCertificates = () => {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCompany, isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('medical_certificates')
          .select(`
            *,
            employee:employees!inner(
              id,
              name,
              email,
              department,
              position,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (userCompany && !isSuperAdmin) {
          query = query.eq('company_id', userCompany.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching medical certificates:", error);
          setError(error.message || "Failed to load medical certificates");
          toast.error("Erro ao carregar atestados médicos");
        } else {
          // Transform the data to ensure type compatibility
          const transformedData: MedicalCertificate[] = (data || []).map((row: any) => ({
            ...row,
            type: (['sickness', 'appointment', 'surgery', 'other'].includes(row.type) ? row.type : 'other') as MedicalCertificate['type'],
            status: (['pending', 'approved', 'rejected'].includes(row.status) ? row.status : 'pending') as MedicalCertificate['status']
          }));
          setCertificates(transformedData);
        }
      } catch (error: any) {
        console.error("Unexpected error fetching medical certificates:", error);
        setError(error.message || "An unexpected error occurred");
        toast.error("Erro inesperado ao carregar atestados médicos");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userCompany, isSuperAdmin]);

  const addCertificate = async (newCertificate: MedicalCertificateInsert) => {
    setLoading(true);
    setError(null);

    try {
      const certificateData = {
        ...newCertificate,
        company_id: userCompany?.id || '',
      };

      const { data, error } = await supabase
        .from('medical_certificates')
        .insert([certificateData])
        .select(`
          *,
          employee:employees!inner(
            id,
            name,
            email,
            department,
            position,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error("Error adding medical certificate:", error);
        setError(error.message || "Failed to add medical certificate");
        toast.error("Erro ao adicionar atestado médico");
      } else {
        // Transform the data to ensure type compatibility
        const transformedData: MedicalCertificate = {
          ...data,
          type: (['sickness', 'appointment', 'surgery', 'other'].includes(data.type) ? data.type : 'other') as MedicalCertificate['type'],
          status: (['pending', 'approved', 'rejected'].includes(data.status) ? data.status : 'pending') as MedicalCertificate['status']
        };
        setCertificates(prevCertificates => [transformedData, ...prevCertificates]);
        toast.success("Atestado médico adicionado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error adding medical certificate:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao adicionar atestado médico");
    } finally {
      setLoading(false);
    }
  };

  const updateCertificate = async (certificateId: string, updates: MedicalCertificateUpdate) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('medical_certificates')
        .update(updates)
        .eq('id', certificateId)
        .select(`
          *,
          employee:employees!inner(
            id,
            name,
            email,
            department,
            position,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error("Error updating medical certificate:", error);
        setError(error.message || "Failed to update medical certificate");
        toast.error("Erro ao atualizar atestado médico");
      } else {
        // Transform the data to ensure type compatibility
        const transformedData: MedicalCertificate = {
          ...data,
          type: (['sickness', 'appointment', 'surgery', 'other'].includes(data.type) ? data.type : 'other') as MedicalCertificate['type'],
          status: (['pending', 'approved', 'rejected'].includes(data.status) ? data.status : 'pending') as MedicalCertificate['status']
        };
        setCertificates(prevCertificates =>
          prevCertificates.map(certificate => (certificate.id === certificateId ? transformedData : certificate))
        );
        toast.success("Atestado médico atualizado com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error updating medical certificate:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao atualizar atestado médico");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (certificateId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('medical_certificates')
        .delete()
        .eq('id', certificateId);

      if (error) {
        console.error("Error deleting medical certificate:", error);
        setError(error.message || "Failed to delete medical certificate");
        toast.error("Erro ao excluir atestado médico");
      } else {
        setCertificates(prevCertificates =>
          prevCertificates.filter(certificate => certificate.id !== certificateId)
        );
        toast.success("Atestado médico excluído com sucesso");
      }
    } catch (error: any) {
      console.error("Unexpected error deleting medical certificate:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Erro inesperado ao excluir atestado médico");
    } finally {
      setLoading(false);
    }
  };

  // Função helper para formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return {
    certificates,
    loading,
    isLoading: loading, // Alias para compatibilidade
    error,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    formatDate,
  };
};
