import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Process } from "@/components/home/process";
import { Industries } from "@/components/home/industries";
import { Testimonials } from "@/components/home/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <Industries />
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
             <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6">Ready to Scale Your Product?</h2>
             <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10">
               Get your official retail barcodes today and start selling in stores and online marketplaces worldwide.
             </p>
             <button className="bg-white text-primary font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all">
               Get Started Now
             </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
