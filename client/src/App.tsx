import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
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
      <Route path="/admin" component={AdminAuth} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={ProductTable} />
      <ProtectedRoute path="/admin/products/:id" component={ProductForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
          <ContactFloatingButton />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
