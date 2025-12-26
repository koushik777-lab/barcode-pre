import { Barcode, QrCode, BookOpen, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Barcode className="h-8 w-8 text-primary" />,
    title: "Retail Barcodes (EAN/UPC)",
    description: "Official EAN-13 and UPC-A barcodes accepted by retailers worldwide. Perfect for products sold in stores."
  },
  {
    icon: <QrCode className="h-8 w-8 text-secondary" />,
    title: "Dynamic QR Codes",
    description: "Connect physical products to digital experiences. Edit destination URLs anytime without reprinting."
  },
  {
    icon: <Zap className="h-8 w-8 text-amber-500" />,
    title: "Instant Delivery",
    description: "Receive your barcode numbers and high-resolution images via email immediately after purchase."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
    title: "Lifetime Validity",
    description: "One-time payment. No annual fees, no renewal charges. Your barcodes are yours forever."
  },
  {
    icon: <Globe className="h-8 w-8 text-purple-500" />,
    title: "Global Acceptance",
    description: "Our barcodes are verified and accepted by retailers across India and internationally."
  },
  {
    icon: <BookOpen className="h-8 w-8 text-rose-500" />,
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
              className="bg-background p-8 rounded-2xl border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="mb-6 p-4 bg-muted rounded-xl inline-block group-hover:bg-primary/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
