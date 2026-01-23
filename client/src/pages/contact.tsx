import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <div className="premium-bg opacity-40" />
      <Navbar />

      <section className="relative pt-40 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading text-glow"
          >
            Contact <span className="text-orange-500">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Have questions? Our global support team is ready to help 24/7.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-heading font-bold text-white mb-8">Get in Touch</h2>
              <p className="text-gray-400 mb-12 text-lg">
                Whether you need help with your order, have technical questions, or just want to explore partnership opportunities, we're here for you.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Phone, title: "Phone Support", info: "+91 62892 18265", sub: "" },
                  { icon: Mail, title: "Email Us", info: "support@shopmybarcode.com", sub: "Online Support" },
                  { icon: MapPin, title: "Headquarters", info: "Kolkata, West Bengal, India", sub: "(2nd Floor, 23A, Royd Street, Kolkata - 700016,West Bengal, India)" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-14 h-14 glass-premium rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 group-hover:border-orange-500/50 transition-colors">
                      <item.icon size={26} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl mb-1">{item.title}</h3>
                      <p className="text-orange-400 font-medium">{item.info}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <div className="glass-premium p-8 md:p-10 rounded-3xl border border-white/10 glow-border relative z-20">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageSquare className="text-orange-500" /> Send a Message
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">First Name</label>
                    <Input placeholder="John" className="bg-white/5 border-white/10 text-white h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Last Name</label>
                    <Input placeholder="Doe" className="bg-white/5 border-white/10 text-white h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <Input type="email" placeholder="john@company.com" className="bg-white/5 border-white/10 text-white h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <Textarea placeholder="How can we help you today?" className="bg-white/5 border-white/10 text-white min-h-[150px] resize-none p-4" />
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-orange-900/20">
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
