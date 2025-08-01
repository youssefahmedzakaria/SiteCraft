/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

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
    titleColor: `text-[${initialColors.primary}]`, // text-white
    titleSize: "text-4xl",
    descriptionFont: "font-sans",
    descriptionColor: `text-[${initialColors.secondary}]`, // text-white
    descriptionSize: "text-lg",
    buttonFont: "font-sans",
    buttonColor: `bg-[${initialColors.accent}]`, // bg-white
    buttonTextColor: `text-[${initialColors.primary}]`, // text-black
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
    isClickable: true,
    title: "categories",
    bgColor: "bg-[#FFFFFF]",
    textColor: `text-[${initialColors.secondary}]`,
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: `bg-[${initialColors.accent}]`,
    showMorebuttonTextColor: `text-[${initialColors.primary}]`,
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "overlay",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showCategoryTitle: true,
    titleColor: `text-[${initialColors.primary}]`,
    titleFontSize: "text-2xl",
    categoryTitleFontSize: "text-lg",
    // cardTextColor: "text-[#000000]", // Added a reasonable default value
    categories: [
      {
        id: "6",
        name: "Necklaces",
        Description: "Necklaces",
        link: `/#`,
        images: [],
      },
      {
        id: "7",
        name: "Rings",
        Description: "Rings",
        link: `/#`,
        images: [],
      },
      {
        id: "8",
        name: "Earrings",
        Description: "Earrings",
        link: `/#`,
        images: [],
      },
      {
        id: "9",
        name: "Bracelets",
        Description: "Bracelets",
        link: `/#`,
        images: [],
      },
      {
        id: "10",
        name: "Pendants",
        Description: "Pendants",
        link: `/#`,
        images: [],
      },
      {
        id: "11",
        name: "Bangles",
        Description: "Bangles",
        link: `/#`,
        images: [],
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
    setCategoryAttributes((prev) => ({ 
      ...prev, 
      ...updates,
      // Always ensure isClickable is true in e-commerce context
      isClickable: true 
    }));
  };

  const initialProduct: ProductCustomizationAttributes = {
    id: "products",
    template: "FeaturedGrid", // You can adjust this if needed
    isClickable: true,
    title: "products",
    bgColor: "bg-[#FFFFFF]",
    textColor: `text-[${initialColors.secondary}]`,
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: `bg-[${initialColors.accent}]`,
    showMorebuttonTextColor: `text-[${initialColors.primary}]`,
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "overlay",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showProductTitle: true,
    titleColor: `text-[${initialColors.primary}]`,
    titleFontSize: "text-2xl",
    productTitleFontSize: "text-lg",
    // cardTextColor: "text-[#000000]", // Added a reasonable default value
    products: [
      {
        id: "1",
        name: "product1",
        description: "description of product1",
        images: [],
        discountType: "percentage",
        discountValue: 0.1,
        price: 59.99,
      },
      {
        id: "2",
        name: "product2",
        description: "description of product2",
        images: [],
        discountType: "fixed",
        discountValue: 10,
        price: 59.99,
      },
      {
        id: "3",
        name: "product3",
        description: "description of product3",
        images: [],
        discountType: "fixed",
        discountValue: 8,
        price: 59.99,
      },
      {
        id: "4",
        name: "product4",
        description: "description of product4",
        images: [],
        discountType: "percentage",
        discountValue: 0.13,
        price: 59.99,
      },
      {
        id: "5",
        name: "product5",
        description: "description of product5",
        images: [],
        discountType: "percentage",
        discountValue: 0.21,
        price: 59.99,
      },
      {
        id: "6",
        name: "product6",
        description: "description of product6",
        images: [],
        discountType: "fixed",
        discountValue: 30,
        price: 59.99,
      },
    ],
  };

  // State for product customization
  const [productAttributes, setProductAttributes] =
    useState<ProductCustomizationAttributes>(initialProduct);

  const updateProductAttributes = (
    updates: Partial<ProductCustomizationAttributes>
  ) => {
    setProductAttributes((prev) => ({ 
      ...prev, 
      ...updates,
      // Always ensure isClickable is true in e-commerce context
      isClickable: true 
    }));
  };

  const initialAbout: AboutCustomizationAttributes = {
    template: "TopImageAbout",
    id: "about",
    title: "About Us",
    titleColor: `text-[${initialColors.primary}]`, // text-black
    backgroundColor: "bg-[#FFFFFF]", // bg-white
    image: "/placeholder.png",
    imageAlt: "About our company",
    imageObjectFit: "cover",
    titleFont: "font-sans",
    titleSize: "text-4xl",
    sections: [
      {
        sectionTitle: "Who We Are",
        description:
          "We are a passionate team dedicated to bringing you the best products and services. Our mission is to make your shopping experience exceptional.",
      },
      {
        sectionTitle: "Our Experience",
        description:
          "With years of experience in the industry, we understand what our customers need and strive to exceed their expectations.",
      },
    ],
    sectionColor: `text-[${initialColors.secondary}]`,
    sectionSize: "text-lg",
    sectionFont: "font-sans",
    sectionFontWeight: "normal",
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
    titleColor: `text-[${initialColors.primary}]`, // text-black
    titleSize: "text-xl",
    titleFont: "font-sans",
    titleFontWeight: "font-normal",
    sectionTitleColor: `text-[${initialColors.secondary}]`, // text-black
    sectionTitleSize: "text-lg",
    sectionTitleFont: "font-sans",
    sectionTitleFontWeight: "font-normal",
    sectionContentColor: `text-[${initialColors.secondary}]`, // text-black
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
    titleColor: `text-[${initialColors.primary}]`,
    titleSize: "text-3xl",
    contentFont: "font-semibold",
    contentColor: `text-[${initialColors.secondary}]`,
    contentSize: "text-lg",
  };

  const updateContactAttributes = (
    updates: Partial<ContactCustomizationAttributes>
  ) => {
    setContactAttributes((prev) => ({ ...prev, ...updates }));
  };

  // State for contact customization
  const [contactAttributes, setContactAttributes] =
    useState<ContactCustomizationAttributes>(initialContact);

  const sectionComponents = {
    PromoSlider: {
      CenteredPromo: <CenteredPromo {...promoAttributes} isClickable={true} />,
      LeftAlignedPromo: (
        <LeftAlignedPromo {...promoAttributes} isClickable={true} />
      ),
      RightAlignedPromo: (
        <RightAlignedPromo {...promoAttributes} isClickable={true} />
      ),
      MinimalLeftPromo: (
        <MinimalLeftPromo {...promoAttributes} isClickable={true} />
      ),
      MinimalRightPromo: (
        <MinimalRightPromo {...promoAttributes} isClickable={true} />
      ),
      OverlayPromo: <OverlayPromo {...promoAttributes} isClickable={true} />,
      SplitPromo: <SplitPromo {...promoAttributes} isClickable={true} />,
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
      const [templateRes, storeRes, productsRes, categoriesRes] =
        await Promise.all([
          fetch("http://localhost:8080/customize/getTemplate", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8080/api/store/getStoreSettings", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8080/customize/getProducts", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8080/customize/getCategories", {
            method: "GET",
            credentials: "include",
          }),
        ]);
      const [templateData, storeData, productsData, categoriesData] =
        await Promise.all([
          templateRes.json(),
          storeRes.json(),
          productsRes.json(),
          categoriesRes.json(),
        ]);
      console.log("fetched template", templateData);
      console.log("fetched store", storeData);
      if (
        templateData.success &&
        templateData["Customized Template"] &&
        storeData.success &&
        storeData.store
      ) {
        setIsExist(true);
        // ---------------------Customize Template----------------------------------
        const sortedTemplate = [...templateData["Customized Template"]].sort(
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
            case "ContactUs":
              updateContactAttributes(section.value);
              break;
          }
        });
        setSections(loadedSections);
        // ---------------------Store Settings----------------------------------
        setAboutAttributes((prev) => ({
          ...prev,
          sections:
            storeData.store.aboutUs?.map((p: any) => ({
              sectionTitle: p.title,
              description: p.content,
            })) || prev.sections,
        }));

        setPoliciesAttributes((prev) => ({
          ...prev,
          sections:
            storeData.store.policies?.map((p: any) => ({
              title: p.title,
              content: p.description,
            })) || prev.sections,
        }));

        setContactAttributes((prev) => ({
          ...prev,
          address: storeData.store.address || "",
          addressUrl: storeData.store.addressLink || "",
          openHours: storeData.store.openingHours || "",
          phone: storeData.store.phoneNumber || "",
          contactEmail: storeData.store.emailAddress || "",
          socialLinks: {
            facebook:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "facebook"
              )?.link || "",
            instagram:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "instagram"
              )?.link || "",
            twitter:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "twitter"
              )?.link || "",
          },
        }));

        //-------------------------------------------------------------------------------------------------------

        // 👇 Now you can store products and categories:
        if (productsData.success && productsData.products) {
          const mappedProducts = productsData.products.map((product: any) => ({
            id: String(product.id),
            name: product.name,
            description: product.description,
            discountType: product.discountType,
            discountValue: product.discountValue,
            price: product.variants && product.variants.length > 0 && product.variants[0]?.price ? product.variants[0].price : 0.0,
            images: [
              {
                id:
                  product.images && product.images.length > 0
                    ? product.images[0].id
                    : 1,
                url:
                  product.images && product.images.length > 0
                    ? product.images[0].imageUrl
                    : "/placeholder.png",
                alt:
                  product.images && product.images.length > 0
                    ? product.images[0].alt
                    : "Image alt text",
              },
            ],
          }));

          setProductAttributes((prev) => ({
            ...prev,
            products: mappedProducts,
          }));
          console.log("Mapped Products:", mappedProducts);
        }

        if (categoriesData.success && categoriesData.categories) {
          const mappedCategories = categoriesData.categories.map(
            (category: any) => ({
              id: String(category.id),
              name: category.name,
              Description: category.description,
              link: "#",
              images: [
                {
                  id: category.id,
                  url: category.image || "/placeholder.png",
                  alt: `Image alt text for ${category.name}`,
                },
              ],
            })
          );

          setCategoryAttributes((prev) => ({
            ...prev,
            categories: mappedCategories,
          }));
          console.log("Mapped Categories:", mappedCategories);
        }
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
    <div className="min-h-screen flex flex-col pt-24">
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
