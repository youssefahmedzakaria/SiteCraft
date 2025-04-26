
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer} from "@/components/footer/Footer";
import Navbar  from "@/components/navbar/Navbar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
        <Navbar
            template="template3"
            brandName="SHOPPIFY"
            backgroundColor="bg-blue-900"
            textColor="text-white"
            logo={{
              src: "/logo.png", 
              alt: "Custom Logo",
              width: 50,
              height: 50
            }}
            menuItems={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "About Us", href: "/about" },
              { label: "Contact Us", href: "/contact" },
            ]}
            isRTL={false}
            iconColor="text-white"
            dividerColor="border-gray-200"
            searchIconColor="text-white"
            fontFamily="font-sans"
        />
          <main className="flex-grow">
            {children}
          </main>
          <Footer
            companyName="SHOPPIFY"
            textColor="text-white"
            companyLogo={{
              src: "/logo.png", 
              alt: "Custom Logo",
              width: 50,
              height: 50
            }}
            aboutLinks={[
              {
                label: "Policies",
                href: "/policies",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-white"
              },
              {
                label: "About Us",
                href: "/about",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-white"
              },
              
            ]}
            socialMedia={{
              facebook: "https://facebook.com/amnayahia26",
              instagram: "https://instagram.com/amnayahia26",
              email: "amnayahia26@gmail.com",
            }}
            socialMediaStyles={{
              iconSize: 24,
              iconColor: "text-white",
              hoverColor: "text-blue-200"
            }}
            copyrightStyles={{
              font: "font-sans",
              fontSize: "text-s",
              fontWeight: "font-light",
              fontColor: "text-gray-300"
            }}
            backgroundColor="bg-blue-900"
          />
        </div>
      </body>
    </html>
  );
}