import { useEffect, useState, useRef, useCallback } from "react";

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
  duration?: number;
  formatter?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  className = "",
  duration = 500, // Reduced duration for better performance
  formatter,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef<number | string>(value);
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Memoize formatter to prevent unnecessary re-renders
  const formatValue = useCallback(
    (v: number) => {
      if (formatter) return formatter(v);
      return v.toLocaleString();
    },
    [formatter],
  );

  useEffect(() => {
    // Clear any existing animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Handle string values (like percentages or categories)
    if (typeof value === "string") {
      if (value !== prevValueRef.current) {
        setIsAnimating(true);
        setDisplayValue(value);
        prevValueRef.current = value;

        // Brief animation for string changes
        timeoutRef.current = setTimeout(() => setIsAnimating(false), 200);
      } else if (displayValue === "") {
        setDisplayValue(value);
      }
      return;
    }

    // Handle numeric values with counting animation
    const numericValue = Number(value);
    const prevNumericValue = Number(prevValueRef.current) || 0;

    // Initialize display value if empty
    if (displayValue === "") {
      setDisplayValue(formatValue(numericValue));
      prevValueRef.current = numericValue;
      return;
    }

    if (numericValue === prevNumericValue) {
      return;
    }

    setIsAnimating(true);
    const startTime = performance.now();
    const startValue = prevNumericValue;
    const difference = numericValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Simpler easing function for better performance
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + difference * easeOut;

      setDisplayValue(formatValue(Math.round(currentValue)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(formatValue(numericValue));
        setIsAnimating(false);
        prevValueRef.current = numericValue;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, duration, formatValue, displayValue]);

  return (
    <span
      className={`${className} transition-all duration-200 ${
        isAnimating ? "scale-[1.02] text-[#0052CC]" : "scale-100"
      }`}
      style={{
        filter: isAnimating
          ? "drop-shadow(0 0 4px rgba(0, 102, 255, 0.2))"
          : "none",
      }}
    >
      {displayValue}
    </span>
  );
}
