import { Barcode, QrCode, BookOpen, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Barcode,
    title: "Retail Barcodes (EAN/UPC)",
    description: "Official EAN-13 and UPC-A barcodes accepted by retailers worldwide. Perfect for products sold in stores."
  },
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description: "Connect physical products to digital experiences. Edit destination URLs anytime without reprinting."
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Receive your barcode numbers and high-resolution images via email immediately after purchase."
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Validity",
    description: "One-time payment. No annual fees, no renewal charges. Your barcodes are yours forever."
  },
  {
    icon: Globe,
    title: "Global Acceptance",
    description: "Our barcodes are verified and accepted by retailers across India and internationally."
  },
  {
    icon: BookOpen,
    title: "ISBN Book Codes",
    description: "Specialized ISBN barcodes for authors and publishers to sell books in physical and online stores."
  }
];

export function Services() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            Everything You Need for <span className="text-primary">Product Identification</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide comprehensive barcode solutions tailored for businesses of all sizes, from startups to established enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group h-[300px]"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full h-full transition-all duration-500 group-hover:[transform:rotateY(180deg)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Face */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="h-full bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-xl hover:shadow-2xl hover:border-orange-500/30 transition-all">
                    <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-10 w-10 text-orange-500" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2 text-white">{feature.title}</h3>
                    <p className="text-orange-500/60 text-sm mt-4 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      Hover to learn more
                    </p>
                  </div>
                </div>

                {/* Back Face */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="h-full bg-slate-900 border border-orange-500/30 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50" />
                    <div className="relative z-10">
                      <h3 className="font-heading font-bold text-xl mb-4 text-white">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                      <div className="mt-6 text-orange-500">
                        <feature.icon className="h-6 w-6 mx-auto opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section >
  );
}
