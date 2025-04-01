
import { useEffect } from "react";
import { supabase, confirmAdminEmail } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCreation = () => {
  // Create the default admin user on component mount
  useEffect(() => {
    const createDefaultAdmin = async () => {
      try {
        // First try to verify the admin account
        const { success, error } = await confirmAdminEmail("contato@pierogarcia.com.br");
        
        if (success) {
          console.log("Admin account exists and is valid");
          return;
        }
        
        // If verification failed, try to create the admin user
        console.log("Admin verification failed, trying to create user...");
        
        // Try to create the admin user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: "contato@pierogarcia.com.br",
          password: "pi391500B@",
          options: {
            data: {
              first_name: "Admin",
              last_name: "User",
              is_super_admin: true,
              is_company_admin: true
            }
          }
        });

        if (signUpError) {
          console.error("Error creating admin:", signUpError);
          if (signUpError.message.includes("User already registered")) {
            console.log("Admin already exists but may need confirmation");
          }
        } else {
          console.log("Admin user creation initiated:", data);
          toast.info("Conta de administrador criada. Verifique o email para confirmação.");
        }
      } catch (error: any) {
        console.error("Error in admin user creation:", error);
      }
    };

    createDefaultAdmin();
  }, []);
};
