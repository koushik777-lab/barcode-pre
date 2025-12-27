import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AdvancedHero } from "@/components/home/advanced-hero";
import { AnimatedFeatures } from "@/components/home/animated-features";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <AdvancedHero />
        <AnimatedFeatures />
        <StatsSection />
        <TestimonialCarousel />

        {/* How It Works */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold text-center mb-16"
            >
              Four Steps to <span className="gradient-text">Success</span>
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-6 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 -translate-y-1/2" />

              {[
                { num: 1, title: "Apply Online", desc: "Simple 2-minute form" },
                { num: 2, title: "Get Verified", desc: "Quick product check" },
                { num: 3, title: "Instant Delivery", desc: "Barcodes via email" },
                { num: 4, title: "Go Live", desc: "Start selling worldwide" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="glass-card p-8 rounded-2xl text-center h-full">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-2xl font-heading font-bold text-white relative z-10">
                      {step.num}
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-orange-400 to-primary opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                Ready to Get Your Barcodes?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Join thousands of businesses that trust Shop My Barcode for authentic, globally-accepted barcodes.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-12 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                Start Now <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
