import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Very easy and fast process. I got a valid barcode for my product instantly. Thanks, Shop My Barcode team!",
    author: "Vikram Singh",
    role: "Manufacturer"
  },
  {
    text: "There couldn't be a better barcode service than this. Original barcodes at an affordable price with a hassle-free registration process.",
    author: "Neha Agarwal",
    role: "Small Business Owner"
  },
  {
    text: "Very fast and reliable service! I received my barcode within minutes. The entire process was simple and secure. Highly recommended!",
    author: "Amit Sharma",
    role: "E-commerce Seller"
  },
  {
    text: "ShopMyBarcode exceeded my expectations. Their customer support was very helpful and answered all my queries.",
    author: "Priya Verma",
    role: "Product Manager"
  },
  {
    text: "I ordered barcodes for my e-commerce business, and everything worked smoothly. The barcodes are valid across all platforms.",
    author: "Rohit Mehta",
    role: "Online Retailer"
  },
  {
    text: "Great service, but customer support response time could be a bit faster. Otherwise, everything was excellent!",
    author: "Anjali Gupta",
    role: "Start-up Founder"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Trusted by Business Owners
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say about their experience with our barcode services.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
            </div>
            <span className="font-bold text-foreground">4.8/5</span>
            <span className="text-muted-foreground text-sm">(500+ Reviews)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-muted/20 p-8 rounded-2xl border border-border hover:bg-muted/40 transition-colors"
            >
              <div className="flex mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <h4 className="font-bold text-foreground">{t.author}</h4>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
