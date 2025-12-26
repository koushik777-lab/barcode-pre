import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 62892 18265",
      subtext: "Available 9 AM - 6 PM IST"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@shopmybarcode.com",
      subtext: "Respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "Mumbai, India",
      subtext: "Pan-India service"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon - Fri, 9 AM - 6 PM",
      subtext: "Saturday: 10 AM - 2 PM"
    }
  ];

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
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions? Our team is here to help. Reach out and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-2xl border border-border text-center hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{info.title}</h3>
                  <p className="font-bold text-foreground mb-1">{info.details}</p>
                  <p className="text-sm text-muted-foreground">{info.subtext}</p>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-6 p-8 md:p-12 bg-muted/30 rounded-2xl border border-border"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                    >
                      <option value="">Select subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="barcode">Barcode Request</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-secondary/10 border border-secondary rounded-lg text-secondary font-bold text-center"
                  >
                    ✓ Thank you! We'll be in touch soon.
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </motion.form>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-heading font-bold text-3xl text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: "How long does it take to get my barcode?",
                  a: "We deliver barcodes instantly via email after approval. You'll get high-resolution images ready to print."
                },
                {
                  q: "Are your barcodes globally accepted?",
                  a: "Yes! Our barcodes are verified and accepted by retailers across India and internationally."
                },
                {
                  q: "What if I need to update product information?",
                  a: "You can easily edit product details anytime using your exclusive online dashboard."
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white rounded-lg border border-border"
                >
                  <h3 className="font-heading font-bold mb-3 text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
