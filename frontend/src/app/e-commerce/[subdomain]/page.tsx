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
        name: "product1",
        description: "description of product1",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
      },
      {
        id: "2",
        name: "product2",
        description: "description of product2",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
      },
      {
        id: "3",
        name: "product3",
        description: "description of product3",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
      },
      {
        id: "4",
        name: "product4",
        description: "description of product4",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
      },
      {
        id: "5",
        name: "product5",
        description: "description of product5",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
      },
      {
        id: "6",
        name: "product6",
        description: "description of product6",
        media: {
          mainMedia: {
            image: {
              url: "/placeholder.png",
            },
          },
        },
        price: {
          price: 59.99,
          priceAfterDiscount: 39.99,
        },
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
          }
        });
        setSections(loadedSections);
        // ---------------------Store Settings----------------------------------
        setAboutAttributes((prev) => ({
          ...prev,
          description: storeData.store.aboutUs?.[0]?.title || prev.description,
          secondaryDescription:
            storeData.store.aboutUs?.[0]?.content || prev.description,
        }));
        // Policies (only sections)
        setPoliciesAttributes((prev) => ({
          ...prev,
          sections:
            storeData.store.policies?.map((p: any) => ({
              title: p.title,
              content: p.description,
            })) || prev.sections,
        }));
        // Contact (only contactEmail and socialLinks)
        setContactAttributes((prev) => ({
          ...prev,
          contactEmail: storeData.store.emailAddress || prev.contactEmail,
          socialLinks: {
            facebook:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "facebook"
              )?.link ||
              prev.socialLinks?.facebook ||
              "",
            instagram:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "instagram"
              )?.link ||
              prev.socialLinks?.instagram ||
              "",
            twitter:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "twitter"
              )?.link ||
              prev.socialLinks?.twitter ||
              "",
          },
        }));

        //-------------------------------------------------------------------------------------------------------

        // 👇 Now you can store products and categories:
        if (productsData.success && productsData.products) {
          const mappedProducts = productsData.products.map((product: any) => ({
            id: String(product.id),
            name: product.name,
            description: product.description,
            media: {
              mainMedia: {
                image: {
                  url:
                    product.images && product.images.length > 0
                      ? product.images[0].imageUrl
                      : "/placeholder.png",
                },
              },
            },
            price: {
              price: product.variants[0].price
                ? product.variants[0].price
                : 0.0,
              priceAfterDiscount: product.discountValue
                ? product.discountType === "percentage"
                  ? parseFloat(
                      (
                        product.variants[0].price *
                        (1 - product.discountValue)
                      ).toFixed(2)
                    )
                  : parseFloat(
                      (
                        product.variants[0].price - product.discountValue
                      ).toFixed(2)
                    )
                : parseFloat(product.variants[0].price.toFixed(2)),
            },
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
              media: {
                mainMedia: {
                  image: {
                    url: category.image || "/placeholder.png",
                  },
                },
              },
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
