import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingCart, Package, Clock, CheckCircle2, XCircle, Loader2,
  Barcode, ChevronRight, Star, Zap, Shield, Crown, UserCog, ShieldCheck, MessageSquare
} from "lucide-react";
import { BARCODE_PACKAGES, SPECIAL_PACKAGE } from "@/lib/constants";
import { io } from "socket.io-client";

interface Order {
  _id: string;
  packageName: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  ownerNote?: string;
  createdAt: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Barcode: <Barcode className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  ShoppingCart: <ShoppingCart className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
};

// Combine all packages for checkout logic
const ALL_PACKAGES = [...BARCODE_PACKAGES, SPECIAL_PACKAGE];

function StatusBadge({ status }: { status: Order["status"] }) {
  const config = {
    Pending: { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: <Clock className="h-3 w-3" /> },
    Processing: { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    Completed: { color: "text-green-400 bg-green-500/10 border-green-500/20", icon: <CheckCircle2 className="h-3 w-3" /> },
    Cancelled: { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="h-3 w-3" /> },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.icon} {status}
    </span>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "buy">("orders");

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Fetch orders
  const fetchOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders/${user.id}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (user) {
      const socket = io();
      socket.emit("join_user_room", user.id);
      
      socket.on("owner_note_updated", (updatedOrder: Order) => {
        setOrders((prev) => 
          prev.map(o => o._id === updatedOrder._id ? { ...o, ownerNote: updatedOrder.ownerNote } : o)
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedPkg || !user) return;
    const pkg: any = ALL_PACKAGES.find((p) => p.id === selectedPkg)!;
    
    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        count: pkg.count,
        quantity: 1,
        color: pkg.shopColor || pkg.color
      });
    }
    
    setLocation("/checkout");
  };

  function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  }

  if (!isAuthenticated) return null;

  const selectedPackage : any = ALL_PACKAGES.find((p) => p.id === selectedPkg);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="premium-bg opacity-60" />
      <div className="orb-extra-1" />
      <div className="orb-extra-2" />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative h-14 w-14 rounded-2xl p-[2px] bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 bg-[length:200%_200%] shadow-lg shadow-orange-500/30 flex-shrink-0"
            >
              <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-xl">
                    {user?.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                Welcome back, <span className="text-orange-400">{user?.username}</span>!
              </h1>
              <p className="text-white/40 text-sm mt-1">{user?.email}</p>
            </div>
            <Link href="/profile" className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl glass-premium border border-orange-500/20 text-sm text-orange-400 hover:border-orange-500/50 hover:text-orange-300 transition-all">
              <UserCog className="h-4 w-4" /> Edit Profile
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Orders", value: orders.length, icon: <ShoppingCart className="h-4 w-4" /> },
              { label: "Completed", value: orders.filter(o => o.status === "Completed").length, icon: <CheckCircle2 className="h-4 w-4" /> },
              { label: "Pending", value: orders.filter(o => o.status === "Pending").length, icon: <Clock className="h-4 w-4" /> },
              { label: "Total Spent", value: `₹${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}`, icon: <Star className="h-4 w-4" /> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-premium rounded-2xl p-4 border border-orange-500/20"
              >
                <div className="flex items-center gap-2 text-orange-400 mb-1">{stat.icon}<span className="text-xs text-white/40">{stat.label}</span></div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
          {([
            { id: "orders", label: "My Orders", icon: <Package className="h-4 w-4" /> },
            { id: "buy", label: "Buy Barcodes", icon: <ShoppingCart className="h-4 w-4" /> },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-4" />
                  <p className="text-white/40">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="glass-premium rounded-3xl border border-orange-500/20 p-16 text-center">
                  <Package className="h-16 w-16 text-orange-500/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
                  <p className="text-white/40 mb-6">Start by purchasing a barcode package for your products.</p>
                  <button
                    onClick={() => setActiveTab("buy")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500 transition-all"
                  >
                    <ShoppingCart className="h-4 w-4" /> Browse Packages
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative glass-premium rounded-2xl border border-white/5 hover:border-orange-500/40 transition-all duration-300 p-5 md:p-6 flex flex-col gap-5 overflow-hidden shadow-lg"
                    >
                      {/* Premium animated background glow on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      {/* Top Row: Details & Price */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 z-10 w-full relative">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 w-full md:w-auto">
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <Barcode className="h-7 w-7 text-orange-400" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-white tracking-wide">{order.packageName}</p>
                            <p className="text-xs text-white/50 mt-1 font-medium flex items-center gap-2">
                              <span>Qty: {order.quantity}</span> 
                              <span className="w-1 h-1 rounded-full bg-white/30" /> 
                              <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full md:w-auto p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
                          <StatusBadge status={order.status} />
                          <div className="text-right">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Total Amount</div>
                            <p className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">₹{order.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Row: Actions & Notes */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 z-10 pt-5 border-t border-white/10 mt-1">
                        <a
                          href={`https://wa.me/919051226059?text=${encodeURIComponent(`Hi, I just placed an order for ${order.packageName}. Here are my product details for the barcodes:`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="relative overflow-hidden flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 hover:from-[#25D366]/20 hover:to-[#128C7E]/20 border border-[#25D366]/40 hover:border-[#25D366]/80 transition-all duration-300 group/wa shadow-[0_0_15px_rgba(37,211,102,0.1)] hover:shadow-[0_0_20px_rgba(37,211,102,0.25)]"
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover/wa:translate-x-[200%] transition-transform duration-[1500ms] ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                          
                          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#25D366] group-hover/wa:scale-110 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(37,211,102,0.3)]">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                          </svg>
                          <span className="text-sm font-bold text-[#4ade80] tracking-wide">Share Your Product Details Here</span>
                        </a>

                        {order.ownerNote && (
                          <div className="flex-1 flex items-start sm:items-center gap-3 bg-gradient-to-r from-orange-500/10 to-orange-500/0 rounded-xl p-3.5 border border-orange-500/20 shadow-inner">
                            <MessageSquare className="h-4 w-4 text-orange-400 shrink-0 mt-0.5 sm:mt-0" />
                            <div>
                              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-0.5 opacity-90 block">Update from Admin</p>
                              <p className="text-sm text-white/90 font-medium leading-tight">{order.ownerNote}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "buy" && (
            <motion.div
              key="buy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {checkoutSuccess ? (
                <div className="text-center py-24">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                    <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2">Order Placed!</h3>
                  <p className="text-white/40">Your barcode order has been received. We'll process it shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">Choose a Package</h2>
                  <p className="text-white/40 mb-8">All barcodes have lifetime validity and instant delivery.</p>

                  {/* Package Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {ALL_PACKAGES.map((pkg: any, i) => (
                      <motion.button
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setSelectedPkg(selectedPkg === pkg.id ? null : pkg.id)}
                        className={`relative text-left glass-premium rounded-2xl border p-6 transition-all duration-300 ${pkg.border} ${
                          selectedPkg === pkg.id ? "ring-2 ring-orange-500/60 scale-[1.02]" : "hover:scale-[1.01]"
                        } bg-gradient-to-br ${pkg.color}`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
                            Most Popular
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-white/10 text-orange-400">
                            {IconMap[pkg.iconName || (pkg.id === 'unlimited' ? 'Crown' : 'Barcode')]}
                          </div>
                          <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        </div>
                        <p className="text-3xl font-heading font-bold text-white mb-1">₹{pkg.price.toLocaleString()}</p>
                        <p className="text-white/40 text-sm mb-4">{pkg.count} barcode{pkg.count !== 1 ? "s" : ""}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((f: string) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                              <Shield className="h-3.5 w-3.5 text-orange-400 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                        {selectedPkg === pkg.id && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 className="h-5 w-5 text-orange-400" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Checkout Panel */}
                  <AnimatePresence>
                    {selectedPkg && selectedPackage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="glass-premium rounded-3xl border border-orange-500/30 p-8"
                      >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-orange-400" /> Checkout
                        </h3>

                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <span className="text-white/70">Package</span>
                              <span className="font-semibold text-white">{selectedPackage.name}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <span className="text-white/70">Barcodes</span>
                              <span className="font-semibold text-white">{selectedPackage.count} per unit</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <span className="text-white/70">Quantity</span>
                              <div className="flex items-center gap-3">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center justify-center">−</button>
                                <span className="font-bold text-white w-6 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center justify-center">+</button>
                              </div>
                            </div>
                          </div>

                          <div className="md:w-64 flex flex-col justify-between gap-4">
                            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl text-center">
                              <p className="text-white/50 text-sm mb-1">Subtotal</p>
                              <p className="text-2xl font-bold text-white">₹{(selectedPackage.price * quantity).toLocaleString()}</p>
                              <div className="h-px bg-white/10 my-2" />
                              <p className="text-white/50 text-xs">GST (18%): ₹{(selectedPackage.price * quantity * 0.18).toLocaleString()}</p>
                              <p className="text-xl font-heading font-bold text-orange-400 mt-2">Total: ₹{(selectedPackage.price * quantity * 1.18).toLocaleString()}</p>
                            </div>
                            <button
                              onClick={handleAddToCart}
                              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="h-5 w-5" /> Add to Cart <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
