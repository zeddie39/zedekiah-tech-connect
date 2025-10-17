import { useCallback, useRef } from 'react';

interface ScrollOptions {
  offset?: number;
  duration?: number;
  smooth?: boolean;
}

export function useSmooth() {
  const frameRef = useRef<number>();

  const scrollTo = useCallback((element: HTMLElement | null, options: ScrollOptions = {}) => {
    if (!element) return;

    const {
      offset = 0,
      duration = 500,
      smooth = true
    } = options;

    const start = window.pageYOffset;
    const target = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const startTime = performance.now();

    const easeInOutQuart = (t: number): number => {
      return t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo({
        top: start + (target - start) * easeInOutQuart(progress),
        behavior: smooth ? 'smooth' : 'auto'
      });

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const scrollToTop = useCallback((options: ScrollOptions = {}) => {
    window.scrollTo({
      top: 0,
      behavior: options.smooth ? 'smooth' : 'auto'
    });
  }, []);

  const scrollToElement = useCallback((elementId: string, options: ScrollOptions = {}) => {
    const element = document.getElementById(elementId);
    if (element) {
      scrollTo(element, options);
    }
  }, [scrollTo]);

  return {
    scrollTo,
    scrollToTop,
    scrollToElement
  };
}