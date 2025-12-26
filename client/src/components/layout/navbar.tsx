import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Barcode, Phone, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Verify Barcode", href: "/verify" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-border/50 shadow-sm py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Barcode className="h-6 w-6 text-primary" />
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
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-border">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Phone className="h-4 w-4" />
            </Button>
            <Button className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Apply for Barcode
            </Button>
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
            className="md:hidden bg-white border-b border-border overflow-hidden"
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
              <Button className="w-full mt-4">Apply for Barcode</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
