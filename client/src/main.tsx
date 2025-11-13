// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Route, Switch } from "wouter";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import Catalog from "./pages/Catalog";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/not-found";

createRoot(document.getElementById("root")!).render(
  <Switch>
    <Route path="/" component={App} />
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
);