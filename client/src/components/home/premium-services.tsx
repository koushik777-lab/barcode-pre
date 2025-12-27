import { Barcode, Zap, Shield, Globe, Database, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Barcode,
    title: "Instant Barcodes",
    description: "Get official EAN-13 & UPC-A codes in minutes",
    color: "from-orange-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "24-hour delivery with zero delays",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Lifetime Valid",
    description: "One payment, forever validity, no renewal fees",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Globe,
    title: "Global Ready",
    description: "Accepted worldwide across all retailers",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Database,
    title: "Smart Dashboard",
    description: "Manage all barcodes from one platform",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Smartphone,
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
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="glass-premium p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/50 hover-glow group"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
                className="mb-6"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${service.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-xl font-heading font-bold mb-3 text-white group-hover:text-orange-300 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {service.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
