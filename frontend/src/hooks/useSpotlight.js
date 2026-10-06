import { useEffect, useRef } from 'react';

/**
 * Publishes the pointer position inside an element as the `--spot-x` /
 * `--spot-y` CSS custom properties that `.spotlight` uses to place its radial
 * highlight.
 *
 * Writes are rAF-throttled and bypass React entirely, so hovering a grid of
 * cards costs one style write per frame rather than a re-render per card.
 * The listener is not attached at all when the user prefers reduced motion or
 * is on a device without hover.
 */
export default function useSpotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let frame = 0;
    let point = null;

    const paint = () => {
      frame = 0;
      if (!point) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${point.x - rect.left}px`);
      el.style.setProperty('--spot-y', `${point.y - rect.top}px`);
    };

    const onMove = (event) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    el.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      el.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
