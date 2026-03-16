import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ApplyBarcodeModal } from "@/components/apply-barcode-modal";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [, setLocation] = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle verification messages from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");

    if (verified) {
      if (verified === "success") {
        toast({
          title: "Email Verified!",
          description: "Your account is now active. You can now log in.",
          variant: "default",
        });
        setIsAuthModalOpen(true); // Open login modal automatically
        setVerificationSuccess(true);
      } else if (verified === "invalid") {
        toast({
          title: "Verification Failed",
          description: "The verification link is invalid or has expired.",
          variant: "destructive",
        });
        setVerificationSuccess(false);
      } else if (verified === "already") {
        toast({
          title: "Already Verified",
          description: "Your email is already verified. Please sign in.",
          variant: "default",
        });
        setIsAuthModalOpen(true);
        setVerificationSuccess(false);
      } else {
        setVerificationSuccess(false);
      }

      // Clear the query parameters without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [toast]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Verify Barcode", href: "/verify" },
    { name: "LIVE PRODUCTS", href: "/live-products" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setLocation("/");
  };

  return (
    <>
      <nav
        className={cn(
          "transition-all duration-300 z-50",
          scrolled || isOpen
            ? "fixed top-2 left-4 right-4 glass-premium py-3"
            : "fixed top-0 left-0 right-0 bg-transparent border-transparent py-5 border-b",
          scrolled && !isOpen ? "rounded-full" : "rounded-2xl"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-16 w-auto group-hover:opacity-90 transition-opacity">
              <img
                src="/new_logo.jpeg"
                alt="ShopMyBarcode Logo"
                className="h-full w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-lg text-foreground tracking-tight">
                ShopMyBarcode
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Official Retail Codes
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
              <Link href="/checkout" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              {isAuthenticated && user ? (
                /* User menu when logged in */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 glass-premium px-3 py-2 rounded-full border border-orange-500/30 hover:border-orange-500/60 transition-all"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white max-w-[80px] truncate">{user.username}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-white/50 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 glass-premium rounded-xl border border-orange-500/20 overflow-hidden shadow-xl"
                      >
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-xs text-white/40">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-orange-400" />
                          My Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="h-4 w-4 text-orange-400" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Login + Apply buttons when not logged in */
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 font-semibold"
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    Apply for Barcode
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/50 backdrop-blur-sm border-t border-border/50 overflow-hidden"
            >
              <div className="container px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-foreground py-2 border-b border-border/50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/checkout"
                  className="flex items-center justify-between text-base font-medium text-foreground py-2 border-b border-border/50"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Checkout
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated && user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-base font-medium text-orange-400 py-2 border-b border-border/50">
                      <LayoutDashboard className="h-4 w-4" /> My Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-base font-medium text-orange-400 py-2 border-b border-border/50">
                      <User className="h-4 w-4" /> Profile Settings
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-base font-medium text-red-400 py-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-orange-500/40 text-orange-400"
                      onClick={() => { setIsOpen(false); setIsAuthModalOpen(true); }}
                    >
                      Login / Sign Up
                    </Button>
                    <Button
                      className="w-full mt-2"
                      onClick={() => { setIsOpen(false); setIsApplyModalOpen(true); }}
                    >
                      Apply for Barcode
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ApplyBarcodeModal open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen} />
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={(open) => {
          setIsAuthModalOpen(open);
          if (!open) setVerificationSuccess(false);
        }} 
        verifiedSuccess={verificationSuccess}
      />

      {/* Celebration Effect */}
      <AnimatePresence>
        {verificationSuccess && (
          <div className="fixed inset-0 pointer-events-none z-[110] flex items-center justify-center">
            {/* Confetti-like particles using CSS and Framer Motion */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  rotate: 0 
                }}
                animate={{ 
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800 - 200,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2.5, 
                  ease: "easeOut",
                  delay: Math.random() * 0.2
                }}
                className={cn(
                  "absolute w-3 h-3 rounded-sm",
                  ["bg-orange-400", "bg-emerald-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400"][i % 5]
                )}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
