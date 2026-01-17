import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BarcodeData {
    productName: string;
    brandName: string;
    barcode: string;
    category: string;
    description: string;
    status: string;
    manufacturer?: string;
    price?: number;
    weight?: string;
    ingredients?: string;
    currency?: string;
}

interface VerifyResultProps {
    data: BarcodeData;
}

export function VerifyResult({ data }: VerifyResultProps) {
    return (
        <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold text-primary">{data.productName}</CardTitle>
                        <div className="text-lg text-muted-foreground font-medium mt-1">{data.brandName}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant={data.status === 'Active' ? 'default' : 'destructive'} className="text-base px-4 py-1">
                            {data.status}
                        </Badge>
                        <span className="font-mono text-sm bg-background px-3 py-1 rounded border">
                            {data.barcode}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Category</span>
                            <span className="text-foreground">{data.category || "N/A"}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Price</span>
                            <span className="text-foreground font-medium">
                                {data.price ? `${data.currency || 'INR'} ${data.price}` : "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Weight/Volume</span>
                            <span className="text-foreground">{data.weight || "N/A"}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Manufacturer</span>
                            <span className="text-foreground">{data.manufacturer || "N/A"}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {data.description || "No description available."}
                        </p>
                    </div>
                    {data.ingredients && (
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">Ingredients</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {data.ingredients}
                            </p>
                        </div>
                    )}
                </div>

                {/* Placeholder for Product Image */}
                <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">Product Image Request</p>
                        <p className="text-xs text-gray-400 mt-1">Image not available in this demo</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
