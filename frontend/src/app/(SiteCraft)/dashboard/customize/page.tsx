"use client";
import React, { useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/dashboard/customize/sidebar";
import { Eye } from "lucide-react";
import { TitleLeftContentCenterPolicies } from "@/components/e-commerce/policies/templates/titleLeftContentCenter";
import { MinimalRightContact } from "@/components/e-commerce/contact/templates/minimal-right";
import { TopImageAbout } from "@/components/e-commerce/about-us/templates/top-image-about";
import FeaturedGridCategoryTemplate from "@/components/e-commerce/category-lists/templates/featured-grid-template";
import ProductList from "@/components/e-commerce/product-lists/product-list";
import { CenteredPromo } from "@/components/e-commerce/promo/templates/centered-promo";

export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-center h-16">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            {/* preview */}
            <Button variant="outline" className="bg-white">
              <span className="flex items-center gap-2">
                <Eye size={20} />
                Preview
              </span>
            </Button>
            {/* views */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "desktop" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("desktop")}
              >
                Desktop
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "tablet" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("tablet")}
              >
                Tablet
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "mobile" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>
          {/* go to dashboard on saving  */}
          <Button
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Save Changes
          </Button>
        </div>

        {/* Content preview area */}
        <div className="flex-1 p-4 bg-gray-100 rounded-lg overflow-y-auto">
          <CenteredPromo
            isClickable={false}
            id="promo"
            slides={[
              {
                title: "Welcome to Our Store",
                description:
                  "Discover amazing products at great prices. Shop our latest collection and enjoy exclusive deals.",
                buttonText: "Shop Now",
                buttonLink: "#new-collection",
                image: "/girl.jpg",
                imageAlt: "Welcome to our store",
              },
              {
                title: "New Collection",
                description:
                  "Check out our newest products. Limited time offers with free shipping on all orders.",
                buttonText: "View Collection",
                buttonLink: "#new-collection",
                image: "/hand.jpg",
                imageAlt: "New arrivals collection",
              },
            ]}
            backgroundColor="bg-white"
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
          <ProductList
            isClickable={false}
            products={[
              {
                name: "Product 1",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-1",
              },
              {
                name: "Product 2",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-2",
              },
              {
                name: "Product 3",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-3",
              },
              {
                name: "Product 4",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-4",
              },
              {
                name: "Product 5",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-5",
              },
              {
                name: "Product 6",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-6",
              },
              {
                name: "Product 7",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-7",
              },
              {
                name: "Product 8",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                price: {
                  price: 100,
                },
                description: "This is a description of the product",
                id: "product-8",
              },
            ]}
            template="featured"
            title="Featured Products"
            titleColor="text-black"
            titlePosition="top"
            titleFontSize="text-2xl"
            titleFont="font-bold"
            columns={{ sm: 2, md: 3, lg: 4 }}
            bgColor="bg-white"
            textColor="text-black"
            borderRadius="rounded-lg"
            showTitle={true}
            fontFamily="font-sans"
            hoverEffect={true}
            cardVariant="hover"
            showSubtitle={true}
            showCta={true}
            showMoreButton={true}
            ctaText="Shop Now"
            cornerRadius="medium"
            cardShadow="shadow-lg"
            showMoreText="All Products"
            showMorebuttonBgColor="bg-black"
            showMorebuttonTextColor="text-white"
          />
          <FeaturedGridCategoryTemplate
            isClickable={false}
            categories={[
              {
                name: "Rings",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                id: "1",
              },
              {
                name: "Earrings",
                media: {
                  mainMedia: {
                    image: {
                      url: "/earing.jpg",
                    },
                  },
                },
                id: "2",
              },
              {
                name: "Necklaces",
                media: {
                  mainMedia: {
                    image: {
                      url: "/neckless.jpg",
                    },
                  },
                },
                id: "3",
              },
              {
                name: "Rings",
                media: {
                  mainMedia: {
                    image: {
                      url: "/ring2.jpg",
                    },
                  },
                },
                id: "4",
              },
              {
                name: "Earrings",
                media: {
                  mainMedia: {
                    image: {
                      url: "/earing.jpg",
                    },
                  },
                },
                id: "5",
              },
              {
                name: "Necklaces",
                media: {
                  mainMedia: {
                    image: {
                      url: "/neckless.jpg",
                    },
                  },
                },
                id: "6",
              },
            ]}
            bgColor="bg-white"
            textColor="text-black"
            borderRadius="rounded-lg"
            showTitle={true}
            fontFamily="font-sans"
            hoverEffect={true}
            cardVariant="featured"
            showCta={true}
            ctaText="Shop Now"
            overlayColor="bg-black/30"
            showMoreButton={true}
            showMoreText="Show More"
            showMorebuttonBgColor="bg-black"
            showMorebuttonTextColor="text-white"
          />
          <TopImageAbout
            id="about"
            backgroundColor="bg-white"
            title="About Us"
            titleColor="text-black"
            descriptionColor="text-gray-600"
            description="We are a passionate team dedicated to bringing you the best products and services. Our mission is to make your shopping experience exceptional."
            secondaryDescription="With years of experience in the industry, we understand what our customers need and strive to exceed their expectations."
            image="/about.jpg"
            imageAlt="About our company"
            imageObjectFit="cover"
          />
          <MinimalRightContact
            isClickable={false}
            id="contact"
            imageUrl="/ring.jpg"
            backgroundColor="bg-white"
            titleColor="text-black"
            contentFont="font-semibold"
            contentSize="text-lg"
            titleFont="font-bold"
            titleSize="text-3xl"
            contentColor="text-black"
            showMap={true}
            title="Contact Us"
            address="masr el gedida, cairo, egypt"
            addressUrl="https://www.google.com/maps?q=30.0890922546387,31.2838287353516"
            openHours="Monday - Friday: 9:00 AM - 6:00 PM"
            phone="+1 234 567 890"
            contactEmail="contact@example.com"
            socialLinks={{
              facebook: "https://www.facebook.com",
              instagram: "https://www.instagram.com",
              twitter: "https://www.x.com",
            }}
          />
          <TitleLeftContentCenterPolicies
            id="policies"
            backgroundColor="bg-white"
            title="Our Policies"
            titleFont="font-sans"
            titleFontWeight="font-normal"
            titleSize="text-xl"
            titleColor="text-black"
            sectionTitleColor="text-black"
            sectionTitleSize="text-lg"
            sectionTitleFont="font-sans"
            sectionTitleFontWeight="font-normal"
            sectionContentColor="text-black"
            sectionContentSize="text-xl"
            sectionContentFont="font-sans"
            sectionContentFontWeight="font-normal"
            sections={[
              {
                title: "Shipping Policy",
                content:
                  "We offer worldwide shipping with tracking. Orders are processed within 1-2 business days.",
              },
              {
                title: "Return Policy",
                content:
                  "30-day return policy for unused items in original packaging.",
              },
              {
                title: "Privacy Policy",
                content:
                  "We respect your privacy and protect your personal information.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
