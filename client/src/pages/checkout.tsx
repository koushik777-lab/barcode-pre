import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useLocation, Link } from "wouter";
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, 
  ShieldCheck, Loader2, User, Mail, Phone, MapPin, Building,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Billing States
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    gstin: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setBillingInfo(prev => ({
        ...prev,
        fullName: user.username,
        email: user.email
      }));
    }
  }, [user]);

  const gstRate = 0.18;
  const gstAmount = cartTotal * gstRate;
  const grandTotal = cartTotal + gstAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!billingInfo.fullName) errors.fullName = "Full name is required";
    if (!billingInfo.email) errors.email = "Email is required";
    if (!billingInfo.phone) errors.phone = "Phone number is required";
    if (!billingInfo.address) errors.address = "Address is required";
    if (!billingInfo.city) errors.city = "City is required";
    if (!billingInfo.state) errors.state = "State is required";
    if (!billingInfo.zipCode) errors.zipCode = "ZIP code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your checkout.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) return;
    if (!validateForm()) {
      toast({
        title: "Information Required",
        description: "Please fill in all mandatory billing details.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(grandTotal),
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) throw new Error(orderData.message);

      // Load SDK
      if (!(window as any).Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopMyBarcode",
        description: `Order for ${cartCount} Barcodes`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Verify & Save with Billing Info
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?.id,
              packageName: cart.map(i => `${i.name} (${i.count})`).join(", "),
              quantity: cart.reduce((s, i) => s + i.quantity, 0),
              totalPrice: grandTotal,
              isCart: true,
              items: cart,
              billingDetails: billingInfo
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            setLocation("/dashboard?checkout=success");
          } else {
            toast({ title: "Payment Failed", description: verifyData.message, variant: "destructive" });
          }
        },
        image: `${window.location.origin}/new_logo.jpeg`,
        prefill: { 
          email: billingInfo.email, 
          name: billingInfo.fullName,
          contact: billingInfo.phone
        },
        theme: { color: "#f97316" },
        notes: {
          gstin: billingInfo.gstin,
          address: billingInfo.address
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to initiate payment", variant: "destructive" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-10">
            <Link href="/shop" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Industrial Checkout</h1>
              <p className="text-white/40 text-sm mt-1">Professional Billing & Secure Payment Processing</p>
            </div>
          </div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 glass-premium rounded-[2rem] border border-white/10"
            >
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-white/20" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Checkout is empty</h2>
              <p className="text-white/40 mb-8 max-w-sm mx-auto">Add barcode packages to your selection to proceed with checkout.</p>
              <Link href="/shop">
                <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-6 rounded-2xl font-bold">
                  Browse Solutions
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Forms */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Billing Details Section */}
                <section className="glass-premium rounded-[2.5rem] border border-white/10 p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <Building className="h-5 w-5 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-black">Billing Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">Full Name / Entity Name *</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input 
                          name="fullName"
                          value={billingInfo.fullName}
                          onChange={handleInputChange}
                          className={`pl-11 bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.fullName ? 'border-red-500/50' : ''}`} 
                          placeholder="John Doe Enterprises"
                        />
                      </div>
                      {formErrors.fullName && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input 
                          name="email"
                          type="email"
                          value={billingInfo.email}
                          onChange={handleInputChange}
                          className={`pl-11 bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.email ? 'border-red-500/50' : ''}`} 
                          placeholder="billing@company.com"
                        />
                      </div>
                      {formErrors.email && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input 
                          name="phone"
                          value={billingInfo.phone}
                          onChange={handleInputChange}
                          className={`pl-11 bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.phone ? 'border-red-500/50' : ''}`} 
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {formErrors.phone && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">GSTIN (Optional)</Label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input 
                          name="gstin"
                          value={billingInfo.gstin}
                          onChange={handleInputChange}
                          className="pl-11 bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50" 
                          placeholder="22AAAAA0000A1Z5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">Address Line *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input 
                          name="address"
                          value={billingInfo.address}
                          onChange={handleInputChange}
                          className={`pl-11 bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.address ? 'border-red-500/50' : ''}`} 
                          placeholder="Street, Building, Office No."
                        />
                      </div>
                      {formErrors.address && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">City *</Label>
                        <Input 
                          name="city"
                          value={billingInfo.city}
                          onChange={handleInputChange}
                          className={`bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.city ? 'border-red-500/50' : ''}`} 
                          placeholder="Mumbai"
                        />
                        {formErrors.city && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">State *</Label>
                        <Input 
                          name="state"
                          value={billingInfo.state}
                          onChange={handleInputChange}
                          className={`bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.state ? 'border-red-500/50' : ''}`} 
                          placeholder="Maharashtra"
                        />
                        {formErrors.state && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold tracking-widest">ZIP / PIN *</Label>
                        <Input 
                          name="zipCode"
                          value={billingInfo.zipCode}
                          onChange={handleInputChange}
                          className={`bg-white/5 border-white/10 h-14 rounded-xl focus:ring-orange-500/50 ${formErrors.zipCode ? 'border-red-500/50' : ''}`} 
                          placeholder="400001"
                        />
                        {formErrors.zipCode && <p className="text-red-400 text-[10px] font-bold uppercase">{formErrors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Selected Solutions Review */}
                <section className="glass-premium rounded-[2.5rem] border border-white/10 p-8 md:p-12">
                  <h2 className="text-xl font-black mb-8">Review Selected Solutions</h2>
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/5 group hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-6">
                            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.color || 'from-orange-500 to-orange-600'} flex items-center justify-center shadow-lg`}>
                              <ShieldCheck className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{item.name}</h3>
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">{item.count} Barcodes</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-10">
                            <div className="flex items-center bg-black/20 rounded-xl p-1 border border-white/5">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"><Minus className="h-3 w-3" /></button>
                              <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"><Plus className="h-3 w-3" /></button>
                            </div>
                            <div className="text-right min-w-[100px]">
                              <p className="text-lg font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                              <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors mt-1">Remove</button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              </div>

              {/* Right Column: Order Summary & Checkout */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                <div className="glass-premium rounded-[2.5rem] border border-orange-500/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Review & Checkout</h3>
                    <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Instant Digital Delivery</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-white/40">
                        <span>Subtotal</span>
                        <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-white/40">
                        <span>GST (18%)</span>
                        <span className="text-white">₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="h-px bg-white/10 my-6" />
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Total Payable</p>
                          <p className="text-5xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-8 rounded-[1.5rem] bg-white text-black hover:bg-white/90 font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {isCheckingOut ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="h-6 w-6" />
                          Complete Payment
                        </>
                      )}
                    </Button>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4" /> 256-Bit SSL Secured
                      </div>
                      <div className="flex items-center gap-3 text-white/40 font-bold text-xs uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" /> GST Invoice Included
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex gap-4 items-start">
                    <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">Need Assistance?</p>
                      <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                        Our compliance team is available 24/7. Reach out via support dashboard for priority assistance with your purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
