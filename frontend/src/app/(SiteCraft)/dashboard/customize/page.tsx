/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/dashboard/customize/sidebar";
import { Eye, AlertCircle, X } from "lucide-react";
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
  ProductCustomizationAttributes,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/SiteCraft/ui/dialog";
import { categories } from "@/lib/categories";
import {
  FeaturedGridProductTemplate,
  GridProductTemplate,
  HorizontalScrollProductTemplate,
} from "@/components/e-commerce/product-lists";
import { GridCategoryTemplate } from "@/components/e-commerce/category-lists";
import { form } from "@heroui/theme";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { useRouter } from "next/navigation";

interface Section {
  id: string;
  title: string;
  expanded: boolean;
}

const initialSections: Section[] = [];

export default function CustomizeTemplatePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [aboutImage, setAboutImage] = useState<File | undefined>();
  const [contactImage, setContactImage] = useState<File | undefined>();
  const [promoImages, setPromoImages] = useState<File[] | undefined>();

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isInactive } = useStoreStatus();
  const router = useRouter();

  // Show inactive store message if store is inactive
  if (isInactive) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-80 bg-white border-r border-gray-200"></div>
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Store Inactive
              </h2>
              <p className="text-gray-600 mb-4">
                Your store is inactive. Please subscribe to activate your store.
              </p>
              <Button
                onClick={() => router.push("/pricing")}
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const initialHeader: HeaderCustomizationAttributes = {
    template: "template1",
    brandName: "Brand Name",
    backgroundColor: `bg-[#000000]`, // bg-black/50
    textColor: `text-[#FFFFFF]`, // text-white
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
    iconColor: `text-[#FFFFFF]`, // text-white
    dividerColor: `border-[#E5E7EB]`, // border-gray-200
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
    titleColor: "text-[primary]", // text-white
    titleSize: "text-4xl",
    descriptionFont: "font-sans",
    descriptionColor: `text-[#FFFFFF]`, // text-white
    descriptionSize: "text-lg",
    buttonFont: "font-sans",
    buttonColor: `bg-[#FFFFFF]`, // bg-white
    buttonTextColor: `text-[#000000]`, // text-black
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
    id: "categories",
    template: "FeaturedGrid", // You can adjust this if needed
    isClickable: false,
    title: "categories",
    bgColor: "bg-[#FFFFFF]",
    textColor: `text-[#000000]`,
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: `bg-[#FFFFFF]`,
    showMorebuttonTextColor: `text-[#000000]`,
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "overlay",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showCategoryTitle: true,
    titleColor: `text-[#000000]`,
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

  // State for category customization
  const [categoryAttributes, setCategoryAttributes] =
    useState<CategoryCustomizationAttributes>(initialCategory);

  // Function to update category attributes
  const updateCategoryAttributes = (
    updates: Partial<CategoryCustomizationAttributes>
  ) => {
    setCategoryAttributes((prev) => ({ ...prev, ...updates }));
  };

  // Auto-switch to Grid if Featured Grid is selected but less than 3 categories
  useEffect(() => {
    if (
      categoryAttributes.template === "FeaturedGrid" &&
      (categoryAttributes.categories?.length || 0) < 3
    ) {
      setCategoryAttributes((prev) => ({ ...prev, template: "Grid" }));
    }
  }, [categoryAttributes.categories?.length, categoryAttributes.template]);

  const initialProduct: ProductCustomizationAttributes = {
    id: "products",
    template: "HorizontalScroll", // You can adjust this if needed
    isClickable: false,
    title: "products",
    bgColor: "bg-[#FFFFFF]",
    textColor: `text-[#000000]`,
    fontFamily: "font-mono",
    titleFont: "font-bold",
    showTitle: true,
    showMoreButton: true,
    showMoreText: "Show More",
    showMorebuttonBgColor: `bg-[#000000]`,
    showMorebuttonTextColor: `text-[#FFFFFF]`,
    ctaText: "Shop Now",
    cornerRadius: "small",
    showCta: true,
    cardVariant: "default",
    showSubtitle: true,
    overlayColor: "bg-[#00000080]",
    showProductTitle: true,
    titleColor: `text-[#000000]`,
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

  // Function to update product attributes
  const updateProductAttributes = (
    updates: Partial<ProductCustomizationAttributes>
  ) => {
    setProductAttributes((prev) => ({ ...prev, ...updates }));
  };

  // Auto-switch to Grid if Featured Grid is selected but less than 3 products
  useEffect(() => {
    if (
      productAttributes.template === "FeaturedGrid" &&
      (productAttributes.products?.length || 0) < 3
    ) {
      setProductAttributes((prev) => ({ ...prev, template: "Grid" }));
    }
  }, [productAttributes.products?.length, productAttributes.template]);

  const initialAbout: AboutCustomizationAttributes = {
    template: "TopImageAbout",
    id: "about",
    title: "About Us",
    titleColor: `text-[#000000]`, // text-black
    backgroundColor: "bg-[#FFFFFF]", // bg-white
    image: "/placeholder.png",
    imageAlt: "About our company",
    imageObjectFit: "cover",
    titleFont: "font-sans",
    titleSize: "text-4xl",
    // titleFontWeight: "font-bold",
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
    sectionColor: `text-[#000000]`,
    sectionSize: "text-lg",
    sectionFont: "font-sans",
    sectionFontWeight: "normal",
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
    titleColor: `text-[#000000]`, // text-black
    titleSize: "text-xl",
    titleFont: "font-sans",
    titleFontWeight: "font-normal",
    sectionTitleColor: `text-[#000000]`, // text-black
    sectionTitleSize: "text-lg",
    sectionTitleFont: "font-sans",
    sectionTitleFontWeight: "font-normal",
    sectionContentColor: `text-[#000000]`, // text-black
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
    titleColor: `text-[#000000]`,
    titleSize: "text-3xl",
    contentFont: "font-semibold",
    contentColor: `text-[#000000]`,
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
    brandName: "Brand Name",
    backgroundColor: `bg-[#FFFFFF]`,
    textColor: `text-[#000000]`,
    logo: {
      src: "/placeholder.png",
      alt: "Brand Logo",
      size: "24",
    },
    aboutLinks: [
      {
        label: "Contact Us",
        href: "/contact",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: `text-[#000000]`,
        isShown: true,
      },
      {
        label: "About Us",
        href: "/about",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: `text-[#000000]`,
        isShown: true,
      },
      {
        label: "Policies",
        href: "/policies",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: `text-[#000000]`,
        isShown: true,
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/yourpage",
      instagram: "https://instagram.com/yourpage",
    },
    socialMediaStyles: {
      iconSize: 20,
      iconColor: `text-[#000000]`,
      hoverColor: `text-[#000000]`,
    },
    copyrightStyles: {
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-light",
      fontColor: `text-[#000000]`,
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
      FeaturedGrid: (
        <FeaturedGridProductTemplate
          {...productAttributes}
          isClickable={false}
        />
      ),
      HorizontalScroll: (
        <HorizontalScrollProductTemplate
          {...productAttributes}
          isClickable={false}
        />
      ),
      Grid: <GridProductTemplate {...productAttributes} isClickable={false} />,
    },
    Categories: {
      FeaturedGrid: (
        <FeaturedGridCategoryTemplate
          {...categoryAttributes}
          isClickable={false}
        />
      ),
      HorizontalScroll: (
        <HorizontalScrollCategoryTemplate
          {...categoryAttributes}
          isClickable={false}
        />
      ),
      Grid: (
        <GridCategoryTemplate {...categoryAttributes} isClickable={false} />
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
      TitleLeftContentCenterPolicies: (
        <TitleLeftContentCenterPolicies {...policiesAttributes} />
      ),
      DefaultPolicies: <DefaultPolicies {...policiesAttributes} />,
      LeftPolicies: <LeftPolicies {...policiesAttributes} />,
      CenteredPolicies: <CenteredPolicies {...policiesAttributes} />,
    },
  };

  const [sections, setSections] = useState<Section[]>(initialSections);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Store data state
  const [storeData, setStoreData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

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
      console.log(productsData);
      if (
        templateData.success &&
        templateData["Customized Template"] &&
        storeData.success &&
        storeData.store
      ) {
        const sortedTemplate = [...templateData["Customized Template"]].sort(
          (a, b) => a.index - b.index
        );
        const loadedSections: Section[] = [];

        sortedTemplate.forEach((section: any) => {
          loadedSections.push({
            id: section.title,
            title: section.title.replace("&", " & "),
            expanded: false,
          });

          switch (section.title) {
            case "Header":
              updateHeaderAttributes(section.value);
              break;
            case "PromoSlider":
              updatePromoAttributes(section.value);
              break;
            case "AboutUs":
              updateAboutAttributes(section.value);
              break;
            case "Footer":
              updateFooterAttributes(section.value);
              break;
            case "Policies":
              updatePoliciesAttributes(section.value);
              break;
            case "ContactUs":
              updateContactAttributes(section.value);
              break;
            case "Categories":
              updateCategoryAttributes(section.value);
              break;
            case "Products":
              updateProductAttributes(section.value);
              break;
          }
        });

        setSections(loadedSections);

        // Store data
        setStoreData(storeData.store);

        console.log("fetched store", storeData.store);

        setHeaderAttributes((prev) => ({
          ...prev,
          brandName: storeData.store.storeName || prev.brandName,
          logo: {
            ...prev.logo,
            src:
              storeData.store.logo && storeData.store.logo !== ""
                ? storeData.store.logo
                : "/placeholder.png",
          },
        }));

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

        setFooterAttributes((prev) => ({
          ...prev,
          brandName: storeData.store.storeName || prev.brandName,
          logo: {
            ...prev.logo,
            src:
              storeData.store.logo && storeData.store.logo !== ""
                ? storeData.store.logo
                : "/placeholder.png",
          },
          socialMedia: {
            ...(prev.socialMedia || {}),
            facebook:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "facebook"
              )?.link ||
              prev.socialMedia?.facebook ||
              "",
            instagram:
              storeData.store.socialMediaAccounts?.find(
                (acc: any) => acc.name.toLowerCase() === "instagram"
              )?.link ||
              prev.socialMedia?.instagram ||
              "",
          },
        }));

        // 👇 Now you can store products and categories:
        if (productsData.success && productsData.products) {
          const mappedProducts = productsData.products.map((product: any) => ({
            id: String(product.id),
            name: product.name,
            description: product.description,
            discountType: product.discountType,
            discountValue: product.discountValue,
            price:
              product.variants &&
              product.variants.length > 0 &&
              product.variants[0]?.price
                ? product.variants[0].price
                : 0.0,
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
      console.error(
        "Failed to fetch template, store data, products, or categories:",
        error
      );
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchTemplate()]);
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
      case "Header": {
        const { brandName, logo, ...rest } = value;
        return {
          ...rest,
          logo: logo ? { ...logo, src: undefined } : undefined,
        };
      }
      case "PromoSlider":
        return value;
      case "Categories": {
        const { categories, ...rest } = value;
        return rest;
      }
      case "Products": {
        const { products, ...rest } = value;
        return rest;
      }
      case "AboutUs": {
        const { sections, ...rest } = value;
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

  // API call for editing customization
  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleCustomizedImages = async () => {
    let updatedSlides = [...promoAttributes.slides];
    let updatedAboutImage = aboutAttributes.image;
    let updatedContactImage = contactAttributes.image;

    try {
      if (promoImages && promoImages.length > 0) {
        for (let i = 0; i < promoImages.length; i++) {
          const formData = new FormData();
          formData.append("image", promoImages[i]);
          const response = await fetch(
            "http://localhost:8080/customize/saveImage",
            {
              method: "POST",
              credentials: "include",
              body: formData,
            }
          );
          const data = await response.json();
          if (!data.success) {
            alert(data.message || "Failed to save customization Image.");
            return null;
          } else {
            const url = data.url;
            updatedSlides[i] = { ...updatedSlides[i], image: url };
          }
        }
      }
      if (aboutImage !== undefined) {
        const formData = new FormData();
        formData.append("image", aboutImage);
        const response = await fetch(
          "http://localhost:8080/customize/saveImage",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const data = await response.json();
        if (!data.success) {
          alert(data.message || "Failed to save customization Image.");
          return null;
        } else {
          updatedAboutImage = data.url;
        }
      }
      if (contactImage !== undefined) {
        const formData = new FormData();
        formData.append("image", contactImage);
        const response = await fetch(
          "http://localhost:8080/customize/saveImage",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const data = await response.json();
        if (!data.success) {
          alert(data.message || "Failed to save customization Image.");
          return null;
        } else {
          updatedContactImage = data.url;
        }
      }

      // Update state ONCE after all uploads
      updatePromoAttributes({ slides: updatedSlides });
      updateAboutAttributes({ image: updatedAboutImage });
      updateContactAttributes({ image: updatedContactImage });

      // Return the new values for use in DTOs
      return {
        updatedSlides,
        updatedAboutImage,
        updatedContactImage,
      };
    } catch (error) {
      alert("An error occurred while saving customization Images.");
      return null;
    }
  };

  const editCustomizedTemplate = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setShowSaveDialog(true);
    try {
      // 1. Upload images and get new values
      const imagesResult = await handleCustomizedImages();
      if (!imagesResult) {
        setIsSaving(false);
        return;
      }

      // 2. Use the new values to build DTOs
      const { updatedSlides, updatedAboutImage, updatedContactImage } =
        imagesResult;

      // Build DTOs using the latest values
      // const storeId = 1;
      const dtoList = sections.map((section, idx) => {
        let value = {};
        switch (section.id) {
          case "Header":
            value = headerAttributes;
            break;
          case "PromoSlider":
            value = { ...promoAttributes, slides: updatedSlides };
            break;
          case "Categories":
            value = categoryAttributes;
            break;
          case "Products":
            value = productAttributes;
            break;
          case "AboutUs":
            value = { ...aboutAttributes, image: updatedAboutImage };
            break;
          case "Policies":
            value = policiesAttributes;
            break;
          case "ContactUs":
            value = { ...contactAttributes, image: updatedContactImage };
            break;
          case "Footer":
            value = footerAttributes;
            break;
          default:
            value = {};
        }
        return {
          title: section.id,
          value: stripBackendFields(section.id, value),
          index: idx,
          // storeId,
        };
      });

      // 3. Send to backend
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
      alert(`An error occurred while saving customization. ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to customize your template.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "owner") {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Replace the main render logic to show loading until data is ready
  if (isLoading) {
    return (
      <div className="h-screen flex-1 flex items-center justify-center">
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
            productAttributes={productAttributes}
            updateProductAttributes={updateProductAttributes}
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
            className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4`}
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
                  template = productAttributes.template;
                  // Auto-fallback to Grid if FeaturedGrid is selected but less than 3 products
                  if (
                    template === "FeaturedGrid" &&
                    (productAttributes.products?.length || 0) < 3
                  ) {
                    template = "Grid";
                  }
                  break;
                case "Categories":
                  template = categoryAttributes.template;
                  // Auto-fallback to Grid if FeaturedGrid is selected but less than 3 categories
                  if (
                    template === "FeaturedGrid" &&
                    (categoryAttributes.categories?.length || 0) < 3
                  ) {
                    template = "Grid";
                  }
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
