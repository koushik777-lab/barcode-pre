import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    text: "Shop My Barcode made it incredibly easy to get official barcodes for my e-commerce business. Within minutes, everything was sorted!",
    author: "Vikram Singh",
    role: "E-commerce Entrepreneur",
    rating: 5
  },
  {
    text: "The support team is outstanding. They guided us through the entire process and our product went live faster than expected.",
    author: "Priya Verma",
    role: "Product Manager",
    rating: 5
  },
  {
    text: "Lifetime validity with no renewal fees? This is the best barcode solution in the market. Highly recommended!",
    author: "Neha Agarwal",
    role: "Manufacturing Owner",
    rating: 5
  },
  {
    text: "From registration to delivery, everything was hassle-free. Their dashboard makes managing barcodes super simple.",
    author: "Rohit Mehta",
    role: "Startup Founder",
    rating: 5
  }
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-16"
        >
          Love from Our <span className="gradient-text">Customers</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-12 rounded-3xl text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-heading font-bold mb-8 leading-relaxed">
                "{testimonials[current].text}"
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                <h4 className="font-heading font-bold text-lg">
                  {testimonials[current].author}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[current].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="p-3 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-3 rounded-full transition-all ${
                    i === current
                      ? "w-8 bg-primary"
                      : "w-3 bg-border hover:bg-primary/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="p-3 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
