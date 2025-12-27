import { Barcode, Zap, Shield, Globe, Smartphone, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Barcode,
    title: "Instant Delivery",
    description: "Get your barcodes within minutes, not days",
    color: "from-orange-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Lifetime Valid",
    description: "One payment, forever validity, zero renewal fees",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Globe,
    title: "Globally Accepted",
    description: "Work across retailers worldwide, both online & offline",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Manage all your barcodes from one easy dashboard",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Growth Ready",
    description: "SEO-optimized for product visibility on Google",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Zap,
    title: "Fast Support",
    description: "Expert team ready to assist you 24/7",
    color: "from-red-500 to-pink-500"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function AnimatedFeatures() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Why Choose <span className="gradient-text">Shop My Barcode</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for authentic product identification
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-muted/30 border border-border hover:border-primary/30 transition-all cursor-default"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
                  className="mb-4 inline-block"
                >
                  <feature.icon className="h-8 w-8 text-primary" />
                </motion.div>
                
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Border Animation */}
              <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/50 transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
