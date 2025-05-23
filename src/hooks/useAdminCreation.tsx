
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCreation = () => {
  // Create the default admin user on component mount
  useEffect(() => {
    const createDefaultAdmin = async () => {
      try {
        // Admin credentials
        const adminEmail = "contato@pierogarcia.com.br";
        const adminPassword = "pi391500B@";
        
        // First check if admin account exists
        const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (fetchError) {
          console.error("Error checking admin users:", fetchError);
          return;
        }
        
        // Find the admin user by email
        // Explicitly type the user to avoid 'never' type issues
        const adminUser = users?.find((user: any) => user.email === adminEmail);
        
        if (adminUser) {
          console.log("Admin account exists");
          
          // If admin exists but isn't confirmed, try to confirm it
          if (!adminUser.email_confirmed_at) {
            const { error: confirmError } = await supabase.auth.admin.updateUserById(
              adminUser.id,
              { email_confirm: true }
            );
            
            if (confirmError) {
              console.error("Error confirming admin email:", confirmError);
            } else {
              console.log("Admin email confirmed successfully");
            }
          }
          
          return;
        }
        
        // If admin doesn't exist, create it with the specified password
        console.log("Admin account not found, creating...");
        
        const { data, error: signUpError } = await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            first_name: "Admin",
            last_name: "Master",
            is_super_admin: true,
            is_company_admin: true
          }
        });

        if (signUpError) {
          console.error("Error creating admin:", signUpError);
        } else {
          console.log("Admin user creation initiated:", data);
          toast.success("Conta de administrador criada com as credenciais definidas.");
        }
      } catch (error: any) {
        console.error("Error in admin user creation:", error);
      }
    };

    createDefaultAdmin();
  }, []);
};
