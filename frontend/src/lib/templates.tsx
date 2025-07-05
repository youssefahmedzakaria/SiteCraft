import { Template } from "@/components/SiteCraft/templates/TemplateCard";

export const suggestedTemplates: Template[] = [
  {
    id: "1",
    title: "Flora Shop",
    description: "Bright, floral‑themed store template",
    imageUrl: "/images/sample.png",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Modern Store",
    description: "Clean lines and minimalist design",
    imageUrl: "/images/sample.png",
    rating: 4.7,
  },
  {
    id: "3",
    title: "Pants Store",
    description: "Sharp lines and eye-catching design",
    imageUrl: "/images/sample.png",
    rating: 4.1,
  },
  {
    id: "4",
    title: "T-Shirt Store",
    description: "smooth edges and colorful design",
    imageUrl: "/images/sample.png",
    rating: 3.2,
  },
];

export const allTemplates: Template[] = [
  ...suggestedTemplates,
  {
    id: "5",
    title: "Vintage Market",
    description: "Retro vibes for niche boutiques",
    imageUrl: "/images/sample.png",
    rating: 4.5,
  },
  {
    id: "6",
    title: "Tech Gadgets",
    description: "Sleek tech store layout",
    imageUrl: "/images/sample.png",
    rating: 4.6,
  },
  // add more "all" items here…
];

import { createContext, useContext, useState, ReactNode } from "react";
import { CustomizedTemplate } from "./customization";

