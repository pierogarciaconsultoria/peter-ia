
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurity } from '@/components/security/SecurityContextProvider';

// Cache simples para perfis de usuário
const userProfileCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CachedProfile {
  data: any;
  timestamp: number;
}

export const useAuthOptimization = () => {
  const { logDataAccess } = useSecurity();

  const getUserProfileOptimized = useCallback(async (userId: string) => {
    try {
      // Verificar cache primeiro
      const cached = userProfileCache.get(userId) as CachedProfile;
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        logDataAccess('user_profiles', 'SELECT', true, { source: 'cache', userId });
        return cached.data;
      }

      // Buscar do banco se não estiver em cache ou expirou
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logDataAccess('user_profiles', 'SELECT', false, { error: error.message, userId });
        throw error;
      }

      // Armazenar em cache
      userProfileCache.set(userId, {
        data,
        timestamp: Date.now()
      });

      logDataAccess('user_profiles', 'SELECT', true, { source: 'database', userId });
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }, [logDataAccess]);

  const clearUserProfileCache = useCallback((userId?: string) => {
    if (userId) {
      userProfileCache.delete(userId);
    } else {
      userProfileCache.clear();
    }
  }, []);

  const invalidateExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of userProfileCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        userProfileCache.delete(key);
      }
    }
  }, []);

  // Limpar cache expirado periodicamente
  useMemo(() => {
    const interval = setInterval(invalidateExpiredCache, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [invalidateExpiredCache]);

  return {
    getUserProfileOptimized,
    clearUserProfileCache,
    invalidateExpiredCache,
  };
};
