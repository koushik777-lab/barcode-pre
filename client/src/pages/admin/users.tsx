import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { format } from "date-fns";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";

export default function AdminUsers() {
    const { data: users = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/users"],
    });

    return (
        <AdminLayout breadcrumbs={["Home", "Admin", "Users"]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Web-App Users</h1>
                    <p className="text-gray-500">View all registered users on ShopMyBarcode.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">User</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Contact</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading users...</td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 text-white rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                            {user.username}
                                                            {user.isAdmin && <Shield className="h-3 w-3 text-blue-500" />}
                                                        </div>
                                                        <div className="text-xs text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                            <Phone className="h-3 w-3" /> {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {user.isVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
