
import { supabase } from '@/integrations/supabase/client';

// Sistema de cache otimizado para autenticação
class AuthOptimization {
  private profileCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cleanupInterval: NodeJS.Timeout | null = null;
  private cacheHits = 0;
  private totalRequests = 0;

  async getUserProfileOptimized(userId: string) {
    this.totalRequests++;
    
    // Verificar cache
    const cached = this.profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      this.cacheHits++;
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

  // Iniciar limpeza automática
  startCacheCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cleanupInterval = setInterval(() => {
      this.cleanExpiredCache();
    }, this.CACHE_DURATION);
  }

  // Parar limpeza automática
  stopCacheCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Estatísticas do cache
  getCacheStats() {
    const hitRate = this.totalRequests > 0 ? (this.cacheHits / this.totalRequests) * 100 : 0;
    return {
      size: this.profileCache.size,
      hitRate: hitRate,
      entries: Array.from(this.profileCache.keys())
    };
  }
}

export const authOptimization = new AuthOptimization();

// Limpar cache expirado a cada 5 minutos
setInterval(() => {
  authOptimization.cleanExpiredCache();
}, 5 * 60 * 1000);
