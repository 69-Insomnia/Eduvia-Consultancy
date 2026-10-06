import { useState, useEffect, useRef } from 'react';
import useInView from '../../hooks/useInView';

function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const hasAnimated = useRef(false);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (isNaN(target)) return;

    const duration = 1600;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  // Safety net: the count starts at 0, so if the reveal observer never fires
  // the page would read "0+ Students Placed". Always land on the real figure.
  useEffect(() => {
    if (hasAnimated.current || isNaN(target)) return;
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        hasAnimated.current = true;
        setCount(target);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
};

export default function StatsCounter({ stats = [] }) {
  if (!stats.length) return null;

  const columns = COLUMN_CLASSES[stats.length] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${columns} gap-y-8 gap-x-4`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative text-center px-2 lg:px-4 lg:border-r lg:border-white/15 lg:last:border-r-0"
        >
          <div className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight tabular-nums">
            <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
          </div>
          <p className="mt-2 text-xs md:text-sm text-white/60 font-medium tracking-wide">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
