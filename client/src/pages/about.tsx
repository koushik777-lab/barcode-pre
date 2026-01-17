import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Building2, Globe, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <div className="premium-bg opacity-40" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-8 font-heading text-glow"
          >
            About <span className="text-orange-500">ShopMyBarcode</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering businesses worldwide with official, verified, and instant retail barcode solutions.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-heading font-bold text-white mb-8">Our Mission</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  At ShopMyBarcode, we exist to dismantle the barriers to retail entry. We believe that every entrepreneur deserves a fair shot at the global market without being bogged down by bureaucratic complexity or exorbitant fees.
                </p>
                <p>
                  Since our inception, we have served as the trusted bridge for thousands of artisans, manufacturers, and startups, connecting their innovative products to major marketplaces like Amazon, Walmart, and eBay through GS1-compliant identification.
                </p>
                <p className="text-white font-semibold">
                  We are not just selling barcodes; we are enabling commerce.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, title: "Trusted", desc: "100% Guaranteed Validity" },
                { icon: Globe, title: "Global", desc: "Accepted Worldwide" },
                { icon: Building2, title: "Official", desc: "GS1 Compliant Standards" },
                { icon: Users, title: "Support", desc: "24/7 Expert Assistance" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-premium p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group"
                >
                  <item.icon className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
