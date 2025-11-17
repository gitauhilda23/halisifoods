// src/components/Header.tsx
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(cartItemCount);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(savedUser);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/catalog", label: "Recipes" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* FINAL LOGO — BIG, BEAUTIFUL & ROYAL */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img
              src="/halisi-logo.png"
              alt="Halisi Foods & Recipes"
              className="h-20 md:h-24 lg:h-28 w-auto object-contain 
                         drop-shadow-2xl 
                         transition-all duration-500 hover:scale-105 
                         -ml-3 md:-ml-5"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant="ghost"
                  className={`text-lg font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                    location === link.path
                      ? "text-amber-800 bg-amber-100 font-bold"
                      : "text-amber-900/80 hover:text-amber-800 hover:bg-amber-50"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex text-amber-900 hover:text-amber-700 hover:bg-amber-50"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="hidden sm:flex items-center gap-3 bg-amber-50 rounded-full px-5 py-2 border-2 border-amber-600">
                <User className="h-5 w-5 text-amber-800" />
                <span className="font-bold text-amber-900">{user.name}</span>
                <Button size="sm" variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 shadow-lg">
                  Login
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button size="icon" variant="ghost" className="relative text-amber-900 hover:text-amber-700">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-700 text-white text-xs font-bold">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-amber-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {searchOpen && (
          <div className="pb-6 pt-3 border-t-2 border-amber-200">
            <Input
              type="search"
              placeholder="Search Halisi recipes..."
              className="max-w-2xl mx-auto h-12 text-lg border-2 border-amber-600 focus:border-amber-700 focus:ring-amber-200"
            />
          </div>
        )}

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t-4 border-amber-600 bg-amber-50/80">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-xl font-bold text-amber-900 py-5">
                    {link.label}
                  </Button>
                </Link>
              ))}
              {user && (
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-xl font-bold text-red-700 py-5">
                  Logout
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}