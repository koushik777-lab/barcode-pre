import { useState } from "react";
import { Link } from "wouter";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus } from "lucide-react";
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

    // Filter
    const filtered = barcodes.filter(b =>
        b.barcode.includes(searchQuery) ||
        b.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <AdminLayout breadcrumbs={["Home", "Product Details Table"]}>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">Product Details Table</h1>
                    <Link href="/admin/products/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                            <Plus size={16} /> Add New
                        </Button>
                    </Link>
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
                                <TableHead className="text-gray-700">Country</TableHead>
                                <TableHead className="text-gray-700">Category</TableHead>
                                <TableHead className="text-gray-700">Price</TableHead>
                                <TableHead className="text-gray-700">Status</TableHead>
                                <TableHead className="text-gray-700">Image</TableHead>
                                <TableHead className="text-right text-gray-700">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">No products found.</TableCell>
                                </TableRow>
                            ) : (
                                paginated.map((item, index) => (
                                    <TableRow key={item._id} className="hover:bg-gray-50">
                                        <TableCell className="text-gray-700">{(page - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{item.productName}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600">{item.barcode}</TableCell>
                                        <TableCell className="text-gray-700">{item.brandName}</TableCell>
                                        <TableCell className="text-gray-700">{item.country || "-"}</TableCell>
                                        <TableCell className="text-gray-700">{item.category}</TableCell>
                                        <TableCell className="text-gray-700">₹{item.price}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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
                                            <div className="flex justify-end gap-2">

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
                        <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {totalPages}</span>
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
