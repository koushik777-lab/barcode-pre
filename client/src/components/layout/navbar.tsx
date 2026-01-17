import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ApplyBarcodeModal } from "@/components/apply-barcode-modal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <nav
        className={cn(
          "transition-all duration-300 z-50",
          scrolled
            ? "fixed top-2 left-4 right-4 glass-premium py-3 rounded-full"
            : "fixed top-0 left-0 right-0 bg-transparent border-transparent py-5 border-b"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg group-hover:opacity-90 transition-opacity">
              {/* Logo updated to use barco.jpg as requested previously */}
              <img
                src="/barco.jpg"
                alt="ShopMyBarcode Logo"
                className="h-full w-full object-cover"
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
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
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
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    setIsOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  Apply for Barcode
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ApplyBarcodeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}

