import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import VerifyPage from "@/pages/verify";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import AdminAuth from "@/pages/admin/auth";
import AdminDashboard from "@/pages/admin/dashboard";
import ProductTable from "@/pages/admin/product-table";
import ProductForm from "@/pages/admin/product-form";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin" component={AdminAuth} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={ProductTable} />
      <ProtectedRoute path="/admin/products/:id" component={ProductForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

import ContactFloatingButton from "@/components/ContactFloatingButton";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <ContactFloatingButton />
    </QueryClientProvider>
  );
}

export default App;
