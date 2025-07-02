/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import {
  CenteredPromo,
  LeftAlignedPromo,
  MinimalRightPromo,
  MinimalLeftPromo,
  OverlayPromo,
  RightAlignedPromo,
  SplitPromo,
} from "@/components/e-commerce/promo";
import {
  CenteredContact,
  LeftAlignedContact,
  MinimalLeftContact,
  MinimalRightContact,
  RightAlignedContact,
} from "@/components/e-commerce/contact";
import { cn } from "@/lib/utils";
import {
  TitleLeftContentCenterPolicies,
  CenteredPolicies,
  LeftPolicies,
  DefaultPolicies,
} from "@/components/e-commerce/policies";
import {
  RightAlignedAbout,
  CenteredAbout,
  LeftAlignedAbout,
  TopImageAbout,
} from "@/components/e-commerce/about-us";
import {
  GridCategoryTemplate,
  FeaturedGridCategoryTemplate,
  HorizontalScrollCategoryTemplate,
} from "@/components/e-commerce/category-lists";
import {
  GridProductTemplate,
  HorizontalScrollProductTemplate,
  FeaturedGridProductTemplate,
} from "@/components/e-commerce/product-lists";
import { ProductList } from "@/components/e-commerce/product-lists";
import { usePathname } from "next/navigation";
import { link } from "fs";
import { Description } from "@radix-ui/react-dialog";
import {
  AboutCustomizationAttributes,
  CategoryCustomizationAttributes,
  ContactCustomizationAttributes,
  PoliciesCustomizationAttributes,
  ProductCustomizationAttributes,
  PromoCustomizationAttributes,
} from "@/lib/customization";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

