/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/dashboard/customize/sidebar";
import { Eye, X } from "lucide-react";
import { TitleLeftContentCenterPolicies } from "@/components/e-commerce/policies/templates/titleLeftContentCenter";
import { DefaultPolicies } from "@/components/e-commerce/policies/templates/default";
import { LeftPolicies } from "@/components/e-commerce/policies/templates/left";
import { CenteredPolicies } from "@/components/e-commerce/policies/templates/centerd";
import { MinimalRightContact } from "@/components/e-commerce/contact/templates/minimal-right";
import { CenteredContact } from "@/components/e-commerce/contact/templates/centered-contact";
import { LeftAlignedContact } from "@/components/e-commerce/contact/templates/left-aligned";
import { RightAlignedContact } from "@/components/e-commerce/contact/templates/right-aligned";
import { MinimalLeftContact } from "@/components/e-commerce/contact/templates/minimal-left";
import { TopImageAbout } from "@/components/e-commerce/about-us/templates/top-image-about";
import { CenteredAbout } from "@/components/e-commerce/about-us/templates/centered-about";
import { LeftAlignedAbout } from "@/components/e-commerce/about-us/templates/left-aligned-about";
import { RightAlignedAbout } from "@/components/e-commerce/about-us/templates/right-aligned-about";
import FeaturedGridCategoryTemplate from "@/components/e-commerce/category-lists/templates/featured-grid-template";
import ProductList from "@/components/e-commerce/product-lists/product-list";
import { CenteredPromo } from "@/components/e-commerce/promo/templates/centered-promo";
import {
  AboutCustomizationAttributes,
  CategoryCustomizationAttributes,
  ContactCustomizationAttributes,
  FooterCustomizationAttributes,
  HeaderCustomizationAttributes,
  PoliciesCustomizationAttributes,
  PromoCustomizationAttributes,
} from "@/lib/customization";
import Navbar from "@/components/e-commerce/navbar/Navbar";
import { Footer } from "@/components/e-commerce/footer/Footer";
import {
  LeftAlignedPromo,
  MinimalLeftPromo,
  MinimalRightPromo,
  OverlayPromo,
  RightAlignedPromo,
  SplitPromo,
} from "@/components/e-commerce/promo";
import { HorizontalScrollCategoryTemplate } from "@/components/e-commerce/category-lists/templates/horizontal-scroll-template";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/SiteCraft/ui/dialog";
import { categories } from "@/lib/categories";

interface Section {
  id: string;
  title: string;
  expanded: boolean;
}

const initialSections: Section[] = [];

