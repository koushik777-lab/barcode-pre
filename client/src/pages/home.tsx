import { Suspense, lazy } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PremiumHero } from "@/components/home/premium-hero";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { GradientText } from "@/components/ui/gradient-text";

// Lazy load heavy components
const PremiumServices = lazy(() => import("@/components/home/premium-services").then(module => ({ default: module.PremiumServices })));
const Industries = lazy(() => import("@/components/home/industries").then(module => ({ default: module.Industries })));
const TestimonialCarousel = lazy(() => import("@/components/home/testimonial-carousel").then(module => ({ default: module.TestimonialCarousel })));
const StatsSection = lazy(() => import("@/components/home/stats-section").then(module => ({ default: module.StatsSection })));

// Loading Animation Component
function SectionLoader() {
  return (
    <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-12 w-12 text-orange-500 alpha-80" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-4 text-orange-400/80 font-medium"
      >
        Loading experience...
      </motion.p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="relative z-10">
        <PremiumHero />
        <Suspense fallback={<SectionLoader />}>
          <PremiumServices />
        </Suspense>

        {/* Process Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
              <h2 className="text-5xl md:text-6xl font-heading font-bold text-center mb-20 text-glow">
                4 Steps to <GradientText variant="glow-strong">Success</GradientText>
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { num: 1, title: "Apply Online", desc: "2-minute form", icon: "📝" },
                { num: 2, title: "Get Verified", desc: "Quick check", icon: "✓" },
                { num: 3, title: "Instant Delivery", desc: "Email within 24H", icon: "⚡" },
                { num: 4, title: "Go Live", desc: "Start selling", icon: "🚀" }
              ].map((step, i) => (
                <AnimatedSection key={i} delay={i * 0.1} className="h-full">
                  <GlassCard className="text-center h-full flex flex-col items-center justify-center">
                    <div className="text-5xl font-heading font-bold text-orange-400 mb-4">{step.num}</div>
                    <h3 className="text-xl font-heading font-bold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <StatsSection />
        <TestimonialCarousel />

        <Industries />

        {/* Final CTA */}
        <section className="relative py-40 overflow-hidden">
          <div className="premium-bg opacity-50" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <AnimatedSection className="max-w-4xl mx-auto">
              <div className="glass-premium p-16 rounded-3xl border border-orange-500/40 text-center glow-border-strong relative overflow-hidden group">
                {/* Background light effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8 text-glow relative z-10">
                  Ready to <GradientText variant="glow-strong">Transform</GradientText> Your Business?
                </h2>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed relative z-10">
                  Join 5000+ businesses that trust Shop My Barcode for authentic, globally-accepted barcodes. Instant delivery, lifetime validity, zero fees.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-premium px-12 py-6 rounded-full font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 hover:glow-border-strong inline-flex items-center gap-3 relative z-10"
                >
                  Start Your Journey <ArrowRight className="h-6 w-6" />
                </motion.button>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <Footer />
      </main>
    </div >
  );
}
