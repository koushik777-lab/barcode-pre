import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
    Home,
    Package,
    LogOut,
    Search,
    LayoutDashboard,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: string[];
}

export function AdminLayout({ children, breadcrumbs = ["Home"] }: AdminLayoutProps) {
    const [location, setLocation] = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        setLocation("/admin");
    };

    const isActive = (path: string) => location === path;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans light-mode">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* LEFT SIDEBAR (Fixed) */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                            B
                        </div>
                        <span>Admin</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <Link href="/admin/dashboard">
                        <a className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/dashboard") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </a>
                    </Link>
                    <Link href="/admin/products">
                        <a className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/products") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <Package size={18} />
                            See Product Table
                        </a>
                    </Link>
                    <Link href="/admin/products/new">
                        <a className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/products/new") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <Package size={18} />
                            Add Product
                        </a>
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP BAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-gray-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="hidden md:flex items-center text-sm text-gray-500">
                            {breadcrumbs.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    {index > 0 && <span className="mx-2">/</span>}
                                    <span className={index === breadcrumbs.length - 1 ? "font-semibold text-gray-900" : ""}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[400px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search Barcode / Product Code..."
                                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 h-10">Search</Button>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
