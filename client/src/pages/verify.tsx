import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Search, Barcode, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Verify() {
  const [barcode, setBarcode] = useState("");
  const [searched, setSearched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    
    setLoading(true);
    // Simulate search
    setTimeout(() => {
      setIsValid(barcode.length === 12 || barcode.length === 13);
      setSearched(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
                Verify Your <span className="text-primary">Barcode</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Check if a barcode is authentic and view its product details.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onSubmit={handleSearch}
              className="space-y-6"
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {/* <Barcode className="h-5 w-5" /> */}
                </div>
                <input
                  type="text"
                  placeholder="Enter barcode (13 digits)"
                  value={barcode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 13) setBarcode(val);
                  }}
                  className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                />
              </div>
              
              <button
                type="submit"
                disabled={!barcode || loading}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {loading ? "Searching..." : "Verify Barcode"}
              </button>
            </motion.form>

            {/* Results */}
            {searched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`mt-12 p-8 rounded-2xl border-2 ${
                  isValid
                    ? "bg-secondary/5 border-secondary"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {isValid ? (
                      <CheckCircle className="h-8 w-8 text-secondary" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl mb-2">
                      {isValid ? "Valid Barcode" : "Invalid Barcode"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {isValid
                        ? `Barcode ${barcode} is valid and registered in our system.`
                        : "This barcode doesn't match our records or is invalid."}
                    </p>
                    
                    {isValid && (
                      <div className="space-y-4 pt-6 border-t border-secondary/20">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Barcode</p>
                            <p className="font-mono font-bold text-lg">{barcode}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <p className="font-bold text-secondary">Active</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-heading font-bold text-3xl text-center mb-12">How Barcode Verification Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "Enter Barcode",
                  desc: "Input the 13-digit barcode you want to verify."
                },
                {
                  num: "02",
                  title: "Instant Verification",
                  desc: "Our system checks the barcode against our verified database."
                },
                {
                  num: "03",
                  title: "View Results",
                  desc: "Get immediate confirmation and product details if available."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-heading font-bold text-primary mb-4">{item.num}</div>
                  <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready for Your Own Barcode?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10">
              Get instant, lifetime-valid barcodes for your products today.
            </p>
            <button className="bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105">
              Apply Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
