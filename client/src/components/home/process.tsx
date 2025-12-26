import { FileText, Search, PackageCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Apply Online",
    description: "Fill out our simple application form with your product details in just 2 minutes."
  },
  {
    icon: Search,
    title: "Verification",
    description: "Our team verifies your product details to ensure global uniqueness and compliance."
  },
  {
    icon: PackageCheck,
    title: "Receive Barcodes",
    description: "Get your barcodes and certificate via email instantly upon approval."
  },
  {
    icon: Rocket,
    title: "Go Live",
    description: "Print labels and start selling. Your product appears on Google within 14 days."
  }
];

export function Process() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              Get Your Barcodes in <br />
              <span className="text-primary">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We've streamlined the process to be as fast and hassle-free as possible. No paperwork, no waiting weeks.
            </p>
            <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-2xl">
              <h4 className="font-bold text-secondary mb-2">Need help?</h4>
              <p className="text-sm text-muted-foreground mb-4">Our expert support team can guide you through the process.</p>
              <button className="text-sm font-bold text-secondary hover:underline">Chat with Support →</button>
            </div>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
             {/* Connecting line for desktop - simplified for now */}
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-start gap-4 p-6 rounded-2xl border border-border bg-white shadow-sm z-10">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
