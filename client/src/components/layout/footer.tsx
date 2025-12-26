import { Barcode, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Barcode className="h-6 w-6 text-primary" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                ShopMyBarcode
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premier provider of high-quality private barcodes. We help businesses streamline product identification with ease and efficiency.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-white border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Retail Barcodes</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">QR Code Generation</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Product Verification</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">ISBN Codes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Business Park, Sector 45<br />Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+916289218265" className="hover:text-primary transition-colors">+91 62892 18265</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:support@shopmybarcode.com" className="hover:text-primary transition-colors">support@shopmybarcode.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopMyBarcode. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
