import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
    Home,
    Package,
    LogOut,
    Search,
    LayoutDashboard,
    Menu,
    X,
    Table,
    PlusSquare,
    PanelLeftClose,
    PanelLeftOpen
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
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        fixed md:static inset-y-0 left-0 z-50 ${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className={`h-16 flex items-center border-b border-gray-100 transition-all w-full ${isCollapsed ? "justify-center" : "px-4 justify-between"}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 pointer-events-none">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shrink-0">
                                B
                            </div>
                            <span className="font-bold text-xl text-gray-800 whitespace-nowrap overflow-hidden">Admin</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`focus:outline-none transition-colors flex shrink-0 ${isCollapsed
                            ? "p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                            : "p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                            }`}
                        title={isCollapsed ? "Expand Sidebar" : "Shrink Sidebar"}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen size={24} strokeWidth={2.5} />
                        ) : (
                            <PanelLeftClose size={24} strokeWidth={2.5} />
                        )}
                    </button>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <Link href="/admin/dashboard">
                        <a title="Dashboard" className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/dashboard") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <LayoutDashboard size={18} className="shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Dashboard</span>}
                        </a>
                    </Link>
                    <Link href="/admin/products">
                        <a title="See Product Table" className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/products") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <Table size={18} className="shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">See Product Table</span>}
                        </a>
                    </Link>
                    <Link href="/admin/products/new">
                        <a title="Add Product" className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-md text-sm font-medium transition-colors ${isActive("/admin/products/new") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <PlusSquare size={18} className="shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Add Product</span>}
                        </a>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Logout</span>}
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
