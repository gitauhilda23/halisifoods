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
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(savedUser);
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert("Logged out");
    window.location.href = '/';
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/catalog", label: "Recipes" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-[#693e1e]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* HALISI LOGO — FROM public/ — NO IMPORT */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/halisi-logo.png"
              alt="Halisi Foods & Recipes"
              className="h-16 w-auto drop-shadow-md"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant="ghost"
                  className={`text-lg font-medium transition-colors ${
                    location === link.path
                      ? "text-[#693e1e] font-bold border-b-2 border-[#ced000]"
                      : "text-[#693e1e]/70 hover:text-[#693e1e]"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex text-[#693e1e]/70 hover:text-[#693e1e]"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="flex items-center gap-3 bg-[#ced000]/10 rounded-full px-5 py-2 border border-[#693e1e]/30">
                <User className="h-5 w-5 text-[#693e1e]" />
                <span className="font-semibold text-[#693e1e] hidden sm:block">
                  {user.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-[#693e1e]/70 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#ced000] hover:bg-[#b8b800] text-[#693e1e] font-bold px-6">
                  Login
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button size="icon" variant="ghost" className="relative text-[#693e1e]">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 text-sm font-bold bg-[#693e1e] text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-[#693e1e]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 pt-2 border-t border-[#693e1e]/10">
            <Input
              type="search"
              placeholder="Search Halisi recipes..."
              className="max-w-xl mx-auto h-12 border-[#693e1e]/30 focus:border-[#ced000] focus:ring-[#ced000]/30"
            />
          </div>
        )}

        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t-2 border-[#693e1e]/20">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg font-medium text-[#693e1e] py-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              {user && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-lg font-medium text-red-600 py-4"
                >
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