import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package, Users, Plus, ShieldCheck } from "lucide-react";

interface Barcode {
    _id: string;
    status: string;
}

interface Application {
    _id: string;
    status: string;
}

export default function AdminDashboard() {
    // --- Queries ---
    const { data: barcodes = [] } = useQuery<Barcode[]>({
        queryKey: ["/api/barcodes"],
    });

    const { data: applications = [] } = useQuery<Application[]>({
        queryKey: ["/api/applications"],
    });

    const activeProducts = barcodes.filter(b => b.status === "Active").length;
    const inactiveProducts = barcodes.length - activeProducts;

    return (
        <AdminLayout breadcrumbs={["Home", "Dashboard"]}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back. Here is what's happening with your products.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Package size={16} /> Total Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{barcodes.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <ShieldCheck size={16} /> Active Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{activeProducts}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Package size={16} /> Non-Active Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{inactiveProducts}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link href="/admin/products/new">
                            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                                <Plus className="mr-2" /> Add New Product
                            </Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button variant="outline" className="h-12 px-6">
                                Manage Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
