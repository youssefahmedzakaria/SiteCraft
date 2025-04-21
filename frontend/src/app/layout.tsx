import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LayoutWrapper } from "@/components/layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteCraft",
  description: "Build and grow your online store with SiteCraft. Local payment integration, Arabic support, and powerful e-commerce tools.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon32.png", sizes: "32x32", type: "image/png" }
    ]
  }
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
        <LayoutWrapper> {children}</LayoutWrapper>
      </body>
    </html>
  );
}