export default function Home() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const initialSections: Section[] = [];
  const [sections, setSections] = useState<Section[]>(initialSections);

  const initialPromo: PromoCustomizationAttributes = {
    template: "CenteredPromo",
    id: "promo",
    autoPlay: false,
    showArrows: true,
    slides: [
      {
        title: "Welcome to Our Store",
        description:
          "Discover amazing products at great prices. Shop our latest collection and enjoy exclusive deals.",
        buttonText: "Shop Now",
        buttonLink: "#new-collection",
        image: "/placeholder.png",
        imageAlt: "Welcome to our store",
      },
      {
        title: "New Collection",
        description:
          "Check out our newest products. Limited time offers with free shipping on all orders.",
        buttonText: "View Collection",
        buttonLink: "#new-collection",
        image: "/placeholder.png",
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
  };

  // State for promo customization
  const [promoAttributes, setPromoAttributes] =
    useState<PromoCustomizationAttributes>(initialPromo);

  const initialCategory: CategoryCustomizationAttributes = {
    id: "categories",
    template: "FeaturedGrid", // You can adjust this if needed
    isClickable: false,
    title: "categories",
    bgColor: "bg-[#FFFFFF]",
    textColor: "text-[#000000]",
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: "bg-[#000000]",
    showMorebuttonTextColor: "text-[#EF4444]",
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "overlay",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showCategoryTitle: true,
    titleColor: "text-[#000000]",
    titleFontSize: "text-2xl",
    categoryTitleFontSize: "text-lg",
    // cardTextColor: "text-[#000000]", // Added a reasonable default value
    categories: [
      {
        id: "6",
        name: "Necklaces",
        Description: "Necklaces",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
      {
        id: "7",
        name: "Rings",
        Description: "Rings",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
      {
        id: "8",
        name: "Earrings",
        Description: "Earrings",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
      {
        id: "9",
        name: "Bracelets",
        Description: "Bracelets",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
      {
        id: "10",
        name: "Pendants",
        Description: "Pendants",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
      {
        id: "11",
        name: "Bangles",
        Description: "Bangles",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
      },
    ],
  };

  const updatePromoAttributes = (
    updates: Partial<PromoCustomizationAttributes>
  ) => {
    setPromoAttributes((prev) => ({ ...prev, ...updates }));
  };

  // State for category customization
  const [categoryAttributes, setCategoryAttributes] =
    useState<CategoryCustomizationAttributes>(initialCategory);

  const updateCategoryAttributes = (
    updates: Partial<CategoryCustomizationAttributes>
  ) => {
    setCategoryAttributes((prev) => ({ ...prev, ...updates }));
  };

  const initialProduct: ProductCustomizationAttributes = {
    id: "products",
    template: "FeaturedGrid", // You can adjust this if needed
    isClickable: false,
    title: "products",
    bgColor: "bg-[#FFFFFF]",
    textColor: "text-[#000000]",
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: "bg-[#000000]",
    showMorebuttonTextColor: "text-[#EF4444]",
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "overlay",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showProductTitle: true,
    titleColor: "text-[#000000]",
    titleFontSize: "text-2xl",
    productTitleFontSize: "text-lg",
    // cardTextColor: "text-[#000000]", // Added a reasonable default value
    products: [
      {
        id: "1",
        description: "Description",
        link: "#",
        price: "100.00",
        image: "/placeholder.png",
        imageAlt: "Product 1",
        title: "Product 1",
      },
      {
        id: "2",
        description: "Description",
        link: "#",
        price: "200.00",
        image: "/placeholder.png",
        imageAlt: "Product 2",
        title: "Product 2",
      },
      {
        id: "3",
        description: "Description",
        link: "#",
        price: "300.00",
        image: "/placeholder.png",
        imageAlt: "Product 3",
        title: "Product 3",
      },
      {
        id: "4",
        description: "Description",
        link: "#",
        price: "400.00",
        image: "/placeholder.png",
        imageAlt: "Product 4",
        title: "Product 4",
      },
      {
        id: "5",
        description: "Description",
        link: "#",
        price: "500.00",
        image: "/placeholder.png",
        imageAlt: "Product 5",
        title: "Product 5",
      },
    ],
  };

  // State for product customization
  const [productAttributes, setProductAttributes] =
    useState<ProductCustomizationAttributes>(initialProduct);

  const updateProductAttributes = (
    updates: Partial<ProductCustomizationAttributes>
  ) => {
    setProductAttributes((prev) => ({ ...prev, ...updates }));
  };

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
    image: "/placeholder.png",
    imageAlt: "About our company",
    imageObjectFit: "cover",
    titleFont: "font-sans",
    titleSize: "text-4xl",
    // titleFontWeight: "font-bold",
    descriptionFont: "font-sans",
    descriptionSize: "text-lg",
  };

  // State for about customization
  const [aboutAttributes, setAboutAttributes] =
    useState<AboutCustomizationAttributes>(initialAbout);

  const updateAboutAttributes = (
    updates: Partial<AboutCustomizationAttributes>
  ) => {
    setAboutAttributes((prev) => ({ ...prev, ...updates }));
  };

  const initialPolicies: PoliciesCustomizationAttributes = {
    template: "TitleLeftContentCenterPolicies",
    id: "policies",
    title: "Our Policies",
    sections: [
      {
        title: "Shipping Policy",
        content:
          "We offer worldwide shipping with tracking. Orders are processed within 1-2 business days.",
      },
      {
        title: "Return Policy",
        content: "30-day return policy for unused items in original packaging.",
      },
      {
        title: "Privacy Policy",
        content:
          "We respect your privacy and protect your personal information.",
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
  };

  // State for policies customization
  const [policiesAttributes, setPoliciesAttributes] =
    useState<PoliciesCustomizationAttributes>(initialPolicies);

  const updatePoliciesAttributes = (
    updates: Partial<PoliciesCustomizationAttributes>
  ) => {
    setPoliciesAttributes((prev) => ({ ...prev, ...updates }));
  };

  const initialContact: ContactCustomizationAttributes = {
    template: "MinimalRightContact",
    id: "contact",
    title: "Contact Us",
    address: "masr el gedida, cairo, egypt",
    addressUrl:
      "https://www.google.com/maps?q=30.0890922546387,31.2838287353516",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    phone: "+1 234 567 890",
    contactEmail: "contact@example.com",
    socialLinks: {
      facebook: "https://www.facebook.com",
      instagram: "https://www.instagram.com",
      twitter: "https://www.x.com",
    },
    image: "/placeholder.png",
    showMap: true,
    backgroundColor: "bg-[#FFFFFF]",
    titleFont: "font-bold",
    titleColor: "text-[#000000]",
    titleSize: "text-3xl",
    contentFont: "font-semibold",
    contentColor: "text-[#000000]",
    contentSize: "text-lg",
  };

  // State for contact customization
  const [contactAttributes, setContactAttributes] =
    useState<ContactCustomizationAttributes>(initialContact);

  const updateContactAttributes = (
    updates: Partial<ContactCustomizationAttributes>
  ) => {
    setContactAttributes((prev) => ({ ...prev, ...updates }));
  };

  const sectionComponents = {
    PromoSlider: {
      CenteredPromo: <CenteredPromo {...promoAttributes} isClickable={false} />,
      LeftAlignedPromo: (
        <LeftAlignedPromo {...promoAttributes} isClickable={false} />
      ),
      RightAlignedPromo: (
        <RightAlignedPromo {...promoAttributes} isClickable={false} />
      ),
      MinimalLeftPromo: (
        <MinimalLeftPromo {...promoAttributes} isClickable={false} />
      ),
      MinimalRightPromo: (
        <MinimalRightPromo {...promoAttributes} isClickable={false} />
      ),
      OverlayPromo: <OverlayPromo {...promoAttributes} isClickable={false} />,
      SplitPromo: <SplitPromo {...promoAttributes} isClickable={false} />,
    },
    Products: {
      FeaturedGrid: <FeaturedGridProductTemplate {...productAttributes} />,
      HorizontalScroll: (
        <HorizontalScrollProductTemplate {...productAttributes} />
      ),
      Grid: <GridProductTemplate {...productAttributes} />,
    },
    Categories: {
      FeaturedGrid: <FeaturedGridCategoryTemplate {...categoryAttributes} />,
      HorizontalScroll: (
        <HorizontalScrollCategoryTemplate {...categoryAttributes} />
      ),
      Grid: <GridCategoryTemplate {...categoryAttributes} />,
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
      TitleLeftContentCenterPolicies: (
        <TitleLeftContentCenterPolicies {...policiesAttributes} />
      ),
      DefaultPolicies: <DefaultPolicies {...policiesAttributes} />,
      LeftPolicies: <LeftPolicies {...policiesAttributes} />,
      CenteredPolicies: <CenteredPolicies {...policiesAttributes} />,
    },
  };

  const [isExist, setIsExist] = useState(false);
  const fetchTemplate = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/customize/getTemplateBySubdomain/" + subdomain,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const responseStore = await fetch(
        "http://localhost:8080/api/store/getStoreSettings",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      const dataStore = await responseStore.json();
      console.log("fetched template", data);
      console.log("fetched store", dataStore);
      if (
        data.success &&
        data["Customized Template"] &&
        dataStore.success &&
        dataStore.store
      ) {
        setIsExist(true);
        // ---------------------Customize Template----------------------------------
        const sortedTemplate = [...data["Customized Template"]].sort(
          (a, b) => a.index - b.index
        );
        const loadedSections: Section[] = [];
        sortedTemplate.forEach((section: any, idx: number) => {
          loadedSections.push({
            id: section.title,
            title: section.title.replace("&", " & "),
          });
          switch (section.title) {
            case "PromoSlider":
              updatePromoAttributes(section.value);
              break;
            case "AboutUs":
              updateAboutAttributes(section.value);
              break;
            case "Policies":
              updatePoliciesAttributes(section.value);
              break;
            case "Products":
              updateProductAttributes(section.value);
              break;
            case "Categories":
              updateCategoryAttributes(section.value);
              break;
          }
        });
        setSections(loadedSections);
        // ---------------------Store Settings----------------------------------
        setAboutAttributes((prev) => ({
          ...prev,
          description: dataStore.store.aboutUs?.[0]?.title || prev.description,
          secondaryDescription:
            dataStore.store.aboutUs?.[0]?.content || prev.description,
        }));
        // Policies (only sections)
        setPoliciesAttributes((prev) => ({
          ...prev,
          sections:
            dataStore.store.policies?.map((p: any) => ({
              title: p.title,
              content: p.description,
            })) || prev.sections,
        }));
        // Contact (only contactEmail and socialLinks)
        setContactAttributes((prev) => ({
          ...prev,
          contactEmail: dataStore.store.emailAddress || prev.contactEmail,
          socialLinks: {
            facebook:
              dataStore.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "facebook"
              )?.link ||
              prev.socialLinks?.facebook ||
              "",
            instagram:
              dataStore.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "instagram"
              )?.link ||
              prev.socialLinks?.instagram ||
              "",
            twitter:
              dataStore.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "twitter"
              )?.link ||
              prev.socialLinks?.twitter ||
              "",
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchTemplate()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex-1 flex items-center justify-center">
        <span>Loading customization...</span>
      </div>
    );
  }

  if (!isExist) {
    return (
      <div className="h-screen flex-1 flex items-center justify-center">
        <span>Subdomain not found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Render middle sections dynamically */}
      {sections.slice(1, sections.length - 1).map((section, index) => {
        const sectionId = section.id as keyof typeof sectionComponents;
        const sectionComponent = sectionComponents[sectionId];

        if (!sectionComponent) {
          return null;
        }

        // Get the template for this section
        let template: string;
        switch (sectionId) {
          case "PromoSlider":
            template = promoAttributes.template;
            break;
          case "Products":
            template = productAttributes.template;
            break;
          case "Categories":
            template = categoryAttributes.template;
            break;
          case "AboutUs":
            template = aboutAttributes.template;
            break;
          case "Policies":
            template = policiesAttributes.template;
            break;
          case "ContactUs":
            template = contactAttributes.template;
            break;
          default:
            return null;
        }

        // Get the component for this template
        const Component =
          sectionComponent[template as keyof typeof sectionComponent];

        if (!Component) {
          return null;
        }

        return <div key={section.id}>{Component}</div>;
      })}
    </div>
  );
}
