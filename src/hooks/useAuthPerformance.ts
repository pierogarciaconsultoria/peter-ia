
import { useState, useEffect, useCallback } from 'react';
import { AuthPerformanceMetrics } from '@/types/auth';
import { logger } from '@/utils/logger';

export const useAuthPerformance = () => {
  const [metrics, setMetrics] = useState<AuthPerformanceMetrics>({
    queriesCount: 0,
    avgQueryTime: 0,
    cacheHitRate: 0,
    lastOptimization: new Date(),
  });

  const [queryTimes, setQueryTimes] = useState<number[]>([]);

  const trackQuery = useCallback((queryTime: number) => {
    setQueryTimes(prev => {
      const newTimes = [...prev, queryTime].slice(-100); // Manter apenas as últimas 100 queries
      return newTimes;
    });

    setMetrics(prev => ({
      ...prev,
      queriesCount: prev.queriesCount + 1,
    }));
  }, []);

  const calculateMetrics = useCallback(() => {
    if (queryTimes.length > 0) {
      const avgTime = queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length;
      
      setMetrics(prev => ({
        ...prev,
        avgQueryTime: avgTime,
        cacheHitRate: Math.min(95, 70 + (queryTimes.length / 10)), // Simulação
      }));
    }
  }, [queryTimes]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      queriesCount: 0,
      avgQueryTime: 0,
      cacheHitRate: 0,
      lastOptimization: new Date(),
    });
    setQueryTimes([]);
    logger.info('AuthPerformance', 'Métricas resetadas');
  }, []);

  const optimizeCache = useCallback(() => {
    // Simulação de otimização de cache
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: Math.min(100, prev.cacheHitRate + 10),
      lastOptimization: new Date(),
    }));
    logger.info('AuthPerformance', 'Cache otimizado');
  }, []);

  return {
    metrics,
    trackQuery,
    resetMetrics,
    optimizeCache,
  };
};
