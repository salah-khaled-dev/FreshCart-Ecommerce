"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Truck,
  Gift,
  Phone,
  Mail,
  User,
  UserPlus,
  Search,
  ChevronDown,
  Headphones,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { AuthUser } from "@/api/types";
import {
  getLoggedUserFromCookies,
  clearAuthCookies,
  getLoggedUserWishlist,
  getStoredWishlistIds,
  getLoggedUserCart,
  getStoredCartCount,
  getAllCategories,
} from "@/api/services/routemisr.service";
import UserProfileMenu from "@/app/_components/UserProfile/UserProfileMenu";

const DEFAULT_NAV_CATEGORIES = [
  {
    name: "Men's Fashion",
    href: "/categories/6439d5b90049ad0b52b90048",
  },
  {
    name: "Women's Fashion",
    href: "/categories/6439d58a0049ad0b52b9003f",
  },
  {
    name: "Groceries & Supermarket",
    href: "/categories/6439d41c67d9aa4ca97064d5",
  },
  {
    name: "Electronics & Mobiles",
    href: "/categories/6439d2d167d9aa4ca970649f",
  },
  {
    name: "Baby & Toys",
    href: "/categories/6439d40367d9aa4ca97064cc",
  },
  {
    name: "Home & Kitchen",
    href: "/categories/6439d3e067d9aa4ca97064c3",
  },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [categories, setCategories] = useState(DEFAULT_NAV_CATEGORIES);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const syncAuth = () => {
      setLoggedUser(getLoggedUserFromCookies());
    };
    const syncWishlistCount = () => {
      setWishlistCount(getStoredWishlistIds().length);
    };
    const syncCartCount = () => {
      setCartCount(getStoredCartCount());
    };

    syncAuth();
    syncWishlistCount();
    syncCartCount();

    window.addEventListener("auth-change", syncAuth);
    window.addEventListener("wishlist-change", syncWishlistCount);
    window.addEventListener("cart-change", syncCartCount);
    return () => {
      window.removeEventListener("auth-change", syncAuth);
      window.removeEventListener("wishlist-change", syncWishlistCount);
      window.removeEventListener("cart-change", syncCartCount);
    };
  }, [pathname]);

  useEffect(() => {
    getLoggedUserWishlist().catch(() => {});
    getLoggedUserCart().catch(() => {});
    getAllCategories()
      .then((apiCats) => {
        if (apiCats && apiCats.length > 0) {
          setCategories(
            apiCats.map((cat) => ({
              name: cat.name,
              href: `/categories/${cat._id}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearAuthCookies();
    setLoggedUser(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#e2e8f0] sticky top-0 z-50 font-sans">
      {/* ── 1. Top Announcement & Utility Bar ── */}
      <div className="border-b border-[#e2e8f0] bg-white text-[12px] sm:text-[13px] text-[#5c6c75] overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-3 sm:px-4 h-[36px] sm:h-[40px] flex items-center justify-between">
          {/* Top Left: Shipping & Offers */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center md:justify-start">
            <div className="flex items-center gap-1.5 truncate">
              <Truck className="w-3.5 sm:w-[15px] h-3.5 sm:h-[15px] text-[#16a34a] shrink-0" />
              <span className="truncate">
                Free Shipping on Orders{" "}
                <span className="font-semibold text-[#364153]">500 EGP</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Gift className="w-[15px] h-[15px] text-[#16a34a] shrink-0" />
              <span>New Arrivals Daily</span>
            </div>
          </div>

          {/* Top Right: Contact & Quick Auth (Desktop & Tablet Only) */}
          <div className="hidden md:flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#5c6c75]" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#5c6c75]" />
                <span>support@freshcart.com</span>
              </a>
            </div>

            <div className="hidden md:block h-3.5 w-[1px] bg-[#dfe2e1]" />

            <div className="flex items-center gap-4">
              {loggedUser ? (
                <>
                  <span className="flex items-center gap-1.5 font-medium text-[#364153]">
                    <User className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Hi, {loggedUser.name.split(" ")[0]}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors font-medium text-[#5c6c75] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors font-medium text-[#364153]"
                  >
                    <User className="w-3.5 h-3.5 text-[#5c6c75]" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors font-medium text-[#364153]"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#5c6c75]" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Navigation Bar ── */}
      <div className="max-w-[1320px] mx-auto px-3 sm:px-4 py-2.5 sm:py-[18px]">
        <div className="flex items-center justify-between gap-2 sm:gap-6 lg:gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
            {/* FreshCart Custom SVG Cart Icon */}
            <div className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] text-[#16a34a] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]"
              >
                <path
                  d="M3 5H6.5L9.8 21.5H25.5L28.5 9.5H8.5"
                  stroke="#16a34a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 13.5H27"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11.5 17.5H25.5"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="26" r="2.2" fill="#16a34a" />
                <circle cx="24" cy="26" r="2.2" fill="#16a34a" />
              </svg>
            </div>
            <span className="text-[20px] sm:text-[25px] font-bold tracking-[-0.03em] text-[#1c2c34]">
              FreshCart
            </span>
          </Link>

          {/* Search Input Bar (Desktop - Large Screens Only) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden xl:flex items-center flex-1 max-w-[440px] relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full h-[44px] bg-white text-[#364153] placeholder-[#889397] text-[14px] rounded-full pl-5 pr-12 border border-[#dfe2e1] focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </form>

          {/* Navigation Menu Links (Exact Figma Typography: 16px, Weight 500, Line Height 24px, Oxford Blue #364153) */}
          <nav className="hidden xl:flex items-center gap-7 lg:gap-8">
            <Link
              href="/"
              className={`text-[16px] font-[500] leading-[24px] tracking-[0%] transition-colors inline-flex items-center h-[24px] ${
                pathname === "/"
                  ? "text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:text-[#16a34a]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={`text-[16px] font-[500] leading-[24px] tracking-[0%] transition-colors inline-flex items-center h-[24px] ${
                pathname === "/shop"
                  ? "text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:text-[#16a34a]"
              }`}
            >
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div ref={categoriesRef} className="relative">
              <button
                type="button"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className={`text-[16px] font-[500] leading-[24px] tracking-[0%] flex items-center gap-1.5 transition-colors h-[24px] ${
                  isCategoriesOpen || pathname.startsWith("/categories")
                    ? "text-[#16a34a]"
                    : "text-[#364153] hover:text-[#16a34a]"
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180 text-[#16a34a]" : "text-[#5c6c75]"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-[#e2e8f0] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 pb-2 mb-1 border-b border-[#e2e8f0] text-[11px] font-semibold uppercase tracking-wider text-[#889397]">
                    Popular Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-[14px] text-[#364153] hover:bg-[#e8fadf] hover:text-[#16a34a] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="pt-1 mt-1 border-t border-[#e2e8f0]">
                    <Link
                      href="/categories"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-[#16a34a] hover:underline"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/brands"
              className={`text-[16px] font-[500] leading-[24px] tracking-[0%] transition-colors inline-flex items-center h-[24px] ${
                pathname === "/brands"
                  ? "text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:text-[#16a34a]"
              }`}
            >
              Brands
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-4 md:gap-6 shrink-0">
            {/* Support Info Badge */}
            <div className="hidden lg:flex items-center gap-2.5">
              <div className="w-[38px] h-[38px] rounded-full bg-[#e8fadf] flex items-center justify-center text-[#16a34a] shrink-0">
                <Headphones className="w-[19px] h-[19px] stroke-[2]" />
              </div>
              <div className="flex flex-col text-left leading-none gap-1">
                <span className="text-[11px] font-normal text-[#889397] tracking-tight leading-none">
                  Support
                </span>
                <span className="text-[13px] font-bold text-[#364153] leading-none">
                  24/7 Help
                </span>
              </div>
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-1.5 text-[#364153] hover:text-[#16a34a] transition-colors flex items-center justify-center relative"
            >
              <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="p-1.5 text-[#364153] hover:text-[#16a34a] transition-colors flex items-center justify-center relative"
            >
              <ShoppingCart className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#16a34a] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Component (when logged in) OR Sign In Primary Pill Button */}
            {loggedUser ? (
              <UserProfileMenu
                user={loggedUser}
                onLogout={handleLogout}
                onUserUpdated={setLoggedUser}
              />
            ) : (
              <>
                {/* Mobile Compact User Icon */}
                <Link
                  href="/login"
                  aria-label="Sign In"
                  className="sm:hidden p-1.5 text-[#364153] hover:text-[#16a34a] transition-colors flex items-center justify-center"
                >
                  <User className="w-5 h-5 stroke-[2]" />
                </Link>

                {/* Tablet & Desktop Button */}
                <Link
                  href="/login"
                  className="hidden sm:flex h-[38px] px-4 sm:px-5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[14px] font-semibold rounded-full items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <User className="w-4 h-4 stroke-[2.2]" />
                  <span>Sign In</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 text-[#364153] hover:text-[#16a34a] rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Mobile Navigation Drawer (Tablet & Mobile Menu) ── */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#e2e8f0] px-4 py-4 space-y-4 animate-in fade-in duration-150 shadow-lg">
          {/* Mobile Auth Bar */}
          {loggedUser ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#16a34a] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {loggedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1e293b] leading-tight">
                    {loggedUser.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[170px] leading-tight mt-0.5">
                    {loggedUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold rounded-xl text-center shadow-sm transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1e293b] text-sm font-semibold rounded-xl text-center transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Search Bar inside Mobile / Tablet Menu */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full h-[42px] bg-white text-[#364153] placeholder-[#889397] text-[14px] rounded-full pl-4 pr-11 border border-[#dfe2e1] focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-sm"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </form>

          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                pathname === "/"
                  ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                pathname === "/shop"
                  ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:bg-gray-50"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                pathname === "/categories"
                  ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:bg-gray-50"
              }`}
            >
              Categories
            </Link>
            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                pathname === "/brands"
                  ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                  : "text-[#364153] hover:bg-gray-50"
              }`}
            >
              Brands
            </Link>
            {loggedUser && (
              <>
                <Link
                  href="/allorders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                    pathname === "/allorders"
                      ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                      : "text-[#364153] hover:bg-gray-50"
                  }`}
                >
                  My Orders
                </Link>
                <Link
                  href="/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                    pathname === "/addresses"
                      ? "bg-[#e8fadf] text-[#16a34a] font-semibold"
                      : "text-[#364153] hover:bg-gray-50"
                  }`}
                >
                  My Addresses
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#5c6c75]">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#16a34a]" />
              <span>Support: +1 (800) 123-4567</span>
            </div>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#16a34a] font-semibold hover:underline"
            >
              My Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { Navbar };
