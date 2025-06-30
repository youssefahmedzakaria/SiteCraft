/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react"
import { Button } from "@/components/SiteCraft/ui/button"
import { Sidebar } from "@/components/SiteCraft/dashboard/customize/sidebar"
import { Eye, X } from "lucide-react"
import { TitleLeftContentCenterPolicies } from "@/components/e-commerce/policies/templates/titleLeftContentCenter"
import { DefaultPolicies } from "@/components/e-commerce/policies/templates/default"
import { LeftPolicies } from "@/components/e-commerce/policies/templates/left"
import { CenteredPolicies } from "@/components/e-commerce/policies/templates/centerd"
import { MinimalRightContact } from "@/components/e-commerce/contact/templates/minimal-right"
import { CenteredContact } from "@/components/e-commerce/contact/templates/centered-contact"
import { LeftAlignedContact } from "@/components/e-commerce/contact/templates/left-aligned"
import { RightAlignedContact } from "@/components/e-commerce/contact/templates/right-aligned"
import { MinimalLeftContact } from "@/components/e-commerce/contact/templates/minimal-left"
import { TopImageAbout } from "@/components/e-commerce/about-us/templates/top-image-about"
import { CenteredAbout } from "@/components/e-commerce/about-us/templates/centered-about"
import { LeftAlignedAbout } from "@/components/e-commerce/about-us/templates/left-aligned-about"
import { RightAlignedAbout } from "@/components/e-commerce/about-us/templates/right-aligned-about"
import ProductList from "@/components/e-commerce/product-lists/product-list"
import { CenteredPromo } from "@/components/e-commerce/promo/templates/centered-promo"
import type {
  AboutCustomizationAttributes,
  ContactCustomizationAttributes,
  FooterCustomizationAttributes,
  HeaderCustomizationAttributes,
  PoliciesCustomizationAttributes,
  PromoCustomizationAttributes,
} from "@/lib/customization"
import Navbar from "@/components/e-commerce/navbar/Navbar"
import { Footer } from "@/components/e-commerce/footer/Footer"
import {
  LeftAlignedPromo,
  MinimalLeftPromo,
  MinimalRightPromo,
  OverlayPromo,
  RightAlignedPromo,
  SplitPromo,
} from "@/components/e-commerce/promo"
import { HorizontalScrollCategoryTemplate } from "@/components/e-commerce/category-lists/templates/horizontal-scroll-template"

interface Section {
  id: string
  title: string
  expanded: boolean
}

const initialSections: Section[] = [
  {
    id: "Header&Menu",
    title: "Header & Menu",
    expanded: false,
  },
  {
    id: "PromoSlider",
    title: "Promo Slider",
    expanded: false,
  },
  {
    id: "Categories",
    title: "Categories",
    expanded: false,
  },
  {
    id: "Products",
    title: "Products",
    expanded: false,
  },
  {
    id: "AboutUs",
    title: "About Us",
    expanded: false,
  },
  {
    id: "Policies",
    title: "Policies",
    expanded: false,
  },
  {
    id: "ContactUs",
    title: "Contact Us",
    expanded: false,
  },
  {
    id: "Footer",
    title: "Footer",
    expanded: false,
  },
]

