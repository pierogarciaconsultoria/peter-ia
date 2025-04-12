
export interface Company {
  id: string;
  name: string;
  slug: string;
  cnpj?: string;
  plan: string;
  active: boolean;
  created_at: string;
  user_count?: number;
}
