import { useState } from "react";
import { Link } from "wouter";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Copy, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Barcode {
    _id: string;
    barcode: string;
    productName: string;
    brandName: string;
    country?: string;
    category: string;
    price: number;
    status: string;
    imageUrl?: string;
    modelNumber?: string;
    liveStatus?: 'LIVE' | 'NOT LIVE' | 'REQUESTED';
}

export default function ProductTable() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const { data: barcodes = [] } = useQuery<Barcode[]>({
        queryKey: ["/api/barcodes"],
        staleTime: 0,
        refetchOnMount: true,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/barcodes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/barcodes"] });
            toast({ title: "Deleted", description: "Product deleted successfully" });
        }
    });

    const toggleIndexMutation = useMutation({
        mutationFn: async ({ id, liveStatus }: { id: string; liveStatus: string }) => {
            await apiRequest("PUT", `/api/barcodes/${id}`, { liveStatus });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/barcodes"] });
            toast({
                title: "Live Status Updated",
                description: `Product marked as ${variables.liveStatus}`
            });
        }
    });

    const copyGoogleSearchLink = (barcode: string) => {
        const url = `https://www.google.com/search?q=${encodeURIComponent(barcode)}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Copied!", description: "Google Search URL copied to clipboard." });
    };

    const copyGoogleLink = (barcode: string) => {
        const url = `https://shopmybarcode.in/barcode/${barcode}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Copied!", description: "Product URL copied to clipboard." });
    };

    // Filter
    const filtered = barcodes.filter(b =>
        b.barcode.includes(searchQuery) ||
        b.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const exportToExcel = async (data: Barcode[], filename: string) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Products");

        // Define columns
        worksheet.columns = [
            { header: "S.No", key: "sno", width: 10 },
            { header: "Product Name", key: "productName", width: 30 },
            { header: "Product Code", key: "productCode", width: 25 },
            { header: "Brand", key: "brand", width: 20 },
            { header: "Country", key: "country", width: 15 },
            { header: "Category", key: "category", width: 25 },
            { header: "Price", key: "price", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Live Status", key: "liveStatus", width: 20 }
        ];

        // Make headers bold
        worksheet.getRow(1).font = { bold: true };

        // Add Data and Style
        data.forEach((item, index) => {
            const row = worksheet.addRow({
                sno: index + 1,
                productName: item.productName || '',
                productCode: item.barcode || '',
                brand: item.brandName || '',
                country: item.country || '',
                category: item.category || '',
                price: item.price || 0,
                status: item.status || 'Inactive',
                liveStatus: item.liveStatus || 'NOT LIVE'
            });

            // Style Live Status Column
            const liveStatusCell = row.getCell('liveStatus');
            liveStatusCell.alignment = { vertical: 'middle', horizontal: 'center' };

            if (item.liveStatus === 'LIVE') {
                liveStatusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF22C55E' } // Tailwind Green-500
                };
                liveStatusCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            } else if (item.liveStatus === 'REQUESTED') {
                liveStatusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFE066' } // Yellow
                };
                liveStatusCell.font = { color: { argb: 'FF000000' }, bold: true };
            } else {
                liveStatusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFEF4444' } // Tailwind Red-500
                };
                liveStatusCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            }
        });

        // Generate Excel File and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    return (
        <AdminLayout breadcrumbs={["Home", "Product Details Table"]}>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">Product Details Table</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="text-gray-700 gap-2 font-medium border-gray-300"
                            onClick={() => exportToExcel(barcodes, "all-products.xlsx")}
                        >
                            <FileSpreadsheet size={16} className="text-emerald-600" /> Export All
                        </Button>
                        <Button
                            variant="outline"
                            className="text-gray-700 gap-2 font-medium border-gray-300"
                            onClick={() => exportToExcel(barcodes.filter(b => b.liveStatus === 'LIVE'), "live-products.xlsx")}
                        >
                            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Live
                        </Button>
                        <Link href="/admin/products/new">
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                                <Plus size={16} /> Add New
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex gap-4">
                        <Input
                            placeholder="Search by Product Code / Name..."
                            className="max-w-md"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-16 text-gray-700">S.No</TableHead>
                                <TableHead className="text-gray-700">Product Name</TableHead>
                                <TableHead className="text-gray-700">Product Code</TableHead>
                                <TableHead className="text-gray-700">Brand</TableHead>
                                <TableHead className="text-gray-700">Live Status</TableHead>
                                <TableHead className="text-gray-700">GPAGE</TableHead>
                                <TableHead className="text-gray-700">Country</TableHead>
                                <TableHead className="text-gray-700">Category</TableHead>
                                <TableHead className="text-gray-700">Price</TableHead>
                                <TableHead className="text-gray-700">Status</TableHead>
                                <TableHead className="text-gray-700">Image</TableHead>
                                <TableHead className="text-right text-gray-700 w-48">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">No products found.</TableCell>
                                </TableRow>
                            ) : (
                                paginated.map((item, index) => (
                                    <TableRow
                                        key={item._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell className="text-gray-700">{(page - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{item.productName}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600">{item.barcode}</TableCell>
                                        <TableCell className="text-gray-700">{item.brandName}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={item.liveStatus || "NOT LIVE"}
                                                onValueChange={(value) => {
                                                    toggleIndexMutation.mutate({ id: item._id, liveStatus: value });
                                                }}
                                            >
                                                <SelectTrigger className={`h-8 w-[110px] text-xs font-semibold border-0 ${item.liveStatus === 'LIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : item.liveStatus === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LIVE" className="text-green-700 font-medium">LIVE</SelectItem>
                                                    <SelectItem value="REQUESTED" className="text-yellow-600 font-medium">REQUESTED</SelectItem>
                                                    <SelectItem value="NOT LIVE" className="text-red-700 font-medium">NOT LIVE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyGoogleLink(item.barcode);
                                                }}
                                                title="Copy Product Link"
                                            >
                                                <Copy size={14} />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-gray-700">{item.country || "-"}</TableCell>
                                        <TableCell className="text-gray-700">{item.category}</TableCell>
                                        <TableCell className="text-gray-700">₹{item.price}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : item.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt="img" className="h-8 w-8 object-cover rounded border" />
                                            ) : (
                                                <div className="h-8 w-8 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">N/A</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 flex gap-1 items-center"
                                                    onClick={() => copyGoogleSearchLink(item.barcode)}
                                                >
                                                    <Copy size={14} /> Link
                                                </Button>
                                                <Link href={`/admin/products/${item._id}`}>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50">
                                                        <Edit size={16} />
                                                    </Button>
                                                </Link>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => deleteMutation.mutate(item._id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200 flex justify-center flex-wrap gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Prev
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                if (
                                    p === 1 ||
                                    p === totalPages ||
                                    (p >= page - 2 && p <= page + 2)
                                ) {
                                    return (
                                        <Button
                                            key={p}
                                            variant={page === p ? "default" : "outline"}
                                            className={`w-10 h-10 p-0 ${page === p ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-600"}`}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </Button>
                                    );
                                }
                                if (p === page - 3 || p === page + 3) {
                                    return <span key={p} className="flex items-center justify-center w-8 h-10 text-gray-500">...</span>;
                                }
                                return null;
                            })}
                            <Button
                                variant="outline"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
