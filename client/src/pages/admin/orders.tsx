import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { format } from "date-fns";
import { ShoppingCart, User, MapPin, Receipt, Clock, PackageCheck, Truck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [notes, setNotes] = useState<Record<string, string>>({});

    const { data: orders = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/orders"],
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`/api/admin/orders/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
            toast({ title: "Order status updated successfully." });
        },
    });

    const noteMutation = useMutation({
        mutationFn: async ({ id, ownerNote }: { id: string; ownerNote: string }) => {
            const res = await fetch(`/api/admin/orders/${id}/note`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ownerNote }),
            });
            if (!res.ok) throw new Error("Failed to update note");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
            toast({ title: "Note sent to customer via real-time update." });
        },
    });

    const handleStatusChange = (orderId: string, newStatus: string) => {
        statusMutation.mutate({ id: orderId, status: newStatus });
    };

    const handleNoteChange = (orderId: string, value: string) => {
        setNotes((prev) => ({ ...prev, [orderId]: value }));
    };

    const handleSaveNote = (orderId: string) => {
        const note = notes[orderId];
        if (note !== undefined) {
            noteMutation.mutate({ id: orderId, ownerNote: note });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Completed": return "bg-green-100 text-green-800 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <AdminLayout breadcrumbs={["Home", "Admin", "Orders"]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customer Orders</h1>
                    <p className="text-gray-500">Manage orders, update statuses, and send real-time notes to customers.</p>
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">No orders found.</div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                
                                {/* Left Side: Order Info & Customer Details */}
                                <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShoppingCart className="h-5 w-5 text-gray-400" />
                                                <h3 className="text-lg font-bold text-gray-900">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{order.quantity} Packages</div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                <PackageCheck className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Packages Ordered</div>
                                                <div className="font-semibold text-gray-800">{order.packageName}</div>
                                            </div>
                                        </div>

                                        {/* Authentic App User Details */}
                                        {/* @ts-ignore - Dynamically loaded user attached by backend */}
                                        {order.user && (
                                            <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                                                {order.user.avatarUrl ? (
                                                    <img src={order.user.avatarUrl} alt="avatar" className="h-10 w-10 rounded-full border border-gray-200 shadow-sm object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                                                        {order.user.username?.charAt(0) || <User className="h-4 w-4" />}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                        {order.user.username}
                                                        {order.user.isVerified && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Verified</span>}
                                                        {order.user.avatarUrl && <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Google Auth</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{order.user.email} (Account Email)</div>
                                                </div>
                                            </div>
                                        )}

                                        {order.billingDetails ? (
                                            <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex gap-3">
                                                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm font-semibold">{order.billingDetails.fullName}</div>
                                                        <div className="text-xs text-gray-500">{order.billingDetails.email}</div>
                                                        <div className="text-xs text-gray-500">{order.billingDetails.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                    <div className="text-xs text-gray-600">
                                                        {order.billingDetails.address}<br />
                                                        {order.billingDetails.city}, {order.billingDetails.state} {order.billingDetails.zipCode}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-4 border-t border-gray-50 text-xs text-gray-500 italic">No checkout details recorded.</div>
                                        )}
                                        
                                        {order.razorpayPaymentId && (
                                            <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-mono text-gray-500">
                                                <Receipt className="h-4 w-4 text-gray-400" />
                                                Txn: {order.razorpayPaymentId}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Actions & Notes */}
                                <div className="p-6 w-full md:w-[400px] flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Order Status</label>
                                            <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order._id, val)}>
                                                <SelectTrigger className={`w-full h-12 font-bold ${getStatusColor(order.status)}`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Processing">Processing</SelectItem>
                                                    <SelectItem value="Completed">Completed</SelectItem>
                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Real-time Owner Note</label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={notes[order._id] !== undefined ? notes[order._id] : (order.ownerNote || "")} 
                                                    onChange={(e) => handleNoteChange(order._id, e.target.value)}
                                                    placeholder="e.g. Your barcodes are generating..."
                                                    className="h-10 text-sm focus:ring-blue-500"
                                                />
                                                <Button 
                                                    onClick={() => handleSaveNote(order._id)}
                                                    className="h-10 px-4 bg-gray-900 hover:bg-gray-800"
                                                    disabled={noteMutation.isPending}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
