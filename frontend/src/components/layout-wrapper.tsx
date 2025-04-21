'use client'

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup');

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}