export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const initialHeader: HeaderCustomizationAttributes = {
    template: "template1",
    brandName: "Jewelry",
    backgroundColor: "bg-[#00000080]", // bg-black/50
    textColor: "text-[#FFFFFF]", // text-white
    logo: {
      src: "/logo.png",
      alt: "Custom Logo",
      width: 50,
      height: 50,
    },
    menuItems: [
      { label: "Home", isShown: true },
      { label: "Products", isShown: true },
      { label: "Categories", isShown: true },
      { label: "About Us", isShown: true },
      { label: "Contact Us", isShown: true },
    ],
    iconColor: "text-[#FFFFFF]", // text-white
    dividerColor: "border-[#E5E7EB]", // border-gray-200
    searchIconColor: "text-[#FFFFFF]", // text-white
    fontFamily: "font-sans",
  }

  // State for header customization
  const [headerAttributes, setHeaderAttributes] = useState<HeaderCustomizationAttributes>(initialHeader)

  // Function to update header attributes
  const updateHeaderAttributes = (updates: Partial<HeaderCustomizationAttributes>) => {
    setHeaderAttributes((prev) => ({ ...prev, ...updates }))
  }

  const initialPromo: PromoCustomizationAttributes = {
    template: "CenteredPromo",
    id: "promo",
    autoPlay: false,
    showArrows: true,
    slides: [
      {
        title: "Welcome to Our Store",
        description: "Discover amazing products at great prices. Shop our latest collection and enjoy exclusive deals.",
        buttonText: "Shop Now",
        buttonLink: "#new-collection",
        image: "/girl.jpg",
        imageAlt: "Welcome to our store",
      },
      {
        title: "New Collection",
        description: "Check out our newest products. Limited time offers with free shipping on all orders.",
        buttonText: "View Collection",
        buttonLink: "#new-collection",
        image: "/hand.jpg",
        imageAlt: "New arrivals collection",
      },
    ],
    backgroundColor: "bg-[#FFFFFF]", // bg-white
    titleFont: "font-sans",
    titleColor: "text-[#FFFFFF]", // text-white
    titleSize: "text-4xl",
    descriptionFont: "font-sans",
    descriptionColor: "text-[#FFFFFF]", // text-white
    descriptionSize: "text-lg",
    buttonFont: "font-sans",
    buttonColor: "bg-[#FFFFFF]", // bg-white
    buttonTextColor: "text-[#000000]", // text-black
    buttonSize: "text-lg",
    buttonRadius: "rounded-md",
    imageObjectFit: "cover",
  }

  // State for promo customization
  const [promoAttributes, setPromoAttributes] = useState<PromoCustomizationAttributes>(initialPromo)

  // Function to update promo attributes
  const updatePromoAttributes = (updates: Partial<PromoCustomizationAttributes>) => {
    setPromoAttributes((prev) => ({ ...prev, ...updates }))
  }

  const initialAbout: AboutCustomizationAttributes = {
    template: "TopImageAbout",
    id: "about",
    title: "About Us",
    titleColor: "text-[#000000]", // text-black
    description:
      "We are a passionate team dedicated to bringing you the best products and services. Our mission is to make your shopping experience exceptional.",
    secondaryDescription:
      "With years of experience in the industry, we understand what our customers need and strive to exceed their expectations.",
    descriptionColor: "text-[#4B5563]", // text-gray-600
    backgroundColor: "bg-[#FFFFFF]", // bg-white
    image: "/about.jpg",
    imageAlt: "About our company",
    imageObjectFit: "cover",
    titleFont: "font-sans",
    titleSize: "text-4xl",
    descriptionFont: "font-sans",
    descriptionSize: "text-lg",
  }

  // State for about customization
  const [aboutAttributes, setAboutAttributes] = useState<AboutCustomizationAttributes>(initialAbout)

  // Function to update about attributes
  const updateAboutAttributes = (updates: Partial<AboutCustomizationAttributes>) => {
    setAboutAttributes((prev) => ({ ...prev, ...updates }))
  }

  const initialPolicies: PoliciesCustomizationAttributes = {
    template: "TitleLeftContentCenterPolicies",
    id: "policies",
    title: "Our Policies",
    sections: [
      {
        title: "Shipping Policy",
        content: "We offer worldwide shipping with tracking. Orders are processed within 1-2 business days.",
      },
      {
        title: "Return Policy",
        content: "30-day return policy for unused items in original packaging.",
      },
      {
        title: "Privacy Policy",
        content: "We respect your privacy and protect your personal information.",
      },
    ],
    backgroundColor: "bg-[#FFFFFF]", // bg-white
    titleColor: "text-[#000000]", // text-black
    titleSize: "text-xl",
    titleFont: "font-sans",
    titleFontWeight: "font-normal",
    sectionTitleColor: "text-[#000000]", // text-black
    sectionTitleSize: "text-lg",
    sectionTitleFont: "font-sans",
    sectionTitleFontWeight: "font-normal",
    sectionContentColor: "text-[#000000]", // text-black
    sectionContentSize: "text-xl",
    sectionContentFont: "font-sans",
    sectionContentFontWeight: "font-normal",
  }

  // State for policies customization
  const [policiesAttributes, setPoliciesAttributes] = useState<PoliciesCustomizationAttributes>(initialPolicies)

  // Function to update policies attributes
  const updatePoliciesAttributes = (updates: Partial<PoliciesCustomizationAttributes>) => {
    setPoliciesAttributes((prev) => ({ ...prev, ...updates }))
  }

  const initialContact: ContactCustomizationAttributes = {
    template: "MinimalRightContact",
    id: "contact",
    title: "Contact Us",
    address: "masr el gedida, cairo, egypt",
    addressUrl: "https://www.google.com/maps?q=30.0890922546387,31.2838287353516",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    phone: "+1 234 567 890",
    contactEmail: "contact@example.com",
    socialLinks: {
      facebook: "https://www.facebook.com",
      instagram: "https://www.instagram.com",
      twitter: "https://www.x.com",
    },
    imageUrl: "/ring.jpg",
    showMap: true,
    backgroundColor: "bg-[#FFFFFF]",
    titleFont: "font-bold",
    titleColor: "text-[#000000]",
    titleSize: "text-3xl",
    contentFont: "font-semibold",
    contentColor: "text-[#000000]",
    contentSize: "text-lg",
  }

  // State for contact customization
  const [contactAttributes, setContactAttributes] = useState<ContactCustomizationAttributes>(initialContact)

  // Function to update contact attributes
  const updateContactAttributes = (updates: Partial<ContactCustomizationAttributes>) => {
    setContactAttributes((prev) => ({ ...prev, ...updates }))
  }

  const initialFooter: FooterCustomizationAttributes = {
    brandName: "BRAND",
    backgroundColor: "bg-[#FFFFFF]",
    textColor: "text-[#000000]",
    logo: {
      src: "/logo.png",
      alt: "Company Logo",
      size: "24",
    },
    aboutLinks: [
      {
        label: "Contact Us",
        href: "/contact",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-[#000000]",
      },
      {
        label: "About Us",
        href: "/about",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-[#000000]",
      },
      {
        label: "Policies",
        href: "/policies",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-[#000000]",
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/yourpage",
      instagram: "https://instagram.com/yourpage",
    },
    socialMediaStyles: {
      iconSize: 20,
      iconColor: "text-[#000000]",
      hoverColor: "text-[#000000]",
    },
    copyrightStyles: {
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-light",
      fontColor: "text-[#000000]",
    },
  }

  // State for footer customization
  const [footerAttributes, setFooterAttributes] = useState<FooterCustomizationAttributes>(initialFooter)

  // Function to update footer attributes
  const updateFooterAttributes = (updates: Partial<FooterCustomizationAttributes>) => {
    setFooterAttributes((prev) => ({ ...prev, ...updates }))
  }

  const sectionComponents = {
    PromoSlider: {
      CenteredPromo: <CenteredPromo {...promoAttributes} isClickable={false} />,
      LeftAlignedPromo: <LeftAlignedPromo {...promoAttributes} isClickable={false} />,
      RightAlignedPromo: <RightAlignedPromo {...promoAttributes} isClickable={false} />,
      MinimalLeftPromo: <MinimalLeftPromo {...promoAttributes} isClickable={false} />,
      MinimalRightPromo: <MinimalRightPromo {...promoAttributes} isClickable={false} />,
      OverlayPromo: <OverlayPromo {...promoAttributes} isClickable={false} />,
      SplitPromo: <SplitPromo {...promoAttributes} isClickable={false} />,
    },
    Products: {
      ProductList: (
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
      ),
    },
    Categories: {
      FeaturedGrid: (
        <HorizontalScrollCategoryTemplate
          isClickable={false}
          showControls={false}
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
      ),
    },
    AboutUs: {
      TopImageAbout: <TopImageAbout {...aboutAttributes} />,
      CenteredAbout: <CenteredAbout {...aboutAttributes} />,
      LeftAlignedAbout: <LeftAlignedAbout {...aboutAttributes} />,
      RightAlignedAbout: <RightAlignedAbout {...aboutAttributes} />,
    },
    ContactUs: {
      MinimalRightContact: <MinimalRightContact {...contactAttributes} />,
      CenteredContact: <CenteredContact {...contactAttributes} />,
      LeftAlignedContact: <LeftAlignedContact {...contactAttributes} />,
      RightAlignedContact: <RightAlignedContact {...contactAttributes} />,
      MinimalLeftContact: <MinimalLeftContact {...contactAttributes} />,
    },
    Policies: {
      TitleLeftContentCenterPolicies: <TitleLeftContentCenterPolicies {...policiesAttributes} />,
      DefaultPolicies: <DefaultPolicies {...policiesAttributes} />,
      LeftPolicies: <LeftPolicies {...policiesAttributes} />,
      CenteredPolicies: <CenteredPolicies {...policiesAttributes} />,
    },
  }

  const [sections, setSections] = useState<Section[]>(initialSections)

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-80 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Customize Template</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            headerAttributes={headerAttributes}
            updateHeaderAttributes={updateHeaderAttributes}
            promoAttributes={promoAttributes}
            updatePromoAttributes={updatePromoAttributes}
            aboutAttributes={aboutAttributes}
            updateAboutAttributes={updateAboutAttributes}
            policiesAttributes={policiesAttributes}
            updatePoliciesAttributes={updatePoliciesAttributes}
            contactAttributes={contactAttributes}
            updateContactAttributes={updateContactAttributes}
            footerAttributes={footerAttributes}
            updateFooterAttributes={updateFooterAttributes}
            sections={sections}
            setSections={setSections}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-center min-h-[64px] relative z-30">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>

            {/* Preview Button */}
            <Button variant="outline" className="bg-white">
              <span className="flex items-center gap-2">
                <Eye size={20} />
                Preview
              </span>
            </Button>

            {/* Device Views */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${selectedTab === "desktop" ? "bg-gray-100" : "bg-white"}`}
                onClick={() => setSelectedTab("desktop")}
              >
                Desktop
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${selectedTab === "tablet" ? "bg-gray-100" : "bg-white"}`}
                onClick={() => setSelectedTab("tablet")}
              >
                Tablet
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${selectedTab === "mobile" ? "bg-gray-100" : "bg-white"}`}
                onClick={() => setSelectedTab("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Save Button */}
          <Button
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={() => {
              window.location.href = "/dashboard"
            }}
          >
            Save Changes
          </Button>
        </div>

        {/* Content preview area */}
        <div className="flex-1 p-4 bg-gray-100 rounded-lg overflow-y-auto">
          <div
            className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${
              selectedTab === "desktop"
                ? "w-full max-w-6xl"
                : selectedTab === "tablet"
                  ? "w-full max-w-2xl"
                  : "w-full max-w-sm"
            }`}
          >
            <Navbar
              isCustomize={true}
              // selectedTab={selectedTab}
              template={headerAttributes.template}
              brandName={headerAttributes.brandName}
              backgroundColor={headerAttributes.backgroundColor}
              textColor={headerAttributes.textColor}
              logo={headerAttributes.logo}
              menuItems={headerAttributes.menuItems.map((item) => ({
                label: item.label,
                href: "#",
                isShown: item.isShown,
              }))}
              iconColor={headerAttributes.iconColor}
              dividerColor={headerAttributes.dividerColor}
              searchIconColor={headerAttributes.iconColor}
              fontFamily={headerAttributes.fontFamily}
            />

            {/* Render middle sections dynamically */}
            {sections.slice(1, sections.length - 1).map((section, index) => {
              const sectionId = section.id as keyof typeof sectionComponents
              const sectionComponent = sectionComponents[sectionId]

              if (!sectionComponent) {
                return null
              }

              // Get the template for this section
              let template: string
              switch (sectionId) {
                case "PromoSlider":
                  template = promoAttributes.template
                  break
                case "Products":
                  template = "ProductList"
                  break
                case "Categories":
                  template = "FeaturedGrid"
                  break
                case "AboutUs":
                  template = aboutAttributes.template
                  break
                case "Policies":
                  template = policiesAttributes.template
                  break
                case "ContactUs":
                  template = contactAttributes.template
                  break
                default:
                  return null
              }

              // Get the component for this template
              const Component = sectionComponent[template as keyof typeof sectionComponent]

              if (!Component) {
                return null
              }

              return <div key={section.id}>{Component}</div>
            })}

            <Footer
              isCustomize={true}
              selectedTab={selectedTab}
              companyName={footerAttributes.brandName}
              textColor={footerAttributes.textColor}
              companyLogo={{
                src: footerAttributes.logo.src || "/logo.png",
                alt: footerAttributes.logo.alt,
                width: Number.parseInt(footerAttributes.logo.size) || 50,
                height: Number.parseInt(footerAttributes.logo.size) || 50,
              }}
              aboutLinks={footerAttributes.aboutLinks}
              socialMedia={footerAttributes.socialMedia}
              socialMediaStyles={footerAttributes.socialMediaStyles}
              copyrightStyles={footerAttributes.copyrightStyles}
              backgroundColor={footerAttributes.backgroundColor}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
