import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Configure GSAP defaults
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
});

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
});

export { gsap, ScrollTrigger };