export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [logoImage, setLogoImage] = useState<File | undefined>();
  const [aboutImage, setAboutImage] = useState<File | undefined>();
  const [contactImage, setContactImage] = useState<File | undefined>();
  const [policiesImage, setPoliciesImage] = useState<File | undefined>();
  const [promoImages, setPromoImages] = useState<File[] | undefined>();

  const initialHeader: HeaderCustomizationAttributes = {
    template: "template1",
    brandName: "Jewelry",
    backgroundColor: "bg-[#00000080]", // bg-black/50
    textColor: "text-[#FFFFFF]", // text-white
    logo: {
      src: "/placeholder.png",
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
    fontFamily: "font-sans",
  };

  // State for header customization
  const [headerAttributes, setHeaderAttributes] =
    useState<HeaderCustomizationAttributes>(initialHeader);

  // Function to update header attributes
  const updateHeaderAttributes = (
    updates: Partial<HeaderCustomizationAttributes>
  ) => {
    setHeaderAttributes((prev) => ({ ...prev, ...updates }));
  };

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

  // Function to update promo attributes
  const updatePromoAttributes = (
    updates: Partial<PromoCustomizationAttributes>
  ) => {
    setPromoAttributes((prev) => ({ ...prev, ...updates }));
  };

  const initialCategory: CategoryCustomizationAttributes = {
    template: "FeaturedGrid", // You can adjust this if needed
    title: "categories",
    bgColor: "bg-[#FFFFFF]",
    textColor: "text-[#000000]",
    accentColor: "bg-[#3B82F6]",
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
    cardTextColor: "text-[#000000]", // Added a reasonable default value
    categories: [
      {
        id: "6",
        name: "Necklaces",
        link: `/#`,
        media: {
          mainMedia: {
            image: {
              src: "/placeholder.png",
            },
          },
        },
      },
    ],
  };

  // State for header customization
  const [categoryAttributes, setCategoryAttributes] =
    useState<CategoryCustomizationAttributes>(initialCategory);

  // Function to update header attributes
  const updateCategoryAttributes = (
    updates: Partial<CategoryCustomizationAttributes>
  ) => {
    setCategoryAttributes((prev) => ({ ...prev, ...updates }));
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

  // Function to update about attributes
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

  // Function to update policies attributes
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

  // Function to update contact attributes
  const updateContactAttributes = (
    updates: Partial<ContactCustomizationAttributes>
  ) => {
    setContactAttributes((prev) => ({ ...prev, ...updates }));
  };

  const initialFooter: FooterCustomizationAttributes = {
    brandName: "BRAND",
    backgroundColor: "bg-[#FFFFFF]",
    textColor: "text-[#000000]",
    logo: {
      src: "/placeholder.png",
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
        isShown: true,
      },
      {
        label: "About Us",
        href: "/about",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-[#000000]",
        isShown: true,
      },
      {
        label: "Policies",
        href: "/policies",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-[#000000]",
        isShown: true,
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
  };

  // State for footer customization
  const [footerAttributes, setFooterAttributes] =
    useState<FooterCustomizationAttributes>(initialFooter);

  // Function to update footer attributes
  const updateFooterAttributes = (
    updates: Partial<FooterCustomizationAttributes>
  ) => {
    setFooterAttributes((prev) => ({ ...prev, ...updates }));
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
      ProductList: (
        <ProductList
          isClickable={false}
          products={[
            {
              name: "Product 1",
              media: {
                mainMedia: {
                  image: {
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
                    url: "/placeholder.png",
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
      FeaturedGrid: <FeaturedGridCategoryTemplate {...categoryAttributes} />,
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

  const [sections, setSections] = useState<Section[]>(initialSections);

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Store data state
  const [storeData, setStoreData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/store/getStoreSettings",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success && data.store) {
        setStoreData(data.store);
        // About (only description and secondaryDescription)
        setAboutAttributes((prev) => ({
          ...prev,
          description: data.store.aboutUs?.[0]?.title || prev.description,
          secondaryDescription:
            data.store.aboutUs?.[0]?.content || prev.description,
        }));
        // Policies (only sections)
        setPoliciesAttributes((prev) => ({
          ...prev,
          sections:
            data.store.policies?.map((p: any) => ({
              title: p.title,
              content: p.description,
            })) || prev.sections,
        }));
        // Contact (only contactEmail and socialLinks)
        setContactAttributes((prev) => ({
          ...prev,
          contactEmail: data.store.emailAddress || prev.contactEmail,
          socialLinks: {
            facebook:
              data.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "facebook"
              )?.link ||
              prev.socialLinks?.facebook ||
              "",
            instagram:
              data.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "instagram"
              )?.link ||
              prev.socialLinks?.instagram ||
              "",
            twitter:
              data.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "twitter"
              )?.link ||
              prev.socialLinks?.twitter ||
              "",
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch store data:", error);
    }
  };

  // Add a useEffect to update header/footer logo and other attributes when storeData changes
  React.useEffect(() => {
    if (!storeData) return;
    // Update header logo
    setHeaderAttributes((prev) => ({
      ...prev,
      brandName: storeData.storeName || prev.brandName,
      logo: {
        ...prev.logo,
        src:
          storeData.logo && storeData.logo !== ""
            ? storeData.logo
            : "/placeholder.png",
      },
    }));
    // Update about
    setAboutAttributes((prev) => ({
      ...prev,
      description: storeData.aboutUs?.[0]?.title || prev.description,
      secondaryDescription: storeData.aboutUs?.[0]?.content || prev.description,
    }));
    // Update policies
    setPoliciesAttributes((prev) => ({
      ...prev,
      sections:
        storeData.policies?.map((p: any) => ({
          title: p.title,
          content: p.description,
        })) || prev.sections,
    }));
    // Update contact
    setContactAttributes((prev) => ({
      ...prev,
      contactEmail: storeData.emailAddress || prev.contactEmail,
      socialLinks: {
        facebook:
          storeData.socialMediaAccounts?.find(
            (acc: any) => acc.name.toLowerCase() === "facebook"
          )?.link ||
          prev.socialLinks?.facebook ||
          "",
        instagram:
          storeData.socialMediaAccounts?.find(
            (acc: any) => acc.name.toLowerCase() === "instagram"
          )?.link ||
          prev.socialLinks?.instagram ||
          "",
        twitter:
          storeData.socialMediaAccounts?.find(
            (acc: any) => acc.name.toLowerCase() === "twitter"
          )?.link ||
          prev.socialLinks?.twitter ||
          "",
      },
    }));
    // Update footer logo and social media
    setFooterAttributes((prev) => ({
      ...prev,
      brandName: storeData.storeName || prev.brandName,
      logo: {
        ...prev.logo,
        src:
          storeData.logo && storeData.logo !== ""
            ? storeData.logo
            : "/placeholder.png",
      },
      socialMedia: {
        facebook:
          storeData.socialMediaAccounts?.find(
            (acc: any) => acc.name.toLowerCase() === "facebook"
          )?.link || prev.socialMedia.facebook,
        instagram:
          storeData.socialMediaAccounts?.find(
            (acc: any) => acc.name.toLowerCase() === "instagram"
          )?.link || prev.socialMedia.instagram,
      },
    }));
  }, [storeData]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/customize/getTemplate",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success && data["Customized Template"]) {
        const sortedTemplate = [...data["Customized Template"]].sort(
          (a, b) => a.index - b.index
        );
        const loadedSections: Section[] = [];
        sortedTemplate.forEach((section: any, idx: number) => {
          loadedSections.push({
            id: section.title,
            title: section.title.replace("&", " & "),
            expanded: false, // all sections initially collapsed
          });
          switch (section.title) {
            case "Header&Menu":
              setHeaderAttributes(section.value);
              break;
            case "PromoSlider":
              setPromoAttributes(section.value);
              break;
            case "AboutUs":
              setAboutAttributes(section.value);
              break;
            case "Footer":
              setFooterAttributes(section.value);
              break;
            case "Policies":
              setPoliciesAttributes(section.value);
              break;
            case "ContactUs":
              setContactAttributes(section.value);
              break;
            // Add additional cases as you expand your backend support
          }
        });
        setSections(loadedSections);
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchTemplate(), fetchStoreData()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // Warn user before leaving the page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave? Changes will not be saved.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Helper to remove backend fields from each section's value
  const stripBackendFields = (sectionId: string, value: any) => {
    switch (sectionId) {
      case "Header&Menu": {
        const { brandName, logo, ...rest } = value;
        return {
          ...rest,
          logo: logo ? { ...logo, src: undefined } : undefined,
        };
      }
      case "PromoSlider":
        return value;
      case "AboutUs": {
        const { description, secondaryDescription, ...rest } = value;
        return rest;
      }
      case "Policies": {
        const { sections, ...rest } = value;
        return rest;
      }
      case "ContactUs": {
        const { contactEmail, socialLinks, ...rest } = value;
        return rest;
      }
      case "Footer": {
        const { brandName, logo, socialMedia, ...rest } = value;
        return {
          ...rest,
          logo: logo ? { ...logo, src: undefined } : undefined,
        };
      }
      default:
        return value;
    }
  };

  // Helper to build DTOs for each section
  const buildCustomizationDTOs = () => {
    // Set storeId to 1 for all sections
    const storeId = 1;
    return sections.map((section, idx) => {
      let value = {};
      switch (section.id) {
        case "Header&Menu":
          value = headerAttributes;
          break;
        case "PromoSlider":
          value = promoAttributes;
          break;
        case "AboutUs":
          value = aboutAttributes;
          break;
        case "Policies":
          value = policiesAttributes;
          break;
        case "ContactUs":
          value = contactAttributes;
          break;
        case "Footer":
          value = footerAttributes;
          break;
        // Add cases for Categories, Products, etc. as needed
        default:
          value = {};
      }
      return {
        title: section.id,
        value: stripBackendFields(section.id, value),
        index: idx,
        storeId,
      };
    });
  };

  // API call for editing customization
  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const editCustomizedTemplate = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setShowSaveDialog(false);
    try {
      const dtoList = buildCustomizationDTOs();
      const response = await fetch(
        "http://localhost:8080/customize/editTemplate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dtoList),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Store message in localStorage to show after navigation
        localStorage.setItem(
          "customizeSuccessMessage",
          "Changes saved successfully!"
        );
        window.removeEventListener("beforeunload", () => {});
        router.push("/dashboard");
      } else {
        alert(data.message || "Failed to save customization.");
      }
    } catch (error) {
      alert("An error occurred while saving customization.");
    } finally {
      setIsSaving(false);
    }
  };

  // Replace the main render logic to show loading until data is ready
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span>Loading customization...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-80 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
        flex flex-col
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Customize Template</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
          >
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
            categoryAttributes={categoryAttributes}
            updateCategoryAttributes={updateCategoryAttributes}
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
            aboutImage={aboutImage}
            setAboutImage={setAboutImage}
            contactImage={contactImage}
            setContactImage={setContactImage}
            policiestImage={policiesImage}
            setPoliciesImage={setPoliciesImage}
            promoImages={promoImages}
            setPromoImages={setPromoImages}
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>

            {/* Preview Button */}
            <Button
              variant="outline"
              className="bg-white"
              onClick={() =>
                window.open(`/e-commerce/${storeData.subdomain}`, "_blank")
              }
            >
              <span className="flex items-center gap-2">
                <Eye size={20} />
                Preview
              </span>
            </Button>

            {/* Device Views */}
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
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {saveMessage && (
            <span className="ml-4 text-green-600 font-semibold">
              {saveMessage}
            </span>
          )}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogDescription>
                  Are you sure you want to save your changes?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white"
                  onClick={editCustomizedTemplate}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content preview area */}
        <div className="flex-1 p-4 bg-gray-100 rounded-lg overflow-y-auto">
          <div
            className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4 ${
              selectedTab === "desktop"
                ? "w-full max-w-6xl"
                : selectedTab === "tablet"
                ? "w-full max-w-2xl"
                : "w-full max-w-sm"
            }`}
          >
            <Navbar
              isCustomize={true}
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
              fontFamily={headerAttributes.fontFamily}
            />

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
                  template = "ProductList";
                  break;
                case "Categories":
                  template = "FeaturedGrid";
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

            <Footer
              isCustomize={true}
              companyName={footerAttributes.brandName}
              textColor={footerAttributes.textColor}
              companyLogo={{
                src: footerAttributes.logo.src || "/placeholder.png",
                alt: footerAttributes.logo.alt,
                width: parseInt(footerAttributes.logo.size) || 50,
                height: parseInt(footerAttributes.logo.size) || 50,
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
  );
}
