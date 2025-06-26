import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CenteredPromo, LeftAlignedPromo, MinimalRightPromo, MinimalLeftPromo, OverlayPromo, RightAlignedPromo, SplitPromo} from "@/components/promo";
import { CenteredContact, LeftAlignedContact, MinimalLeftContact, MinimalRightContact, RightAlignedContact } from "@/components/contact";
import { cn } from "@/lib/utils";
import { RightAlignedNewCollection, LeftAlignedNewCollection, OverlayNewCollection, CenteredNewCollection ,MinimalRightNewCollection, MinimalLeftNewCollection } from "@/components/new-collection";
import { TitleLeftContentCenterPolicies, CenteredPolicies, LeftPolicies, DefaultPolicies } from "@/components/policies";
import { RightAlignedAbout, CenteredAbout, LeftAlignedAbout,TopImageAbout } from "@/components/about-us";
import { GridCategoryTemplate, FeaturedGridCategoryTemplate, HorizontalScrollCategoryTemplate, ListViewCategoryTemplate } from "@/components/category-lists";
import {GridProductTemplate,HorizontalScrollProductTemplate,ListViewProductTemplate,FeaturedGridProductTemplate} from "@/components/product-lists";
import { ProductList } from "@/components/product-lists";

export default function Home() {
  return (
    
        <div className="min-h-screen flex flex-col">
        
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
      <ProductList
        products={[
          {
            name: "Product 1",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-1"
          },
          {
            name: "Product 2",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-2"
          },
          {
            name: "Product 3",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-3"
          },
          {
            name: "Product 4",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-4"
          },
          {
            name: "Product 5",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-4"
          },
          {
            name: "Product 6",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-4"
          },
          {
            name: "Product 7",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-4"
          },
          {
            name: "Product 8",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            price: {
              price: 100
            },
            description: "This is a description of the product",
            slug: "product-4"
          }
        ]}
        title="Featured Products"
        titleColor="text-black"
        titlePosition="top"
        titleFontSize="text-2xl"
        titleFont="font-bold"
        columns={{ sm: 2, md: 3, lg: 3}}
        bgColor="bg-[#F5ECD5]"
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
        showMorebuttonBgColor="bg-[#4A102A]"
        showMorebuttonTextColor="text-[#F5ECD5]"
      />
      
      <FeaturedGridCategoryTemplate
        categories={[
          {
            name: "Rings",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            slug: "rings"
          },
          {
            name: "Earrings",
            media: {
              mainMedia: {
                image: {
                  url: "/earing.jpg"
                }
              }
            },
            slug: "earrings"
          },
          {
            name: "Necklaces",
            media: {
              mainMedia: {
                image: {
                  url: "/neckless.jpg"
                }
              }
            },
            slug: "necklaces"
          },
          {
            name: "Rings",
            media: {
              mainMedia: {
                image: {
                  url: "/ring2.jpg"
                }
              }
            },
            slug: "rings"
          },
          {
            name: "Earrings",
            media: {
              mainMedia: {
                image: {
                  url: "/earing.jpg"
                }
              }
            },
            slug: "earrings"
          },
          {
            name: "Necklaces",
            media: {
              mainMedia: {
                image: {
                  url: "/neckless.jpg"
                }
              }
            },
            slug: "necklaces"
          }

        ]}
        
        bgColor="bg-[#F5ECD5]"
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
        showMorebuttonBgColor="bg-[#4A102A]"
        showMorebuttonTextColor="text-[#F5ECD5]"
      />
      <TopImageAbout
        id="about-us"
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
      <CenteredNewCollection
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
      <MinimalRightContact
        id="contact"
        imageUrl="/ring.jpg"
        backgroundColor="bg-[#F5ECD5]"
        titleColor="text-[#4A102A]"
        contentFont="font-semibold"
        contentSize="text-lg"
        titleFont="font-bold"
        titleSize="text-3xl"
        contentColor="text-[#4A102A]"
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
          twitter: "https://www.x.com"
        }}
      />
      <TitleLeftContentCenterPolicies
        id="policies"
        backgroundColor="bg-[#F5ECD5]"
        title="Our Policies"
        titleFont="font-sans"
        titleFontWeight="font-bold"
        titleSize="text-4xl"
        titleColor="text-[#4A102A]"
        sectionTitleColor="text-[#4A102A]"
        sectionTitleSize="text-lg"
        sectionTitleFont="font-sans"    
        sectionTitleFontWeight="font-normal"
        sectionContentColor="text-[#4A102A]"
        sectionContentSize="text-xl"
        sectionContentFont="font-sans"
        sectionContentFontWeight="font-normal"
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
        </div>
    
  );
};
