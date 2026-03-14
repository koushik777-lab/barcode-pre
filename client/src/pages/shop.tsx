import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, ShoppingCart, Zap, ShieldCheck, Barcode, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BARCODE_PACKAGES, SPECIAL_PACKAGE } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "wouter";

const IconMap: Record<string, React.ReactNode> = {
  Barcode: <Barcode className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  ShoppingCart: <ShoppingCart className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
};

export default function Shop() {
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  const handlePurchase = (pkg: any) => {
    addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      count: pkg.count,
      quantity: 1,
      color: pkg.shopColor
    });
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
                Premium Barcode <span className="text-orange-500 text-glow">Solutions</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed font-light">
                Secure your retail future with official, high-quality barcodes. 
                Choose the package that fits your business scale.
              </p>
            </motion.div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {BARCODE_PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative group rounded-3xl p-8 border transition-all duration-300 ${
                  pkg.popular 
                    ? "glass-premium border-orange-500/50 shadow-2xl shadow-orange-500/10 scale-105 z-10" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/40">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-8">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${pkg.shopColor} flex items-center justify-center shadow-lg`}>
                    {IconMap[pkg.iconName]}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{pkg.name}</p>
                    <p className="text-2xl font-black text-white">{pkg.count} Barcode{pkg.count > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₹</span>
                    <span className="text-5xl font-black tracking-tight">{pkg.price.toLocaleString()}</span>
                  </div>
                  <p className="text-white/40 text-sm mt-2">{pkg.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/50">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-6 rounded-2xl font-bold text-base transition-all duration-300 ${
                  pkg.popular 
                    ? "bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}>
                  Purchase Now
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Special Unlimited Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative rounded-[2.5rem] overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${SPECIAL_PACKAGE.shopColor} opacity-90`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            
            <div className="relative p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md mb-6">
                  <Crown className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-widest">Ultimate Enterprise</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  {SPECIAL_PACKAGE.name}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed font-medium mb-8">
                  {SPECIAL_PACKAGE.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SPECIAL_PACKAGE.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2rem] text-center min-w-[300px] shadow-2xl">
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Annual Subscription</p>
                <div className="flex items-baseline justify-center gap-1 mb-8">
                  <span className="text-4xl font-bold text-white">₹</span>
                  <span className="text-7xl font-black text-white tracking-tighter">{SPECIAL_PACKAGE.price.toLocaleString()}</span>
                  <span className="text-xl font-bold text-white/60">{SPECIAL_PACKAGE.period}</span>
                </div>
                <Button 
                  onClick={() => handlePurchase(SPECIAL_PACKAGE)}
                  className="w-full py-8 rounded-2xl bg-white text-orange-600 hover:bg-white/90 font-black text-lg shadow-xl"
                >
                  Buy Unlimited Package
                </Button>
                <p className="text-white/40 text-xs mt-4 font-medium uppercase tracking-widest">Priority Onboarding Included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
