// src/main.tsx
import { createRoot } from "react-dom/client";
import "./index.css";
import { Route, Switch } from "wouter";
import { Toaster } from "sonner"; // ← TOASTS

import App from "./App";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import Catalog from "./pages/Catalog";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/not-found";
import About from "./pages/About";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-center" richColors closeButton />
    
    <Switch>
      <Route path="/" component={App} />
      <Route path="/about" component={About} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Login} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  </>
);