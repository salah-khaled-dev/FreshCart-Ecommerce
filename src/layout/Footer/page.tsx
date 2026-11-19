import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default function Footer() {
  const shopLinks = [
    { name: "All Products", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
    { name: "Electronics", href: "/categories/6439d2d167d9aa4ca970649f" },
    { name: "Men's Fashion", href: "/categories/6439d5b90049ad0b52b90048" },
    { name: "Women's Fashion", href: "/categories/6439d58a0049ad0b52b9003f" },
  ];

  const accountLinks = [
    { name: "My Account", href: "/addresses" },
    { name: "Order History", href: "/allorders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Shopping Cart", href: "/cart" },
    { name: "Sign In", href: "/login" },
    { name: "Create Account", href: "/register" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/" },
    { name: "Help Center", href: "/" },
    { name: "Shipping Info", href: "/" },
    { name: "Returns & Refunds", href: "/" },
    { name: "Track Order", href: "/" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/" },
    { name: "Terms of Service", href: "/" },
    { name: "Cookie Policy", href: "/" },
  ];

  return (
    <footer className="w-full font-sans mt-auto">
      {/* ── Top Trust Features Bar (Fixed Above Footer Across All Pages) ── */}
      <div className="w-full bg-[#ecfaee] border-t border-b border-[#d8f3de]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center">
            {/* 1. Free Shipping */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#d5f5dc] text-[#16a34a] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-bold text-[#1e293b]">
                  Free Shipping
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  On orders over 500 EGP
                </p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#d5f5dc] text-[#16a34a] flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-bold text-[#1e293b]">
                  Easy Returns
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  14-day return policy
                </p>
              </div>
            </div>

            {/* 3. Secure Payment */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#d5f5dc] text-[#16a34a] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-bold text-[#1e293b]">
                  Secure Payment
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  100% secure checkout
                </p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#d5f5dc] text-[#16a34a] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-bold text-[#1e293b]">
                  24/7 Support
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  Contact us anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Dark Footer Content ── */}
      <div className="w-full bg-[#101828] text-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Info, Contact & Social (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4">
            {/* White Logo Badge Card */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-sm mb-6 transition-transform hover:scale-105"
            >
              <div className="w-[30px] h-[30px] text-[#16a34a] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[28px] h-[28px]"
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
              <span className="text-[22px] font-bold tracking-tight text-[#1c2c34]">
                FreshCart
              </span>
            </Link>

            {/* Description Text */}
            <p className="text-[#94a3b8] text-[14px] leading-relaxed mb-6 max-w-sm">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at competitive
              prices with a seamless shopping experience.
            </p>

            {/* Contact Details */}
            <div className="space-y-3 text-[14px] mb-6">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-3 text-[#cbd5e1] hover:text-[#16a34a] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#16a34a] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </a>

              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-3 text-[#cbd5e1] hover:text-[#16a34a] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#16a34a] shrink-0" />
                <span>support@freshcart.com</span>
              </a>

              <div className="flex items-start gap-3 text-[#cbd5e1]">
                <MapPin className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#16a34a] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#16a34a] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#16a34a] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#16a34a] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-[16px] font-bold mb-5 tracking-tight">
              Shop
            </h3>
            <ul className="space-y-3 text-[14px]">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94a3b8] hover:text-[#16a34a] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-[16px] font-bold mb-5 tracking-tight">
              Account
            </h3>
            <ul className="space-y-3 text-[14px]">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94a3b8] hover:text-[#16a34a] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-[16px] font-bold mb-5 tracking-tight">
              Support
            </h3>
            <ul className="space-y-3 text-[14px]">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94a3b8] hover:text-[#16a34a] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-[16px] font-bold mb-5 tracking-tight">
              Legal
            </h3>
            <ul className="space-y-3 text-[14px]">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94a3b8] hover:text-[#16a34a] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Payment Badges ── */}
        <div className="mt-14 pt-6 border-t border-[#1e293b]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>© 2026 FreshCart. All rights reserved.</p>

          <div className="flex items-center gap-5 text-xs text-[#94a3b8]">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <CreditCard className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Visa</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <CreditCard className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Mastercard</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <CreditCard className="w-3.5 h-3.5 text-[#64748b]" />
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}

export { Footer };
