
import { useEffect, useRef } from 'react';

/**
 * Hook para evitar execuções iniciais de efeitos
 * @param callback Função a ser executada após a primeira renderização
 * @param deps Array de dependências
 */
export function useSkipFirstRender(callback: Function, deps: any[]) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    callback();
  }, deps);
}

/**
 * Função para debounce de eventos
 * @param func Função a ser executada
 * @param wait Tempo de espera em ms
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Função para normalizar e otimizar pesquisas em arrays
 * @param items Array a ser otimizado
 * @param key Chave para indexação dos itens
 */
export function optimizeArraySearch<T extends Record<K, string | number>, K extends keyof T>(
  items: T[],
  key: K
): { [key: string]: T } {
  return items.reduce((acc, item) => {
    const itemKey = String(item[key]);
    acc[itemKey] = item;
    return acc;
  }, {} as { [key: string]: T });
}
