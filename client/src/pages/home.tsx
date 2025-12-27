import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PremiumHero } from "@/components/home/premium-hero";
import { PremiumServices } from "@/components/home/premium-services";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { StatsSection } from "@/components/home/stats-section";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="relative z-10">
        <PremiumHero />
        <PremiumServices />

        {/* Process Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-heading font-bold text-center mb-20 text-glow"
            >
              4 Steps to <span className="text-glow-strong">Success</span>
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { num: 1, title: "Apply Online", desc: "2-minute form", icon: "📝" },
                { num: 2, title: "Get Verified", desc: "Quick check", icon: "✓" },
                { num: 3, title: "Instant Delivery", desc: "Email within 24H", icon: "⚡" },
                { num: 4, title: "Go Live", desc: "Start selling", icon: "🚀" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-premium p-8 rounded-2xl border border-orange-500/30 hover:border-orange-500/60 text-center hover-glow"
                >
                  <div className="text-5xl font-heading font-bold text-orange-400 mb-4">{step.num}</div>
                  <h3 className="text-xl font-heading font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <StatsSection />
        <TestimonialCarousel />

        {/* Industries Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-heading font-bold text-center mb-20 text-glow"
            >
              Industries We <span className="text-glow-strong">Serve</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "E-commerce", "Manufacturing", "Startups", "Retail",
                "Food & Beverage", "Beauty & Personal Care", "Logistics", "Healthcare"
              ].map((industry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-premium p-6 rounded-xl border border-orange-500/20 text-center hover:border-orange-500/50 hover-glow"
                >
                  <p className="font-bold text-white">{industry}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-40 overflow-hidden">
          <div className="premium-bg opacity-50" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-premium p-16 rounded-3xl border border-orange-500/40 text-center glow-border-strong">
                <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8 text-glow">
                  Ready to <span className="text-glow-strong">Transform</span> Your Business?
                </h2>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                  Join 5000+ businesses that trust Shop My Barcode for authentic, globally-accepted barcodes. Instant delivery, lifetime validity, zero fees.
                </p>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-premium px-12 py-6 rounded-full font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 hover:glow-border-strong inline-flex items-center gap-3"
                >
                  Start Your Journey <ArrowRight className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
