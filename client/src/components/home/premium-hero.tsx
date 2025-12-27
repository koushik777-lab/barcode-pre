import { Button } from "@/components/ui/button";
import { ArrowRight, Barcode, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function PremiumHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const stats = [
    { num: "100%", label: "Authentic" },
    { num: "5000+", label: "Trusted" },
    { num: "0", label: "Renewal Fees" },
    { num: "24H", label: "Delivery" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="premium-bg" />
      <div className="orb-extra-1" />
      <div className="orb-extra-2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="glass-premium w-fit px-4 py-2 rounded-full border border-orange-500/30"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-300">Official Retail Barcodes</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-6xl md:text-7xl xl:text-8xl font-heading font-bold leading-[1] text-glow">
                Your Product's <br />
                <span className="text-glow-strong">Identity</span> <br />
                Starts Here
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed"
            >
              Official barcodes that work globally. Instant delivery, lifetime validity, zero renewal fees. Join the fastest-growing barcode ecosystem.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-premium px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 hover:glow-border-strong"
              >
                Get Barcodes <ArrowRight className="inline ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-premium px-8 py-4 rounded-full font-bold text-lg border border-orange-500/30 hover:border-orange-500/60 transition-all"
              >
                Schedule Demo
              </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 pt-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="glass-premium p-4 rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition-all"
                >
                  <p className="text-3xl font-heading font-bold text-orange-400">{stat.num}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Premium Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden md:block"
          >
            <div className="perspective">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent rounded-3xl blur-3xl" />

              {/* Dashboard Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass-premium p-6 rounded-3xl border border-orange-500/30 backdrop-blur-2xl relative z-20"
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400 ml-auto">shopmybarcode.com</span>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Barcode className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Barcode Status</p>
                      <p className="text-sm font-bold text-white">Active & Verified</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Processing</p>
                    <div className="w-full h-2 bg-orange-500/20 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-300"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {["Instant", "Global", "Lifetime", "Support"].map((feature, i) => (
                      <div key={i} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-xs font-bold text-orange-300">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Time Display */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-orange-500/20">
                    <span>Delivery: &lt;24H</span>
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
