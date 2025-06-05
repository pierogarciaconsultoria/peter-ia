
import { supabase } from '@/integrations/supabase/client';

// Sistema de cache otimizado para autenticação
class AuthOptimization {
  private profileCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  async getUserProfileOptimized(userId: string) {
    // Verificar cache
    const cached = this.profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          company_id,
          is_super_admin,
          is_company_admin,
          created_at,
          last_login,
          is_active
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Atualizar cache
      this.profileCache.set(userId, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil otimizado:', error);
      return null;
    }
  }

  clearCache(userId?: string) {
    if (userId) {
      this.profileCache.delete(userId);
    } else {
      this.profileCache.clear();
    }
  }

  // Limpar cache expirado
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.profileCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.profileCache.delete(key);
      }
    }
  }

  // Estatísticas do cache
  getCacheStats() {
    return {
      size: this.profileCache.size,
      entries: Array.from(this.profileCache.keys())
    };
  }
}

export const authOptimization = new AuthOptimization();

// Limpar cache expirado a cada 5 minutos
setInterval(() => {
  authOptimization.cleanExpiredCache();
}, 5 * 60 * 1000);
