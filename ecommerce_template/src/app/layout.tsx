import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Footer} from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { CenteredPromo, LeftAlignedPromo, MinimalRightPromo, MinimalLeftPromo, OverlayPromo, RightAlignedPromo, SplitPromo} from "@/components/promo";
import { CenteredContact, LeftAlignedContact, MinimalLeftContact, MinimalRightContact, RightAlignedContact } from "@/components/contact";
import { cn } from "@/lib/utils";
import { RightAlignedNewCollection, LeftAlignedNewCollection, OverlayNewCollection, CenteredNewCollection ,MinimalRightNewCollection, MinimalLeftNewCollection } from "@/components/new-collection";
import { TitleLeftContentCenterPolicies, CenteredPolicies, LeftPolicies, DefaultPolicies } from "@/components/policies";
import { RightAlignedAbout, CenteredAbout, LeftAlignedAbout,TopImageAbout } from "@/components/about-us";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteCraft - E-commerce Template",
  description: "next js e-commerce template",
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
            template="template1"
            brandName="Jewelry"
            backgroundColor="bg-black/50"
            textColor="text-white"
            logo={{
              src: "/logo.png", 
              alt: "Custom Logo",
              width: 50,
              height: 50
            }}
            menuItems={[
              { label: "Home", href: "#home" },
              { label: "Products", href: "/products" },
              { label: "About Us", href: "#about-us" },
              { label: "Contact Us", href: "#contact" },
            ]}
            isRTL={false}
            iconColor="text-white"
            dividerColor="border-gray-200"
            searchIconColor="text-white"
            fontFamily="font-sans"
        />
        <CenteredPromo
        id="home"
        slides={[
          {
            title: "Welcome to Our Store",
            description: "Discover amazing products at great prices. Shop our latest collection and enjoy exclusive deals.",
            buttonText: "Shop Now",
            buttonLink: "#new-collection",
            image: "/girl.jpg",
            imageAlt: "Welcome to our store"
          },
          {
            title: "New Collection",
            description: "Check out our newest products. Limited time offers with free shipping on all orders.",
            buttonText: "View Collection",
            buttonLink: "#new-collection",
            image: "/hand.jpg",
            imageAlt: "New arrivals collection"
          },
        ]}
        backgroundColor="bg-[#F5ECD5]"
        titleFont="font-sans"
        titleColor="text-white"
        titleSize="text-4xl"
        buttonFont="font-sans"
        buttonColor="bg-white"
        buttonTextColor="text-black"
        buttonSize="text-lg"
        buttonRadius="rounded-md"
        imageObjectFit="cover"
      />
      <CenteredAbout
        id="about"
        backgroundColor="bg-[#F5ECD5]"
        title="About Us"
        titleColor="text-black"
        descriptionColor="text-gray-600"
        description="We are a passionate team dedicated to bringing you the best products and services. Our mission is to make your shopping experience exceptional."
        secondaryDescription="With years of experience in the industry, we understand what our customers need and strive to exceed their expectations."
        image="/about.jpg"
        imageAlt="About our company"
        imageObjectFit="cover"
      />
      <MinimalLeftNewCollection
        id="new-collection"
        backgroundColor="bg-[#F5ECD5]"
        title="New Collection"
        buttonText="View Collection"
        buttonLink="/products"
        buttonColor="bg-[#F5ECD5]"
        titleColor="text-[#F5ECD5]"
        image="/hand.jpg"
        imageAlt="New arrivals collection"
        imageObjectFit="cover"
      />
      <RightAlignedContact
        id="contact"
        imageUrl="/contact.jpg"
        backgroundColor="bg-[#F5ECD5]"
        titleColor="text-black"
        contentColor="text-gray-600"
        showMap={true}
        title="Contact Us"
        address="123 Main Street, City, Country"
        openHours="Monday - Friday: 9:00 AM - 6:00 PM"
        phone="+1 234 567 890"
        contactEmail="contact@example.com"
        socialLinks={{
          facebook: "#",
          instagram: "#",
          twitter: "#"
        }}
      />
      <TitleLeftContentCenterPolicies
        id="policies"
        backgroundColor="bg-[#F5ECD5]"
        title="Our Policies"
        sections={[
          {
            title: "Shipping Policy",
            content: "We offer worldwide shipping with tracking. Orders are processed within 1-2 business days."
          },
          {
            title: "Return Policy",
            content: "30-day return policy for unused items in original packaging."
          },
          {
            title: "Privacy Policy",
            content: "We respect your privacy and protect your personal information."
          }
        ]}
      />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer
            companyName="Jewelry"
            textColor="text-[#4A102A]"
            companyLogo={{
              src: "/logo.png", 
              alt: "Custom Logo",
              width: 50,
              height: 50
            }}
            aboutLinks={[
              {
                label: "Policies",
                href: "#policies",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-[#4A102A]"
              },
              {
                label: "About Us",
                href: "#about-us",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-[#4A102A]"
              },
            ]}
            socialMedia={{
              facebook: "https://facebook.com/amnayahia26",
              instagram: "https://instagram.com/amnayahia26",
              email: "amnayahia26@gmail.com",
            }}
            socialMediaStyles={{
              iconSize: 24,
              iconColor: "text-[#4A102A]",
              hoverColor: "text-[#4A102A]"
            }}
            copyrightStyles={{
              font: "font-sans",
              fontSize: "text-s",
              fontWeight: "font-light",
              fontColor: "text-[#4A102A]"
            }}
            backgroundColor="bg-[#F5ECD5]"
          />
        </div>
      </body>
    </html>
  );
};
