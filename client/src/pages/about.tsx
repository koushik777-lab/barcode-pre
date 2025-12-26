import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Award, Users, Globe, TrendingUp } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Users, label: "Happy Clients", value: "5,000+" },
    { icon: Globe, label: "Countries Served", value: "10+" },
    { icon: Award, label: "Years Experience", value: "5+" },
    { icon: TrendingUp, label: "Success Rate", value: "99.9%" }
  ];

  const values = [
    {
      title: "Trust & Authenticity",
      description: "We provide genuine, verified barcodes that work across all major retail platforms globally."
    },
    {
      title: "Customer-Centric",
      description: "Every client gets personalized guidance to choose the perfect barcode solution for their needs."
    },
    {
      title: "Innovation & Efficiency",
      description: "Instant delivery, lifetime validity, and zero renewal fees—that's our guarantee."
    },
    {
      title: "Support Excellence",
      description: "Our expert team is always ready to assist you with prompt and reliable support."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32">
        {/* Hero Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
                About <span className="text-primary">Shop My Barcode</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Since 2019, we've been the trusted partner for businesses seeking high-quality, authentic barcodes and QR solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading font-bold text-3xl mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Established in 2019, Shop My Barcode emerged from a simple vision: to revolutionize how businesses identify and track their products. We saw a gap in the market for reliable, affordable, and customer-friendly barcode services.
                  </p>
                  <p>
                    Today, we're a premier provider of high-quality private barcodes, starting with the distinctive 853 series. We proudly serve businesses across India and around the globe, helping them streamline product identification with ease and efficiency.
                  </p>
                  <p>
                    What started as a small operation has grown into a trusted solution serving over 5,000 businesses. We remain committed to our core mission: providing authentic, efficient, and hassle-free barcode solutions.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 p-12 rounded-2xl border border-border"
              >
                <div className="space-y-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <stat.icon className="h-8 w-8 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-foreground">{stat.value}</h3>
                        <p className="text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-12 bg-background rounded-2xl border border-border"
              >
                <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower businesses of all sizes with authentic, affordable, and innovative barcode solutions that streamline product identification and enhance operational efficiency.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-12 bg-background rounded-2xl border border-border"
              >
                <h3 className="font-heading font-bold text-2xl mb-4 text-secondary">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the global leader in barcode solutions, recognized for our commitment to authenticity, customer success, and continuous innovation in product identification technology.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-border hover:border-primary/30 transition-all"
                >
                  <h3 className="font-heading font-bold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Join Thousands of Happy Customers</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10">
              Start your journey with authentic barcodes today.
            </p>
            <button className="bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105">
              Get Started Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
