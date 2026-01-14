import {
  RiBarcodeBoxLine,
  RiThunderstormsLine,
  RiShieldCheckLine,
  RiGlobalLine,
  RiLayoutGridLine,
  RiSmartphoneLine
} from "react-icons/ri";
import { motion } from "framer-motion";

const services = [
  {
    icon: RiBarcodeBoxLine,
    title: "Instant Barcodes",
    description: "Get official EAN-13 & UPC-A codes in minutes",
    color: "from-orange-500 to-pink-500"
  },
  {
    icon: RiThunderstormsLine,
    title: "Lightning Fast",
    description: "24-hour delivery with zero delays",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: RiShieldCheckLine,
    title: "Lifetime Valid",
    description: "One payment, forever validity, no renewal fees",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: RiGlobalLine,
    title: "Global Ready",
    description: "Accepted worldwide across all retailers",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: RiLayoutGridLine,
    title: "Smart Dashboard",
    description: "Manage all barcodes from one platform",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: RiSmartphoneLine,
    title: "Mobile Friendly",
    description: "Complete control from your pocket",
    color: "from-indigo-500 to-blue-500"
  }
];

export function PremiumServices() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-heading font-bold text-center mb-20 text-glow"
        >
          Why Choose <span className="text-glow-strong">Shop My Barcode</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="group h-[320px] perspective-1000"
            >
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180"
              >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full glass-premium p-8 rounded-2xl border border-orange-500/20 flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <div className="inline-block p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/20">
                        <service.icon className="h-10 w-10 text-orange-400" />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-orange-300 font-medium opacity-80">Hover to learn more</p>
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full glass-premium p-8 rounded-2xl border border-orange-500/50 bg-orange-950/30 flex flex-col items-center justify-center text-center">
                    <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
                      <service.icon className="h-8 w-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      {service.description}
                    </p>
                    <div className="mt-6">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/30 pb-1">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
