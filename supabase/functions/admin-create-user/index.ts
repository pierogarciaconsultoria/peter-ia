import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json(
        { success: false, error: "Supabase environment not configured" },
        500
      );
    }

    const authorization = req.headers.get("Authorization") ?? "";

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: callerProfile, error: callerProfileError } =
      await supabaseAdmin
        .from("user_profiles")
        .select("id, company_id, is_super_admin, is_company_admin, is_active")
        .eq("id", user.id)
        .maybeSingle();

    if (callerProfileError || !callerProfile) {
      return json({ success: false, error: "Forbidden" }, 403);
    }

    if (callerProfile.is_active === false) {
      return json({ success: false, error: "Inactive user" }, 403);
    }

    const body = await req.json();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body?.password ?? "");
    const firstName = String(body?.firstName ?? "").trim();
    const lastName = String(body?.lastName ?? "").trim();
    const requestedCompanyId = body?.companyId ? String(body.companyId) : null;
    const isCompanyAdmin = Boolean(body?.isCompanyAdmin);

    if (!email || !password) {
      return json(
        { success: false, error: "Email e senha são obrigatórios" },
        400
      );
    }

    if (password.length < 8) {
      return json(
        { success: false, error: "A senha deve ter pelo menos 8 caracteres" },
        400
      );
    }

    let companyId: string | null = requestedCompanyId;

    if (callerProfile.is_super_admin) {
      if (!companyId) {
        return json(
          { success: false, error: "companyId é obrigatório" },
          400
        );
      }
    } else {
      if (!callerProfile.is_company_admin) {
        return json({ success: false, error: "Forbidden" }, 403);
      }
      companyId = callerProfile.company_id ?? null;
      if (!companyId) {
        return json(
          { success: false, error: "Usuário sem company_id configurado" },
          400
        );
      }
    }

    const { data: createdUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createError || !createdUser?.user) {
      return json(
        { success: false, error: createError?.message || "Erro ao criar usuário" },
        400
      );
    }

    const newUserId = createdUser.user.id;

    const profilePayload = {
      id: newUserId,
      email,
      first_name: firstName,
      last_name: lastName,
      company_id: companyId,
      is_company_admin: isCompanyAdmin,
      is_super_admin: false,
      is_active: true,
      ativo: true,
      role: "user",
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabaseAdmin
      .from("user_profiles")
      .upsert(profilePayload, { onConflict: "id" });

    if (upsertError) {
      return json(
        { success: false, error: upsertError.message || "Erro ao atualizar perfil" },
        400
      );
    }

    return json({ success: true, userId: newUserId });
  } catch (error) {
    return json({ success: false, error: String(error?.message || error) }, 500);
  }
});
