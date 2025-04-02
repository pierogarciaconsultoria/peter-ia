
import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const threshold = 10;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - prevScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Determina a direção da rolagem
      const newScrollDirection = scrollY > prevScrollY ? 'down' : 'up';

      // Atualiza a visibilidade baseada na direção da rolagem
      // Oculta a barra ao rolar para baixo, mostra ao rolar para cima
      setVisible(newScrollDirection === 'up');
      setScrollDirection(newScrollDirection);
      setPrevScrollY(scrollY > 0 ? scrollY : 0);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [prevScrollY]);

  return { scrollDirection, visible };
}
