import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { CartProvider } from "@/lib/cart-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Shop from "@/pages/shop";
import VerifyPage from "@/pages/verify";
import VerifyEmailPage from "@/pages/verify-email";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import AdminAuth from "@/pages/admin/auth";
import AdminDashboard from "@/pages/admin/dashboard";
import ProductTable from "@/pages/admin/product-table";
import ProductForm from "@/pages/admin/product-form";
import BarcodeDetailsPage from "@/pages/barcode-details";
import LiveProducts from "@/pages/live-products";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import Checkout from "@/pages/checkout";
import AdminUsers from "@/pages/admin/users";
import AdminOrders from "@/pages/admin/orders";
import { ProtectedRoute } from "./lib/protected-route";
import ContactFloatingButton from "@/components/ContactFloatingButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/barcode/:code" component={BarcodeDetailsPage} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/live-products" component={LiveProducts} />
      <Route path="/admin" component={AdminAuth} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={ProductTable} />
      <ProtectedRoute path="/admin/products/:id" component={ProductForm} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function OAuthHandler() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthUser = params.get("oauth_user");
    const error = params.get("error");

    if (oauthUser) {
      try {
        const user = JSON.parse(atob(oauthUser));
        login(user);
        toast({
          title: "Success",
          description: "Logged in successfully with Google",
        });
        window.history.replaceState({}, "", window.location.pathname);
      } catch (e) {
        console.error("Failed to parse oauth user", e);
      }
    } else if (error === "google_failed") {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not log in with Google. Please try again.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [login, toast]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <OAuthHandler />
          <Router />
          <Toaster />
          <ContactFloatingButton />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
