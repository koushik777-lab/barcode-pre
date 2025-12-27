import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
}

function AnimatedStat({ value, label, suffix = "" }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = value / 50;
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    { value: 5000, label: "Happy Businesses", suffix: "+" },
    { value: 10, label: "Countries Served", suffix: "+" },
    { value: 100, label: "Success Rate", suffix: "%" },
    { value: 24, label: "Hours Delivery", suffix: "H" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-20"
        >
          Our Impact by <span className="gradient-text">Numbers</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AnimatedStat {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
