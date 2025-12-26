import { Wheat, Bean, Droplets, Milk, Coffee, Snowflake, Candy, Dumbbell, Sparkles, Shirt, Car, PenTool } from "lucide-react";

const industries = [
  { icon: Wheat, name: "Spices & Condiments" },
  { icon: Bean, name: "Grains & Pulses" },
  { icon: Droplets, name: "Edible Oils" },
  { icon: Milk, name: "Dairy Products" },
  { icon: Coffee, name: "Beverages" },
  { icon: Snowflake, name: "Frozen Foods" },
  { icon: Candy, name: "Sweets" },
  { icon: Dumbbell, name: "Health & Nutrition" },
  { icon: Sparkles, name: "Personal Care" },
  { icon: Shirt, name: "Apparel" },
  { icon: Car, name: "Automotive" },
  { icon: PenTool, name: "Stationery" },
];

export function Industries() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From food products to automotive parts, our barcodes are used across diverse sectors.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {industries.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-background rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group cursor-default"
            >
              <item.icon className="h-8 w-8 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-center text-foreground/80 group-hover:text-foreground transition-colors">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
