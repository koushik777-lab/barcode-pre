import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function ProductForm() {
    const [, params] = useRoute("/admin/products/:id");
    const isEdit = params?.id && params.id !== "new";
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch data if edit mode
    const { data: barcode } = useQuery({
        queryKey: [`/api/barcodes/${params?.id}`],
        enabled: !!isEdit,
    });

    const [formData, setFormData] = useState({
        // Overview
        productName: "",
        brandName: "",
        barcode: "",
        country: "",
        language: "",
        category: "",
        description: "",
        websiteLink: "",
        amazonLink: "",
        sku: "",
        modelNumber: "",
        price: "",

        // Clothes
        color: "",
        material: "",
        size: "",

        // Size/Weight
        width: "",
        height: "",
        length: "",
        weight: "",
        fluid: "",
        pieces: "",

        // Nutrition
        servingSize: "",
        servingsPer: "",
        calories: "",
        fatCalories: "",
        totalFat: "",
        saturatedFat: "",
        transFat: "",
        cholesterol: "",
        sodium: "",
        potassium: "",
        totalCarbohydrate: "",
        dietaryFiber: "",
        sugar: "",
        protein: "",
        ingredients: "",

        // Publication
        author: "",
        pageCount: "",
        binding: "",
        releaseYear: "",
        published: "",
        format: "",
        runTime: "",

        // Meta
        imageUrl: "",
        barcodeImageUrl: "",
        issueDate: new Date().toISOString().split('T')[0],
        status: "Active",
    });

    useEffect(() => {
        if (barcode) {
            console.log("Product data loaded:", barcode);
            // Cast to any to avoid "Property does not exist on type {}" error
            // In a stricter app, we would use the specific Barcode interface
            const data = barcode as any;

            setFormData(prev => ({
                ...prev,
                // Overview
                productName: data.productName || "",
                brandName: data.brandName || "",
                barcode: data.barcode || "",
                country: data.country || "",
                language: data.language || "",
                category: data.category || "",
                description: data.description || "",
                websiteLink: data.websiteLink || "",
                amazonLink: data.amazonLink || "",
                sku: data.sku || "",
                modelNumber: data.modelNumber || "",
                price: data.price !== undefined && data.price !== null ? String(data.price) : "",

                // Clothes
                color: data.color || "",
                material: data.material || "",
                size: data.size || "",

                // Size/Weight
                width: data.width || "",
                height: data.height || "",
                length: data.length || "",
                weight: data.weight || "",
                fluid: data.fluid || "",
                pieces: data.pieces || "",

                // Nutrition
                servingSize: data.servingSize || "",
                servingsPer: data.servingsPer || "",
                calories: data.calories || "",
                fatCalories: data.fatCalories || "",
                totalFat: data.totalFat || "",
                saturatedFat: data.saturatedFat || "",
                transFat: data.transFat || "",
                cholesterol: data.cholesterol || "",
                sodium: data.sodium || "",
                potassium: data.potassium || "",
                totalCarbohydrate: data.totalCarbohydrate || "",
                dietaryFiber: data.dietaryFiber || "",
                sugar: data.sugar || "",
                protein: data.protein || "",
                ingredients: data.ingredients || "",

                // Publication
                author: data.author || "",
                pageCount: data.pageCount || "",
                binding: data.binding || "",
                releaseYear: data.releaseYear || "",
                published: data.published || "",
                format: data.format || "",
                runTime: data.runTime || "",

                // Meta
                imageUrl: data.imageUrl || "",
                barcodeImageUrl: data.barcodeImageUrl || "",
                issueDate: data.issueDate ? String(data.issueDate).split('T')[0] : new Date().toISOString().split('T')[0],
                status: ["Active", "Inactive"].includes(data.status) ? data.status : "Active",
            }));
        }
    }, [barcode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload an image in JPEG or PNG format.",
                    variant: "destructive"
                });
                return;
            }

            // Check file size (300KB = 300 * 1024 bytes)
            if (file.size > 300 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Image size must be less than 300KB.",
                    variant: "destructive"
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = { ...data, price: Number(data.price) };
            if (isEdit) {
                await apiRequest("PUT", `/api/barcodes/${params.id}`, payload);
            } else {
                await apiRequest("POST", "/api/barcodes", payload);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["/api/barcodes"] });
            toast({ title: "Success", description: "Product saved successfully" });
            setLocation("/admin/products");
        },
        onError: (err: any) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    // Shared input class to force black text
    const inputClass = "bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    return (
        <AdminLayout breadcrumbs={["Home", isEdit ? "Edit Product" : "New Product Details"]}>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

                {/* SECTION: Overview */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Product Overview</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Product Name</Label>
                            <Input name="productName" value={formData.productName} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Brand Name</Label>
                            <Input name="brandName" value={formData.brandName} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Product QR / Barcode Number</Label>
                            <Input name="barcode" value={formData.barcode} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Country Name</Label>
                            <Input name="country" value={formData.country} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Language</Label>
                            <Input name="language" value={formData.language} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Category</Label>
                            <Input name="category" value={formData.category} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label className="text-gray-700">Product Description</Label>
                            <Textarea name="description" value={formData.description} onChange={handleChange} className={`min-h-[100px] ${inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Website Link</Label>
                            <Input name="websiteLink" value={formData.websiteLink} onChange={handleChange} placeholder="https://" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Amazon Link</Label>
                            <Input name="amazonLink" value={formData.amazonLink} onChange={handleChange} placeholder="https://" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">SKU</Label>
                            <Input name="sku" value={formData.sku} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Model Number</Label>
                            <Input name="modelNumber" value={formData.modelNumber} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Price</Label>
                            <Input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className={inputClass}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                    </div>
                </section>



                {/* SECTION: Size / Weight / Volume */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Size / Weight / Volume</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-6 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Width</Label>
                            <Input name="width" value={formData.width} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Height</Label>
                            <Input name="height" value={formData.height} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Length</Label>
                            <Input name="length" value={formData.length} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Weight</Label>
                            <Input name="weight" value={formData.weight} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Fluid</Label>
                            <Input name="fluid" value={formData.fluid} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Pieces</Label>
                            <Input name="pieces" value={formData.pieces} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* SECTION: Nutrition Information */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Nutrition Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Serving Size</Label>
                            <Input name="servingSize" value={formData.servingSize} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Servings Per Container</Label>
                            <Input name="servingsPer" value={formData.servingsPer} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Calories</Label>
                            <Input name="calories" value={formData.calories} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Fat Calories</Label>
                            <Input name="fatCalories" value={formData.fatCalories} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Total Fat</Label>
                            <Input name="totalFat" value={formData.totalFat} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Saturated Fat</Label>
                            <Input name="saturatedFat" value={formData.saturatedFat} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Trans Fat</Label>
                            <Input name="transFat" value={formData.transFat} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Cholesterol</Label>
                            <Input name="cholesterol" value={formData.cholesterol} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Sodium</Label>
                            <Input name="sodium" value={formData.sodium} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Potassium</Label>
                            <Input name="potassium" value={formData.potassium} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Total Carbohydrate</Label>
                            <Input name="totalCarbohydrate" value={formData.totalCarbohydrate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Dietary Fiber</Label>
                            <Input name="dietaryFiber" value={formData.dietaryFiber} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Sugar</Label>
                            <Input name="sugar" value={formData.sugar} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Protein</Label>
                            <Input name="protein" value={formData.protein} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="col-span-2 md:col-span-4 space-y-2">
                            <Label className="text-gray-700">Ingredients</Label>
                            <Textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* SECTION: Clothes Details */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Clothes Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Color</Label>
                            <Input name="color" value={formData.color} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Material</Label>
                            <Input name="material" value={formData.material} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Size</Label>
                            <Input name="size" value={formData.size} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* SECTION: Publication */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Publication (Books/Media)</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Author</Label>
                            <Input name="author" value={formData.author} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Page Count</Label>
                            <Input name="pageCount" value={formData.pageCount} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Binding</Label>
                            <Input name="binding" value={formData.binding} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Release Year</Label>
                            <Input name="releaseYear" value={formData.releaseYear} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Published</Label>
                            <Input name="published" value={formData.published} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Format</Label>
                            <Input name="format" value={formData.format} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700">Run Time</Label>
                            <Input name="runTime" value={formData.runTime} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* SECTION: Product Images & Status */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Images & Status</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-gray-700">Product Front Image</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                                {formData.imageUrl ? (
                                    <div className="relative w-full h-48">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-0 right-0"
                                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500 mb-4">Click to upload image</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, 'imageUrl')}
                                        />
                                        <div className="w-full flex items-center gap-2 mt-2 z-10">
                                            <div className="h-px bg-gray-200 flex-1" />
                                            <span className="text-xs text-gray-400">OR URL</span>
                                            <div className="h-px bg-gray-200 flex-1" />
                                        </div>
                                        <Input
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            placeholder="Paste image URL..."
                                            className={`mt-2 z-20 ${inputClass}`}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-gray-700">Barcode Image</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                                {formData.barcodeImageUrl ? (
                                    <div className="relative w-full h-48">
                                        <img src={formData.barcodeImageUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-0 right-0"
                                            onClick={() => setFormData(prev => ({ ...prev, barcodeImageUrl: "" }))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500 mb-4">Click to upload image</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, 'barcodeImageUrl')}
                                        />
                                        <div className="w-full flex items-center gap-2 mt-2 z-10">
                                            <div className="h-px bg-gray-200 flex-1" />
                                            <span className="text-xs text-gray-400">OR URL</span>
                                            <div className="h-px bg-gray-200 flex-1" />
                                        </div>
                                        <Input
                                            name="barcodeImageUrl"
                                            value={formData.barcodeImageUrl}
                                            onChange={handleChange}
                                            placeholder="Paste image URL..."
                                            className={`mt-2 z-20 ${inputClass}`}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700">Issue Date</Label>
                            <Input type="date" name="issueDate" value={String(formData.issueDate).split('T')[0]} onChange={handleChange} className={inputClass} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700">Status</Label>
                            <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                <SelectTrigger className="bg-white text-black border-gray-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pb-12">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 text-lg">
                        {mutation.isPending ? "Saving..." : (isEdit ? "Update Product Details" : "Submit Product Details")}
                    </Button>
                </div>

            </form>
        </AdminLayout>
    );
}
