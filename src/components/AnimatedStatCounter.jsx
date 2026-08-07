import React, { useState, useEffect, useRef } from 'react';

function AnimatedStatCounter({ value, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const target = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
  const isMounted = useRef(true);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutQuad * target);

      if (isMounted.current) {
        setCount(currentCount);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      isMounted.current = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default React.memo(AnimatedStatCounter);
