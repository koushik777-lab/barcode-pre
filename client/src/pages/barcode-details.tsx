import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Barcode {
    barcode: string;
    productName: string;
    brandName: string;
    country?: string;
    category: string;
    description?: string;
    price: number;
    status: string;
    imageUrl?: string;
    barcodeImageUrl?: string;
    language?: string;
    modelNumber?: string;
    createdAt: string;
    author?: string;
    [key: string]: any;
}

export default function BarcodeDetailsPage() {
    const { code } = useParams();

    const { data: barcode, isError, isLoading } = useQuery<Barcode>({
        queryKey: [`/api/barcodes/${code}`],
    });

    // Fetch all barcodes to show in "Recent Posts" and "Related Posts"
    const { data: allBarcodes } = useQuery<Barcode[]>({
        queryKey: ['/api/barcodes'],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#242424] text-white font-sans flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !barcode) {
        return (
            <div className="min-h-screen bg-[#242424] text-white font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-bold mb-4">Barcode Not Found</h1>
                    <p className="text-gray-400">The requested barcode could not be found in our database.</p>
                </div>
            </div>
        );
    }

    const createdDate = barcode.createdAt ? new Date(barcode.createdAt) : new Date();
    const dateFormatted = format(createdDate, "MMMM d, yyyy");
    const yearStr = format(createdDate, "yyyy");
    const monthStr = format(createdDate, "MMMM");

    // Filter out some recent and related posts
    const recentBarcodes = allBarcodes?.filter(b => b.barcode !== barcode.barcode).slice(0, 5) || [];
    const relatedBarcodes = allBarcodes?.filter(b => b.barcode !== barcode.barcode && b.category === barcode.category).slice(0, 3) || [];

    const mainFields = [
        { label: "Product Name", value: barcode.productName },
        { label: "Brand", value: barcode.brandName },
        { label: "Product Code", value: barcode.barcode },
        { label: "Country", value: barcode.country },
        { label: "Language", value: barcode.language },
        { label: "Category", value: barcode.category },
        { label: "Model Number", value: barcode.modelNumber || "HL05" },
        { label: "Status", value: barcode.status === "Active" ? "Active" : "Inactive" }
    ].filter(f => f.value);

    return (
        <div className="min-h-screen bg-[#252525] text-white font-sans pb-20">
            <Navbar />

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8 max-w-7xl pt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column (Main Article) */}
                <article className="lg:col-span-8">
                    {/* Breadcrumbs */}
                    <div className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span>{yearStr}</span>
                        <span>/</span>
                        <span>{monthStr}</span>
                        <span>/</span>
                        <span className="text-gray-200">{barcode.productName} {barcode.barcode}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                        {barcode.productName.toUpperCase()} {barcode.barcode}
                    </h1>

                    <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 font-medium">
                        <span>{dateFormatted}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                            <span className="w-4 h-4 bg-gray-600 rounded-full inline-block"></span>
                            {barcode.author || "Admin"}
                        </span>
                    </div>

                    {/* Product Image */}
                    {barcode.imageUrl && (
                        <div className="mb-8 w-full bg-white rounded flex items-center justify-center p-4">
                            <img
                                src={barcode.imageUrl}
                                alt={barcode.productName}
                                className="max-h-[600px] w-auto object-contain"
                            />
                        </div>
                    )}

                    {/* Details Table */}
                    <div className="w-full border border-gray-700 rounded overflow-hidden mt-8 text-sm">
                        <div className="grid grid-cols-12 bg-[#1a1a1a] border-b border-gray-700 font-bold text-gray-300">
                            <div className="col-span-4 p-3 border-r border-gray-700 text-center">Title</div>
                            <div className="col-span-8 p-3 text-center">Details</div>
                        </div>

                        {/* Barcode Image Row */}
                        <div className="grid grid-cols-12 border-b border-gray-700 bg-[#252525]">
                            <div className="col-span-4 p-4 border-r border-gray-700 flex items-center font-medium">Bar Code</div>
                            <div className="col-span-8 p-4 bg-white flex items-center justify-center">
                                {barcode.barcodeImageUrl ? (
                                    <img src={barcode.barcodeImageUrl} alt="Barcode" className="h-[80px] object-contain" />
                                ) : (
                                    <span className="text-gray-900 font-mono text-xl">{barcode.barcode}</span>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Details Rows */}
                        {mainFields.map((field, idx) => (
                            <div key={field.label} className={`grid grid-cols-12 border-b border-gray-700 last:border-b-0 ${idx % 2 === 0 ? 'bg-[#252525]' : 'bg-[#2a2a2a]'}`}>
                                <div className="col-span-4 p-3 border-r border-gray-700 font-medium">{field.label}</div>
                                <div className="col-span-8 p-3 text-gray-300">{field.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Related Posts */}
                    {relatedBarcodes.length > 0 && (
                        <div className="mt-16">
                            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Related Posts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedBarcodes.map(rb => (
                                    <Link key={rb.barcode} href={`/barcode/${rb.barcode}`}>
                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-gray-600 transition-all">
                                            <h4 className="font-bold text-white mb-2 line-clamp-2">{rb.productName} {rb.barcode}</h4>
                                            <p className="text-xs text-gray-400 line-clamp-3">
                                                Title Details Bar Code Product Name {rb.productName} Brand {rb.brandName}...
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </article>

                {/* Right Sidebar */}
                <aside className="lg:col-span-4 flex flex-col gap-10">

                    {/* Search Box */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Search</h3>
                        <div className="flex">
                            <Input className="bg-[#1a1a1a] border-gray-700 rounded-r-none focus-visible:ring-0 text-white" placeholder="Search..." />
                            <Button className="bg-[#e92b58] hover:bg-[#d41c48] text-white rounded-l-none">Search</Button>
                        </div>
                    </div>

                    {/* Recent Posts */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                        <ul className="flex flex-col gap-3">
                            {recentBarcodes.map(b => (
                                <li key={b.barcode}>
                                    <Link href={`/barcode/${b.barcode}`} className="text-gray-400 hover:text-white transition-colors text-sm uppercase">
                                        {b.productName} {b.barcode}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Categories</h3>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer border-b border-gray-700 pb-2 block">
                                    Barcode ({allBarcodes?.length || 0})
                                </span>
                            </li>
                        </ul>
                    </div>

                </aside>

            </div>
        </div>
    );
}