// Hard-coded templates data
const initialTemplates: CustomizedTemplate[] = [
  {
    id: "template1",
    header: {
      template: "template1",
      brandName: "Brand Name",
      backgroundColor: "bg-[#fffff]",
      textColor: "text-[#000000]",
      logo: {
        src: "",
        alt: "Brand Logo",
        width: 50,
        height: 50,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "products", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#000000]",
      dividerColor: "border-[#cccccc]",
      fontFamily: "font-sans-serif",
    },
    promo: {
      template: "CenteredPromo",
      id: "promo",
      slides: [
        {
          title: "Exclusive Jewelry Collection",
          description: "Discover our amazing products .",
          buttonText: "Shop Now",
          buttonLink: "/products",
          image: "",
          imageAlt: "",
        },
        {
          title: "Summer Sale - Up to 50% Off",
          description: "Limited time offer on our collections.",
          buttonText: "View Sale",
          buttonLink: "/products",
          image: "",
          imageAlt: "",
        },
        {
          title: "New Collection",
          description: "Be the first to see our latest arrivals.",
          buttonText: "Explore New",
          buttonLink: "/products",
          image: "",
          imageAlt: "",
        },
      ],
      autoPlay: true,
      showArrows: true,
      titleFont: "font-bold",
      titleColor: "text-[#ffffff]",
      titleSize: "text-4xl",
      descriptionFont: "font-normal",
      descriptionColor: "text-[#ffffff]/80",
      descriptionSize: "text-lg",
      buttonFont: "font-semibold",
      buttonColor: "bg-[#ffffff]",
      buttonTextColor: "text-[#000000]",
      buttonSize: "text-base",
      buttonRadius: "rounded-lg",
      backgroundColor: "bg-[#000000]",
      imageObjectFit: "cover",
    },
    categories: {
      id: "categories",
      template: "FeaturedGridCategoryTemplate",
      isClickable: true,
      title: "Featured Categories",
      bgColor: "bg-[#ffffff]",
      textColor: "text-[#000000]",
      fontFamily: "font-sans",
      titleFont: "font-serif",
      showTitle: true,
      showMoreButton: true,
      showMoreText: "Show More",
      showMorebuttonBgColor: "bg-[#1d4ed8]",
      showMorebuttonTextColor: "text-[#ffffff]",
      ctaText: "Shop Now",
      cornerRadius: "medium",
      showCta: true,
      cardVariant: "featured",
      showSubtitle: true,
      overlayColor: "bg-[#ffffff]/30",
      showCategoryTitle: true,
      titleColor: "text-blue-500",
      titleFontSize: "text-lg",
      categoryTitleFontSize: "text-lg",
      categories: [
        {
          name: "category1",
          images: [{ id: 1, url: "", alt: "category1" }],
          id: "1",
          Description: "description of category1",
          link: "/e-commerce/${subdomain}/products",
        },
        {
          name: "category2",
          images: [{ id: 2, url: "", alt: "category2" }],
          id: "2",
          Description: "description of category",
          link: "/e-commerce/${subdomain}/products",
        },
        {
          name: "category3",
          images: [{ id: 3, url: "", alt: "category3" }],
          id: "3",
          Description: "description of category3",
          link: "/e-commerce/${subdomain}/products",
        },
        {
          name: "category4",
          images: [{ id: 4, url: "", alt: "category4" }],
          id: "4",
          Description: "description of category4",
          link: "/e-commerce/${subdomain}/products",
        },
        {
          name: "category5",
          images: [{ id: 5, url: "", alt: "category5" }],
          id: "5",
          Description: "description of category5",
          link: "/e-commerce/${subdomain}/products",
        },
      ],
    },
    products: {
      id: "products",
      template: "featured",
      isClickable: true,
      title: "Featured Products",
      bgColor: "bg-[#ffffff]",
      textColor: "text-[#000000]",
      fontFamily: "font-sans",
      titleFont: "font-bold",
      showTitle: true,
      showMoreButton: true,
      showMoreText: "Show More",
      showMorebuttonBgColor: "bg-[#1d4ed8]",
      showMorebuttonTextColor: "text-[#ffffff]",
      ctaText: "View Product",
      cornerRadius: "medium",
      showCta: true,
      cardVariant: "default",
      showSubtitle: false,
      overlayColor: "bg-[#000000]/50",
      showProductTitle: true,
      titleColor: "text-[#000000]",
      titleFontSize: "text-3xl",
      productTitleFontSize: "text-lg",
      products: [
        {
          id: "product1",
          name: "product1",
          description: "description of product1",
          price: 49.99,
          images: [{ id: 1, url: "", alt: "product1" }],
        },
        {
          id: "product2",
          name: "product2",
          description: "description of product2",
          price: 59.99,
          images: [{ id: 2, url: "", alt: "product2" }],
        },
        {
          id: "product3",
          name: "product3",
          description: "description of product3",
          price: 39.99,
          images: [{ id: 3, url: "", alt: "product3" }],
        },
        {
          id: "product4",
          name: "product4",
          description: "description of product4",
          price: 59.99,
          images: [{ id: 4, url: "", alt: "product4" }],
        },
        {
          id: "product5",
          name: "product5",
          description: "description of product5",
          price: 59.99,
          images: [{ id: 5, url: "", alt: "product5" }],
        },
        {
          id: "product6",
          name: "product6",
          description: "description of product6",
          price: 59.99,
          images: [{ id: 6, url: "", alt: "product6" }],
        },
      ],
    },
    about: {
      template: "topImageAbout",
      id: "about",
      title: "About Us",
      titleColor: "text-[#000000]",
      backgroundColor: "bg-[#ffffff]",
      image: "",
      imageAlt: "",
      imageObjectFit: "cover",
      titleFont: "font-serif",
      titleSize: "text-4xl",
      sections: [
        {
          sectionTitle: "Section 1",
          description: "Description for Section 1",
        },
      ],
      sectionColor: "text-[#000000]",
      sectionFont: "font-serif",
      sectionSize: "text-lg",
      sectionFontWeight: "font-semibold",
    },
    policies: {
      template: "TitleLeftContentCenterPolicies",
      id: "policies",
      title: "Our Policies",
      sections: [
        {
          title: "Privacy Policy",
          content:
            "Your privacy is important to us. We are committed to protecting your personal information and your right to privacy",
        },
        {
          title: "Terms of Service",
          content:
            "By using our website, you agree to comply with and be bound by these terms of service.",
        },
        {
          title: "Return Policy",
          content:
            "If you are not satisfied, you may return the item within 30 days of receipt for a full refund.",
        },
        {
          title: "Shipping Policy",
          content:
            "We offer worldwide shipping with tracking. Orders are processed within 1-2 business days and shipped via reliable carriers.",
        },
        {
          title: "Warranty Policy",
          content:
            "All our products comes with a lifetime warranty against manufacturing defects.",
        },
      ],
      backgroundColor: "bg-[#ffffff]",
      titleColor: "text-[#000000]",
      titleSize: "text-4xl",
      titleFont: "font-sans",
      titleFontWeight: "font-bold",
      sectionTitleColor: "text-[#000000]",
      sectionTitleSize: "text-2xl",
      sectionTitleFont: "font-serif",
      sectionTitleFontWeight: "font-medium",
      sectionContentColor: "text-[#cccccc]",
      sectionContentSize: "text-lg",
      sectionContentFont: "font-serif",
      sectionContentFontWeight: "font-medium",
    },
    contact: {
      template: "CenteredContact",
      id: "contact",
      title: "Contact Us",
      address: "123 Street,city,State,Zipcode",
      addressUrl: "https://maps.google.com/maps?address",
      openHours:
        "sunday - thursday: 9:00 AM - 10:00 PM\nSaturday: 10:00 AM - 4:00 PM\nfriday: Closed",
      phone: "+201234567890",
      contactEmail: "info@brand.com",
      socialLinks: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      image: "",
      showMap: true,
      backgroundColor: "bg-[#ffffff]",
      titleFont: "font-semibold",
      titleColor: "text-[#000000]",
      titleSize: "text-2xl",
      contentFont: "font-normal",
      contentColor: "text-[#000000]",
      contentSize: "text-sm",
    },
    footer: {
      brandName: "brand name",
      backgroundColor: "bg-[#ffffff]",
      textColor: "text-[#000000]",
      logo: {
        src: null,
        alt: "Custom Logo",
        size: "50px",
      },
      aboutLinks: [
        {
          label: "Contact Us",
          href: "#contact-us",
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
        {
          label: "Policies",
          href: "#policies",
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
        {
          label: "About Us",
          href: "#about-us",
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#000000]",
        hoverColor: "text-[#000000]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-s",
        fontWeight: "font-light",
        fontColor: "text-[#000000]",
      },
    },
  },
  // Template 2
  {
    id: "template2",
    header: {
      template: "template2",
      brandName: "Modern Store",
      backgroundColor: "bg-[#f8f9fa]",
      textColor: "text-[#212529]",
      logo: {
        src: "",
        alt: "Modern Store Logo",
        width: 60,
        height: 60,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Shop", isShown: true },
        { label: "About", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#212529]",
      dividerColor: "border-[#dee2e6]",
      fontFamily: "font-sans",
    },
    promo: {
      template: "ModernPromo",
      id: "promo",
      slides: [
        {
          title: "Modern Collection",
          description: "Discover our contemporary designs.",
          buttonText: "Explore",
          buttonLink: "/products",
          image: "",
          imageAlt: "",
        },
      ],
      autoPlay: true,
      showArrows: true,
      titleFont: "font-bold",
      titleColor: "text-[#ffffff]",
      titleSize: "text-3xl",
      descriptionFont: "font-normal",
      descriptionColor: "text-[#ffffff]/90",
      descriptionSize: "text-base",
      buttonFont: "font-medium",
      buttonColor: "bg-[#007bff]",
      buttonTextColor: "text-[#ffffff]",
      buttonSize: "text-sm",
      buttonRadius: "rounded-md",
      backgroundColor: "bg-[#343a40]",
      imageObjectFit: "cover",
    },
    footer: {
      brandName: "Modern Store",
      backgroundColor: "bg-[#f8f9fa]",
      textColor: "text-[#212529]",
      logo: {
        src: null,
        alt: "Modern Store Logo",
        size: "40px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#212529]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#212529]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 20,
        iconColor: "text-[#212529]",
        hoverColor: "text-[#007bff]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#6c757d]",
      },
    },
  },
  // Template 3
  {
    id: "template3",
    header: {
      template: "template3",
      brandName: "Vintage Shop",
      backgroundColor: "bg-[#f5f5dc]",
      textColor: "text-[#8b4513]",
      logo: {
        src: "",
        alt: "Vintage Shop Logo",
        width: 55,
        height: 55,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Collection", isShown: true },
        { label: "About", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#8b4513]",
      dividerColor: "border-[#d2b48c]",
      fontFamily: "font-serif",
    },
    footer: {
      brandName: "Vintage Shop",
      backgroundColor: "bg-[#f5f5dc]",
      textColor: "text-[#8b4513]",
      logo: {
        src: null,
        alt: "Vintage Shop Logo",
        size: "45px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b4513]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b4513]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 22,
        iconColor: "text-[#8b4513]",
        hoverColor: "text-[#d2b48c]",
      },
      copyrightStyles: {
        font: "font-serif",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#a0522d]",
      },
    },
  },
  // Template 4
  {
    id: "template4",
    header: {
      template: "template4",
      brandName: "Tech Store",
      backgroundColor: "bg-[#1a1a1a]",
      textColor: "text-[#00ff00]",
      logo: {
        src: "",
        alt: "Tech Store Logo",
        width: 65,
        height: 65,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Products", isShown: true },
        { label: "Support", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#00ff00]",
      dividerColor: "border-[#333333]",
      fontFamily: "font-mono",
    },
    footer: {
      brandName: "Tech Store",
      backgroundColor: "bg-[#1a1a1a]",
      textColor: "text-[#00ff00]",
      logo: {
        src: null,
        alt: "Tech Store Logo",
        size: "50px",
      },
      aboutLinks: [
        {
          label: "Support",
          href: "#support",
          font: "font-mono",
          fontSize: "text-sm",
          fontColor: "text-[#00ff00]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-mono",
          fontSize: "text-sm",
          fontColor: "text-[#00ff00]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 18,
        iconColor: "text-[#00ff00]",
        hoverColor: "text-[#ffffff]",
      },
      copyrightStyles: {
        font: "font-mono",
        fontSize: "text-xs",
        fontWeight: "font-normal",
        fontColor: "text-[#666666]",
      },
    },
  },
  // Template 5
  {
    id: "template5",
    header: {
      template: "template5",
      brandName: "Fashion Boutique",
      backgroundColor: "bg-[#fff0f5]",
      textColor: "text-[#ff1493]",
      logo: {
        src: "",
        alt: "Fashion Boutique Logo",
        width: 58,
        height: 58,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Fashion", isShown: true },
        { label: "Accessories", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#ff1493]",
      dividerColor: "border-[#ffb6c1]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Fashion Boutique",
      backgroundColor: "bg-[#fff0f5]",
      textColor: "text-[#ff1493]",
      logo: {
        src: null,
        alt: "Fashion Boutique Logo",
        size: "42px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#ff1493]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#ff1493]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#ff1493]",
        hoverColor: "text-[#ff69b4]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#c71585]",
      },
    },
  },
  // Template 6
  {
    id: "template6",
    header: {
      template: "template6",
      brandName: "Sports Gear",
      backgroundColor: "bg-[#f0f8ff]",
      textColor: "text-[#4169e1]",
      logo: {
        src: "",
        alt: "Sports Gear Logo",
        width: 62,
        height: 62,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Equipment", isShown: true },
        { label: "Apparel", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#4169e1]",
      dividerColor: "border-[#87ceeb]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Sports Gear",
      backgroundColor: "bg-[#f0f8ff]",
      textColor: "text-[#4169e1]",
      logo: {
        src: null,
        alt: "Sports Gear Logo",
        size: "48px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#4169e1]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#4169e1]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 20,
        iconColor: "text-[#4169e1]",
        hoverColor: "text-[#1e90ff]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#4682b4]",
      },
    },
  },
  // Template 7
  {
    id: "template7",
    header: {
      template: "template7",
      brandName: "Art Gallery",
      backgroundColor: "bg-[#faf0e6]",
      textColor: "text-[#8b0000]",
      logo: {
        src: "",
        alt: "Art Gallery Logo",
        width: 56,
        height: 56,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Gallery", isShown: true },
        { label: "Artists", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#8b0000]",
      dividerColor: "border-[#cd853f]",
      fontFamily: "font-serif",
    },
    footer: {
      brandName: "Art Gallery",
      backgroundColor: "bg-[#faf0e6]",
      textColor: "text-[#8b0000]",
      logo: {
        src: null,
        alt: "Art Gallery Logo",
        size: "44px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b0000]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b0000]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 22,
        iconColor: "text-[#8b0000]",
        hoverColor: "text-[#cd853f]",
      },
      copyrightStyles: {
        font: "font-serif",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#a0522d]",
      },
    },
  },
  // Template 8
  {
    id: "template8",
    header: {
      template: "template8",
      brandName: "Bookstore",
      backgroundColor: "bg-[#f5f5f5]",
      textColor: "text-[#2f4f4f]",
      logo: {
        src: "",
        alt: "Bookstore Logo",
        width: 54,
        height: 54,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Books", isShown: true },
        { label: "Authors", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#2f4f4f]",
      dividerColor: "border-[#696969]",
      fontFamily: "font-serif",
    },
    footer: {
      brandName: "Bookstore",
      backgroundColor: "bg-[#f5f5f5]",
      textColor: "text-[#2f4f4f]",
      logo: {
        src: null,
        alt: "Bookstore Logo",
        size: "46px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#2f4f4f]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#2f4f4f]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 20,
        iconColor: "text-[#2f4f4f]",
        hoverColor: "text-[#696969]",
      },
      copyrightStyles: {
        font: "font-serif",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#778899]",
      },
    },
  },
  // Template 9
  {
    id: "template9",
    header: {
      template: "template1",
      brandName: "Coffee Shop",
      backgroundColor: "bg-[#8b4513]",
      textColor: "text-[#f5deb3]",
      logo: {
        src: "",
        alt: "Coffee Shop Logo",
        width: 60,
        height: 60,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Menu", isShown: true },
        { label: "About", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#f5deb3]",
      dividerColor: "border-[#d2691e]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Coffee Shop",
      backgroundColor: "bg-[#8b4513]",
      textColor: "text-[#f5deb3]",
      logo: {
        src: null,
        alt: "Coffee Shop Logo",
        size: "50px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#f5deb3]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#f5deb3]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#f5deb3]",
        hoverColor: "text-[#ffffff]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#d2691e]",
      },
    },
  },
  // Template 10
  {
    id: "template10",
    header: {
      template: "template2",
      brandName: "Pet Store",
      backgroundColor: "bg-[#98fb98]",
      textColor: "text-[#228b22]",
      logo: {
        src: "",
        alt: "Pet Store Logo",
        width: 58,
        height: 58,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Pets", isShown: true },
        { label: "Supplies", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#228b22]",
      dividerColor: "border-[#90ee90]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Pet Store",
      backgroundColor: "bg-[#98fb98]",
      textColor: "text-[#228b22]",
      logo: {
        src: null,
        alt: "Pet Store Logo",
        size: "48px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#228b22]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#228b22]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 22,
        iconColor: "text-[#228b22]",
        hoverColor: "text-[#32cd32]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#006400]",
      },
    },
  },
  // Template 11
  {
    id: "template11",
    header: {
      template: "template3",
      brandName: "Jewelry Store",
      backgroundColor: "bg-[#000000]",
      textColor: "text-[#ffd700]",
      logo: {
        src: "",
        alt: "Jewelry Store Logo",
        width: 64,
        height: 64,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Jewelry", isShown: true },
        { label: "Collections", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#ffd700]",
      dividerColor: "border-[#333333]",
      fontFamily: "font-serif",
    },
    footer: {
      brandName: "Jewelry Store",
      backgroundColor: "bg-[#000000]",
      textColor: "text-[#ffd700]",
      logo: {
        src: null,
        alt: "Jewelry Store Logo",
        size: "52px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#ffd700]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#ffd700]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#ffd700]",
        hoverColor: "text-[#ffffff]",
      },
      copyrightStyles: {
        font: "font-serif",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#cccccc]",
      },
    },
  },
  // Template 12
  {
    id: "template4",
    header: {
      template: "template4",
      brandName: "Toy Store",
      backgroundColor: "bg-[#ff69b4]",
      textColor: "text-[#ffffff]",
      logo: {
        src: "",
        alt: "Toy Store Logo",
        width: 56,
        height: 56,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Toys", isShown: true },
        { label: "Games", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#ffffff]",
      dividerColor: "border-[#ff1493]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Toy Store",
      backgroundColor: "bg-[#ff69b4]",
      textColor: "text-[#ffffff]",
      logo: {
        src: null,
        alt: "Toy Store Logo",
        size: "46px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#ffffff]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#ffffff]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 22,
        iconColor: "text-[#ffffff]",
        hoverColor: "text-[#ff1493]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#ffb6c1]",
      },
    },
  },
  // Template 13
  {
    id: "template13",
    header: {
      template: "template5",
      brandName: "Music Store",
      backgroundColor: "bg-[#4b0082]",
      textColor: "text-[#9370db]",
      logo: {
        src: "",
        alt: "Music Store Logo",
        width: 62,
        height: 62,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Instruments", isShown: true },
        { label: "Accessories", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#9370db]",
      dividerColor: "border-[#663399]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Music Store",
      backgroundColor: "bg-[#4b0082]",
      textColor: "text-[#9370db]",
      logo: {
        src: null,
        alt: "Music Store Logo",
        size: "50px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#9370db]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#9370db]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#9370db]",
        hoverColor: "text-[#ffffff]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#663399]",
      },
    },
  },
  // Template 14
  {
    id: "template14",
    header: {
      template: "template6",
      brandName: "Garden Center",
      backgroundColor: "bg-[#228b22]",
      textColor: "text-[#f0fff0]",
      logo: {
        src: "",
        alt: "Garden Center Logo",
        width: 58,
        height: 58,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Plants", isShown: true },
        { label: "Tools", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#f0fff0]",
      dividerColor: "border-[#32cd32]",
      fontFamily: "font-sans",
    },
    footer: {
      brandName: "Garden Center",
      backgroundColor: "bg-[#228b22]",
      textColor: "text-[#f0fff0]",
      logo: {
        src: null,
        alt: "Garden Center Logo",
        size: "48px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#f0fff0]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-sans",
          fontSize: "text-base",
          fontColor: "text-[#f0fff0]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 22,
        iconColor: "text-[#f0fff0]",
        hoverColor: "text-[#98fb98]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#90ee90]",
      },
    },
  },
  // Template 15
  {
    id: "template15",
    header: {
      template: "template7",
      brandName: "Bakery",
      backgroundColor: "bg-[#fff8dc]",
      textColor: "text-[#8b4513]",
      logo: {
        src: "",
        alt: "Bakery Logo",
        width: 60,
        height: 60,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Pastries", isShown: true },
        { label: "Breads", isShown: true },
        { label: "Contact", isShown: true },
      ],
      iconColor: "text-[#8b4513]",
      dividerColor: "border-[#deb887]",
      fontFamily: "font-serif",
    },
    footer: {
      brandName: "Bakery",
      backgroundColor: "bg-[#fff8dc]",
      textColor: "text-[#8b4513]",
      logo: {
        src: null,
        alt: "Bakery Logo",
        size: "50px",
      },
      aboutLinks: [
        {
          label: "About Us",
          href: "#about",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b4513]",
          isShown: true,
        },
        {
          label: "Contact",
          href: "#contact",
          font: "font-serif",
          fontSize: "text-base",
          fontColor: "text-[#8b4513]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
      },
      socialMediaStyles: {
        iconSize: 24,
        iconColor: "text-[#8b4513]",
        hoverColor: "text-[#d2691e]",
      },
      copyrightStyles: {
        font: "font-serif",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        fontColor: "text-[#a0522d]",
      },
    },
  },
];

// Context for state management
interface TemplateContextType {
  templates: CustomizedTemplate[];
  updateTemplate: (id: string, updates: Partial<CustomizedTemplate>) => void;
  resetTemplate: (id: string) => void;
  getTemplate: (id: string) => CustomizedTemplate | undefined;
  resetAllTemplates: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

// Provider component
interface TemplateProviderProps {
  children: ReactNode;
}

export function TemplateProvider({ children }: TemplateProviderProps) {
  const [templates, setTemplates] =
    useState<CustomizedTemplate[]>(initialTemplates);

  const updateTemplate = (id: string, updates: Partial<CustomizedTemplate>) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const resetTemplate = (id: string) => {
    const originalTemplate = initialTemplates.find((t) => t.id === id);
    if (originalTemplate) {
      updateTemplate(id, originalTemplate);
    }
  };

  const getTemplate = (id: string) => {
    return templates.find((template) => template.id === id);
  };

  const resetAllTemplates = () => {
    setTemplates(initialTemplates);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        updateTemplate,
        resetTemplate,
        getTemplate,
        resetAllTemplates,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

// Custom hook for using templates
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
}

// Export static templates for read-only access
export const templates = initialTemplates;

// Export individual template getters
export const getTemplateById = (id: string) =>
  initialTemplates.find((t) => t.id === id);
export const getAllTemplates = () => initialTemplates;
