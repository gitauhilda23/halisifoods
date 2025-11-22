// client/src/App.tsx
import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Public Pages
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Blog from "@/pages/Blog";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

// Protected Pages (only accessible when logged in)
import AdminDashboard from "@/pages/AdminDashboard";

// Optional: Loading spinner component
const Loader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ced000] border-t-transparent" />
  </div>
);

function Router() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loader while checking auth state
  if (loading) {
    return <Loader />;
  }

  // Protected route wrapper
  const ProtectedRoute = ({ component: Component }: { component: React.FC }) => {
    if (!user) {
      // Redirect to login but remember where they were trying to go
      window.location.href = `/login?redirect=${encodeURIComponent(location)}`;
      return null;
    }
    return <Component />;
  };

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/blog" component={Blog} />
      <Route path="/login" component={Login} />

      {/* Protected Admin Route – still secret URL */}
      <Route path="/admin-dashboard-secret">
        <ProtectedRoute component={AdminDashboard} />
      </Route>

      {/* Legacy redirect */}
      <Route path="/free-ebook">
        {() => {
          window.location.replace("/");
          return null;
        }}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;