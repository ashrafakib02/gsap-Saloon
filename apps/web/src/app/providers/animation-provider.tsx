import type { ReactNode } from 'react';
import { useEffect } from 'react';
import '@/lib/gsap-config';

export function AnimationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // GSAP + Lenis initialization happens via gsap-config import
  }, []);

  return <>{children}</>;
}
