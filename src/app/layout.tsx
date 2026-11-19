import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const exo = Exo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshCart - eCommerce Grocery & Supermarket",
  description: "FreshCart Grocery & Supermarket eCommerce Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-[#21313c] antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
