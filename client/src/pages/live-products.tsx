import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { GradientText } from "@/components/ui/gradient-text";

interface Barcode {
    _id: string;
    barcode: string;
    productName: string;
    brandName: string;
    imageUrl?: string;
    barcodeImageUrl?: string;
    liveStatus?: string;
}

export default function LiveProducts() {
    const { data: barcodes, isLoading } = useQuery<Barcode[]>({
        queryKey: ["/api/barcodes"],
    });

    const liveProducts = (barcodes as any[])?.filter(b => b.liveStatus === 'LIVE' && b.imageUrl && b.imageUrl.trim() !== '') || [];

    return (
        <div className="min-h-screen bg-background text-foreground relative flex flex-col">
            <div className="premium-bg opacity-50" />
            <Navbar />

            <main className="relative z-10 flex-grow pt-32 pb-20 px-4 md:px-6">
                <div className="container mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-glow">
                            Explore <GradientText variant="glow-strong">Live Products</GradientText>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Discover our collection of officially verified and Google-indexed products in an elegant masonry gallery.
                        </p>
                    </AnimatedSection>

                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="h-12 w-12 text-orange-500 animate-spin opacity-80" />
                            <p className="mt-4 text-orange-400/80 font-medium animate-pulse">
                                Loading live products...
                            </p>
                        </div>
                    ) : liveProducts.length === 0 ? (
                        <AnimatedSection>
                            <div className="glass-premium p-16 rounded-3xl border border-orange-500/40 text-center glow-border-strong relative max-w-2xl mx-auto">
                                <h3 className="text-3xl font-heading font-bold text-white mb-4">No Products Yet</h3>
                                <p className="text-gray-300 mb-8 text-lg">Check back later for newly verified and indexed products.</p>
                                <Link href="/">
                                    <button className="glass-premium px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 hover:glow-border-strong transition-all">
                                        Return Home
                                    </button>
                                </Link>
                            </div>
                        </AnimatedSection>
                    ) : (
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                            {liveProducts.map((product, i) => (
                                <AnimatedSection
                                    key={product._id}
                                    delay={i * 0.05}
                                    className="break-inside-avoid"
                                >
                                    <div
                                        className="relative rounded-2xl p-[2px] overflow-hidden group hover:shadow-[0_0_30px_rgba(250,146,82,0.3)] transition-all duration-300 cursor-pointer"
                                        onClick={() => window.open(`https://www.google.com/search?q=${product.barcode}`, '_blank')}
                                    >
                                        <div className="animated-border-bg" />

                                        <div className="relative z-10 bg-[#121a28] rounded-[14px] flex flex-col h-full overflow-hidden border border-orange-500/10 hover:border-transparent transition-colors">

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-50 backdrop-blur-sm pointer-events-none">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                                                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 border border-orange-500/50">
                                                        <Search className="w-8 h-8 text-orange-400" />
                                                    </div>
                                                    <span className="text-white font-bold text-lg text-glow">View on Google</span>
                                                </div>
                                            </div>

                                            {/* Header: Barcode Number */}
                                            <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                                                <h3 className="text-lg font-heading font-bold text-orange-400 truncate text-glow-strong">
                                                    {product.barcode}
                                                </h3>
                                            </div>

                                            <div className="p-5 flex flex-col gap-5">
                                                {/* Product Front Image */}
                                                {product.imageUrl && (
                                                    <div className="relative w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center min-h-[160px]">
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={`Front of ${product.productName}`}
                                                            className="w-full h-auto object-contain max-h-[250px] mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}

                                                {/* Barcode Image */}
                                                {product.barcodeImageUrl && (
                                                    <div className="relative w-full bg-white/10 backdrop-blur-sm flex items-center justify-center p-3 rounded-xl">
                                                        <img
                                                            src={product.barcodeImageUrl}
                                                            alt={`Barcode ${product.barcode}`}
                                                            className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}

                                                {/* Text Details */}
                                                <div className="space-y-2 mt-1">
                                                    <h4 className="font-heading font-bold text-white text-lg line-clamp-2 leading-snug group-hover:text-orange-100 transition-colors">
                                                        {product.productName}
                                                    </h4>
                                                    <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
                                                        {product.brandName}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
