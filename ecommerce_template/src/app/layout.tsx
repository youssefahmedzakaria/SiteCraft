import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteCraft - E-commerce Template",
  description: "next js e-commerce template",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <CartProvider>
          <FavoritesProvider>
            <LayoutWrapper> {children}</LayoutWrapper>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}