import { Button } from "@/components/ui/button";
import { ArrowRight, Barcode, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AdvancedHero() {
  const stats = [
    { value: "99.9%", label: "Authentic" },
    { value: "5000+", label: "Businesses" },
    { value: "0", label: "Renewal Fees" },
    { value: "24H", label: "Fast Delivery" }
  ];

  return (
    <section className="animated-bg relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">Official Retail Barcodes</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] mb-4">
                Your Product's <br />
                <span className="gradient-text">Identity Starts</span> <br />
                Here
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Official barcodes that work. Instant delivery, lifetime validity, zero fees. Join 5000+ trusted businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/30 rounded-full hover:scale-[1.05] transition-all">
                Get Barcodes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold border-2 rounded-full hover:bg-primary/5">
                Learn More
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 pt-8"
            >
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50 bg-white/50">
                  <p className="text-2xl font-heading font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Animated Background Shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-primary/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-primary/20"
              />

              {/* Center Content Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="glass-card p-8 rounded-3xl shadow-2xl text-center w-64">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-4 bg-primary/20 rounded-full mb-4"
                  >
                    <Barcode className="h-12 w-12 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-bold text-xl mb-2">Barcode Ready</h3>
                  <p className="text-sm text-muted-foreground mb-4">Official & Verified</p>
                  <div className="text-3xl font-heading font-bold gradient-text">×∞</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
