import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Barcode {
  barcode: string;
  productName: string;
  brandName: string;
  country?: string;
  category: string;
  description?: string;
  price: number;
  status: string;

  // Clothes
  color?: string;
  material?: string;
  size?: string;
  imageUrl?: string;
  barcodeImageUrl?: string;

  // Extended fields
  language?: string;
  websiteLink?: string;
  amazonLink?: string;
  sku?: string;
  modelNumber?: string;
  issueDate?: string;
  createdAt?: string;

  // Size/Weight
  width?: string;
  height?: string;
  length?: string;
  weight?: string;
  fluid?: string;
  pieces?: string;

  // Nutrition
  servingSize?: string;
  servingsPer?: string;
  calories?: string;
  fatCalories?: string;
  totalFat?: string;
  saturatedFat?: string;
  transFat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  totalCarbohydrate?: string;
  dietaryFiber?: string;
  sugar?: string;
  protein?: string;
  ingredients?: string;

  // Publication
  author?: string;
  pageCount?: string;
  binding?: string;
  releaseYear?: string;
  published?: string;
  format?: string;
  runTime?: string;
}

export default function VerifyPage() {
  const [searchCode, setSearchCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");

  const { data: barcode, isError, isLoading } = useQuery<Barcode>({
    queryKey: [`/api/barcodes/${submittedCode}`],
    enabled: !!submittedCode,
    retry: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedCode(searchCode);
  };

  // Helper to safely format values
  const formatValue = (key: keyof Barcode, value: any) => {
    if (value === undefined || value === null || value === "") return null;
    if (key === 'price') return `₹${value}`;
    if (key === 'issueDate') return new Date(value).toLocaleDateString();
    return value;
  };

  // Define groups of fields to display
  const fieldGroups = [
    {
      title: "Product Details",
      fields: [
        { label: "Product Name", key: "productName" },
        { label: "Brand", key: "brandName" },
        { label: "Product Code", key: "barcode" },
        { label: "Country", key: "country" },
        { label: "Language", key: "language" },
        { label: "Category", key: "category" },
        { label: "Product Description", key: "description" },
        { label: "Model Number", key: "modelNumber" },
        { label: "SKU", key: "sku" },
        { label: "Price", key: "price" },
        { label: "Website", key: "websiteLink" },
        { label: "Amazon Link", key: "amazonLink" },
        { label: "Date of Registration", key: "issueDate" },
        { label: "Status", key: "status" },
      ]
    },
    {
      title: "Clothes Details",
      fields: [
        { label: "Color", key: "color" },
        { label: "Material", key: "material" },
        { label: "Size", key: "size" },
      ]
    },
    {
      title: "Dimensions & Unit",
      fields: [
        { label: "Width", key: "width" },
        { label: "Height", key: "height" },
        { label: "Length", key: "length" },
        { label: "Weight", key: "weight" },
        { label: "Fluid", key: "fluid" },
        { label: "Pieces", key: "pieces" },
      ]
    },
    {
      title: "Nutrition Information",
      fields: [
        { label: "Serving Size", key: "servingSize" },
        { label: "Servings Per Container", key: "servingsPer" },
        { label: "Calories", key: "calories" },
        { label: "Fat Calories", key: "fatCalories" },
        { label: "Total Fat", key: "totalFat" },
        { label: "Saturated Fat", key: "saturatedFat" },
        { label: "Trans Fat", key: "transFat" },
        { label: "Cholesterol", key: "cholesterol" },
        { label: "Sodium", key: "sodium" },
        { label: "Potassium", key: "potassium" },
        { label: "Total Carbohydrate", key: "totalCarbohydrate" },
        { label: "Dietary Fiber", key: "dietaryFiber" },
        { label: "Sugar", key: "sugar" },
        { label: "Protein", key: "protein" },
        { label: "Ingredients", key: "ingredients" },
      ]
    },
    {
      title: "Publication / Media",
      fields: [
        { label: "Author", key: "author" },
        { label: "Page Count", key: "pageCount" },
        { label: "Binding", key: "binding" },
        { label: "Release Year", key: "releaseYear" },
        { label: "Published", key: "published" },
        { label: "Format", key: "format" },
        { label: "Run Time", key: "runTime" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <div className="premium-bg opacity-30" />
      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center">

        <div className="w-full max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-6 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md"
          >
            <ShieldCheck size={20} />
            Global Verification Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 text-glow"
          >
            Verify <span className="text-orange-500">Authenticity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            Enter your product Barcode or GTIN to instantly validate its registration status against our global secure database.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xl mb-16 relative"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
          <form onSubmit={handleSearch} className="flex gap-2 relative z-10 p-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
            <Input
              placeholder="Enter Barcode / GTIN..."
              className="h-14 text-lg bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <Button
              type="submit"
              className="h-14 px-10 bg-orange-600 hover:bg-orange-500 text-white text-lg rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]"
            >
              <Search size={20} className="mr-2" /> Verify
            </Button>
          </form>
        </motion.div>

        {/* Results Area */}
        <div className="w-full max-w-4xl">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-orange-400">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p>Searching Registry...</p>
            </div>
          )}

          {isError && (
            <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-red-600 font-bold text-lg mb-2">Product Not Found</h3>
              <p className="text-gray-600">The barcode <strong>{submittedCode}</strong> does not exist in our registry.</p>
            </div>
          )}

          {barcode && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Product Verification Details</h2>
                {barcode.status === 'Active' && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border border-green-200">
                    Verified
                  </span>
                )}
              </div>

              {/* Dynamic Fields Flattening */}
              {(() => {
                const allRows: Array<{ label: string; value: React.ReactNode; key: string }> = [];

                // 1. Product Image
                allRows.push({
                  label: "Product Image",
                  key: "product-image",
                  value: barcode.imageUrl ? (
                    <img
                      src={barcode.imageUrl}
                      alt="Product"
                      className="h-48 w-48 object-contain border border-gray-100 rounded-sm"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image available</span>
                  ),
                });

                // 2. Barcode Image
                allRows.push({
                  label: "Bar Code",
                  key: "barcode-image",
                  value: barcode.barcodeImageUrl ? (
                    <img
                      src={barcode.barcodeImageUrl}
                      alt="Barcode"
                      className="h-24 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No barcode image available</span>
                  ),
                });

                // 3. Dynamic Fields
                fieldGroups.forEach((group) => {
                  group.fields.forEach((field) => {
                    const val = barcode[field.key as keyof Barcode];
                    if (val !== undefined && val !== null && val !== "") {
                      allRows.push({
                        label: field.label,
                        key: field.key,
                        value: formatValue(field.key as keyof Barcode, val),
                      });
                    }
                  });
                });

                return allRows.map((row, index) => (
                  <div
                    key={row.key}
                    className={`grid grid-cols-1 md:grid-cols-12 border-t first:border-t-0 border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <div className="md:col-span-4 p-4 border-r border-gray-100 font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center">
                      {row.label}
                    </div>
                    <div className="md:col-span-8 p-4 text-gray-900 text-base font-medium flex items-center min-h-[56px] break-all">
                      {row.value}
                    </div>
                  </div>
                ));
              })()}
            </div>

          )}
        </div>
      </main >
    </div >
  );
}

