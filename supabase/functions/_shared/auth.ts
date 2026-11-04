import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface AuthenticatedContext {
  user: { id: string; email?: string };
  profile: { company_id: string | null; is_super_admin: boolean; is_company_admin: boolean } | null;
  /** Cliente Supabase agindo como o usuário (RLS aplicada). */
  supabase: SupabaseClient;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Exige um usuário autenticado. A chave anon sozinha não basta:
 * o token precisa ser de uma sessão válida.
 */
export async function requireUser(req: Request): Promise<AuthenticatedContext> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const authorization = req.headers.get('Authorization') ?? '';

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    throw new AuthError('Unauthorized');
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new AuthError('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('company_id, is_super_admin, is_company_admin')
    .eq('id', user.id)
    .maybeSingle();

  return { user: { id: user.id, email: user.email }, profile: profile ?? null, supabase };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
