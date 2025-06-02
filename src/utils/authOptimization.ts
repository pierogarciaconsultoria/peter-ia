
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export class AuthOptimization {
  private static instance: AuthOptimization;
  private queryCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  public static getInstance(): AuthOptimization {
    if (!AuthOptimization.instance) {
      AuthOptimization.instance = new AuthOptimization();
    }
    return AuthOptimization.instance;
  }

  async checkUserPermissionOptimized(
    table: string,
    action: string,
    targetId?: string
  ): Promise<boolean> {
    const cacheKey = `permission_${table}_${action}_${targetId}`;
    const cached = this.queryCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      logger.debug('AuthOptimization', 'Cache hit para permissão', { cacheKey });
      return cached.data;
    }

    const startTime = Date.now();
    
    try {
      // Usar as novas funções security definer para evitar recursão
      const { data, error } = await supabase.rpc('is_current_user_admin');

      const queryTime = Date.now() - startTime;
      logger.debug('AuthOptimization', 'Query executada', { 
        table, 
        action, 
        queryTime 
      });

      if (error) {
        logger.error('AuthOptimization', 'Erro ao verificar permissão', error);
        return false;
      }

      // Cache do resultado
      this.queryCache.set(cacheKey, {
        data: data || false,
        timestamp: Date.now(),
      });

      return data || false;
    } catch (error: any) {
      logger.error('AuthOptimization', 'Erro inesperado', error);
      return false;
    }
  }

  clearCache(): void {
    this.queryCache.clear();
    logger.info('AuthOptimization', 'Cache limpo');
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.queryCache.size,
      hitRate: 0, // Implementar contador de hits se necessário
    };
  }

  // Otimização para queries de perfil do usuário usando novas funções
  async getUserProfileOptimized(userId: string) {
    const cacheKey = `user_profile_${userId}`;
    const cached = this.queryCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Usar select direto agora que as políticas RLS foram corrigidas
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        this.queryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error: any) {
      logger.error('AuthOptimization', 'Erro ao buscar perfil', error);
      return null;
    }
  }

  // Limpar cache automaticamente
  startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.queryCache.entries()) {
        if (now - value.timestamp > this.CACHE_TTL) {
          this.queryCache.delete(key);
        }
      }
      logger.debug('AuthOptimization', 'Limpeza automática de cache executada');
    }, 10 * 60 * 1000); // A cada 10 minutos
  }
}

export const authOptimization = AuthOptimization.getInstance();
