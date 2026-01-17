import { Route, useLocation } from "wouter";
import { useEffect } from "react";

export function ProtectedRoute({ component: Component, path }: { component: React.ComponentType<any>, path: string }) {
    const [, setLocation] = useLocation();

    // Check if user is admin
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    useEffect(() => {
        if (!isAdmin) {
            setLocation("/admin");
        }
    }, [isAdmin, setLocation]);

    if (!isAdmin) {
        return null; // Don't render anything while redirecting
    }

    return <Route path={path} component={Component} />;
}
