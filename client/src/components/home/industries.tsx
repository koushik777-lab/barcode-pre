import {
  GiChiliPepper,
  GiWheat,
  GiOlive,
  GiMilkCarton,
  GiSodaCan,
  GiSnowflake1,
  GiCandyCanes,
  GiHealthNormal,
  GiLipstick,
  GiSpray
} from "react-icons/gi";
import { motion } from "framer-motion";

const industries = [
  {
    icon: GiChiliPepper,
    name: "Spices & Condiments",
    description: "Spices, Pickle, Mukhwas & Saunf.",
    color: "bg-red-200"
  },
  {
    icon: GiWheat,
    name: "Grains & Pulses",
    description: "Pulses, Millet & Products, Flour.",
    color: "bg-orange-200"
  },
  {
    icon: GiOlive,
    name: "Edible Oils & Fats",
    description: "Edible Oils, Ghee Products, Peanut Butter.",
    color: "bg-lime-200"
  },
  {
    icon: GiMilkCarton,
    name: "Dairy & Dairy Alternatives",
    description: "Milk & Its Products, Ice Cream & Frozen Desserts, Tofu",
    color: "bg-cyan-200"
  },
  {
    icon: GiSodaCan,
    name: "Beverages",
    description: "Tea, Coffee, Carbonated Drinks, Packaged Drinking Water, Liquor (Whisky & Beer)",
    color: "bg-blue-300"
  },
  {
    icon: GiSnowflake1,
    name: "Dry & Frozen Foods",
    description: "Dry Fruits, Frozen Items (Peas, Corn, Frozen Snacks)",
    color: "bg-cyan-300"
  },
  {
    icon: GiCandyCanes,
    name: "Sweets & Confectionery",
    description: "Chocolates, Candy, Honey",
    color: "bg-orange-300"
  },
  {
    icon: GiHealthNormal,
    name: "Health & Nutrition",
    description: "Whey Protein, Ayurvedic Products, Makhana Products",
    color: "bg-green-200"
  },
  {
    icon: GiLipstick,
    name: "Personal Care",
    description: "Cosmetic Products, Bathing Soap, Toothpaste, Toothbrush, Perfumes & Fragrances, Hand Wash Liquid, Sanitary Pads, Baby Diapers, Adult Diapers",
    color: "bg-pink-300"
  },
  {
    icon: GiSpray,
    name: "Home Cleaning",
    description: "Floor Cleaner, Toilet Cleaner, Dish Wash Soap & Gel, Detergent Powder, Detergent Cake",
    color: "bg-blue-400"
  }
];

export function Industries() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements to match premium feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-background/50 backdrop-blur-3xl z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4 text-glow"
          >
            Industries We <span className="text-glow-strong text-orange-500">Serve</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Powering businesses across diverse sectors with official retail codes.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {industries.map((item, index) => (
            <div
              key={index}
              className="group h-[300px] perspective-1000"
            >
              <motion.div
                variants={itemVariants}
                className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180"
              >
                {/* Front Face - Colored Background */}
                <div className="absolute inset-0 backface-hidden">
                  <div className={`h-full ${item.color} p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg`}>
                    <div className="mb-4 p-4 rounded-full bg-white/30 backdrop-blur-sm">
                      <item.icon className="h-10 w-10 text-gray-800" />
                    </div>
                    <span className="text-xl font-bold font-heading text-gray-900 mb-2">
                      {item.name}
                    </span>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Back Face - Glassmorphism */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full glass-premium p-6 rounded-2xl border border-orange-500/40 bg-orange-950/90 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold font-heading text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4">
                      <item.icon className="h-6 w-6 text-orange-500/40 mx-auto" />
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
