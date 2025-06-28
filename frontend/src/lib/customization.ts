interface HeaderCustomizationAttributes {
  template: string;
  brandName: string;
  backgroundColor: string;
  textColor: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  menuItems: {
    label: string;
    isShown: boolean;
  }[];
  iconColor: string;
  dividerColor: string;
  searchIconColor: string;
  fontFamily: string;
}

export const initialHeader: HeaderCustomizationAttributes = {
  template: "template1",
  brandName: "Jewelry",
  backgroundColor: "bg-black/50",
  textColor: "text-white",
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
  iconColor: "text-white",
  dividerColor: "border-gray-200",
  searchIconColor: "text-white",
  fontFamily: "font-sans",
};

interface PromoCustomizationAttributes {
  template: string;
  id: string;
  slides: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
  }[];
  autoPlay: boolean;
  showArrows: boolean;
  titleFont: string;
  titleColor: string;
  titleSize: string;
  descriptionFont: string;
  descriptionColor: string;
  descriptionSize: string;
  buttonFont: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonSize: string;
  buttonRadius: string;
  backgroundColor: string;
  imageObjectFit: string;
}

export const initialPromo: PromoCustomizationAttributes = {
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
  ],
  backgroundColor: "bg-white",
  titleFont: "font-sans",
  titleColor: "text-white",
  titleSize: "text-4xl",
  descriptionFont: "font-sans",
  descriptionColor: "text-white",
  descriptionSize: "text-lg",
  buttonFont: "font-sans",
  buttonColor: "bg-white",
  buttonTextColor: "text-black",
  buttonSize: "text-lg",
  buttonRadius: "rounded-md",
  imageObjectFit: "cover",
};

interface AboutCustomizationAttributes {
  template: string;
  id: string;
  title: string;
  titleColor: string;
  description: string;
  secondaryDescription: string;
  descriptionColor: string;
  backgroundColor: string;
  image: string | null;
  imageAlt: string | null;
  imageObjectFit: string | null;
  titleFont: string;
  titleSize: string;
  titleFontWeight: string;
  descriptionFont: string;
  descriptionSize: string;
}

export const initialAbout: AboutCustomizationAttributes = {
  template: "TopImageAbout",
  id: "about",
  title: "About Us",
  titleColor: "text-black",
  description: "We are a passionate team dedicated to bringing you the best products and services. Our mission is to make your shopping experience exceptional.",
  secondaryDescription: "With years of experience in the industry, we understand what our customers need and strive to exceed their expectations.",
  descriptionColor: "text-gray-600",
  backgroundColor: "bg-white",
  image: "/about.jpg",
  imageAlt: "About our company",
  imageObjectFit: "cover",
  titleFont: "font-sans",
  titleSize: "text-4xl",
  titleFontWeight: "font-bold",
  descriptionFont: "font-sans",
  descriptionSize: "text-base md:text-lg",
};

interface PoliciesCustomizationAttributes {
  template: string;
  id: string;
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  backgroundColor: string;
  titleColor: string;
  titleSize: string;
  titleFont: string;
  titleFontWeight: string;
  sectionTitleColor: string;
  sectionTitleSize: string;
  sectionTitleFont: string;
  sectionTitleFontWeight: string;
  sectionContentColor: string;
  sectionContentSize: string;
  sectionContentFont: string;
  sectionContentFontWeight: string;
}

export const initialPolicies: PoliciesCustomizationAttributes = {
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
  backgroundColor: "bg-white",
  titleColor: "text-black",
  titleSize: "text-xl",
  titleFont: "font-sans",
  titleFontWeight: "font-normal",
  sectionTitleColor: "text-black",
  sectionTitleSize: "text-lg",
  sectionTitleFont: "font-sans",
  sectionTitleFontWeight: "font-normal",
  sectionContentColor: "text-black",
  sectionContentSize: "text-xl",
  sectionContentFont: "font-sans",
  sectionContentFontWeight: "font-normal",
};

interface ContactCustomizationAttributes {
  template: string;
  id: string;
  title: string;
  address: string;
  addressUrl: string;
  openHours: string;
  phone: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  imageUrl: string | null;
  showMap: boolean;
  backgroundColor: string;
  titleFont: string;
  titleColor: string;
  titleSize: string;
  contentFont: string;
  contentColor: string;
  contentSize: string;
}

export const initialContact: ContactCustomizationAttributes = {
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
  backgroundColor: "bg-white",
  titleFont: "font-bold",
  titleColor: "text-black",
  titleSize: "text-3xl",
  contentFont: "font-semibold",
  contentColor: "text-black",
  contentSize: "text-lg",
};

interface FooterCustomizationAttributes {
  brandName: string;
  backgroundColor: string;
  textColor: string;
  Logo: {
    src: string | null;
    alt: string;
  };
  aboutLinks: {
    label: string;
    href: string;
    font: string;
    fontSize: string;
    fontColor: string;
  }[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
  };
  socialMediaStyles: {
    iconSize: number;
    iconColor: string;
    hoverColor: string;
  };
  copyrightStyles: {
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
  };
}

export const initialFooter: FooterCustomizationAttributes = {
  brandName: "BRAND",
  backgroundColor: "bg-white",
  textColor: "text-black",
  Logo: {
    src: "/logo.png",
    alt: "Company Logo",
  },
  aboutLinks: [
    {
      label: "Contact Us",
      href: "/contact",
      font: "font-serif",
      fontSize: "text-lg black",
      fontColor: "text-black",
    },
    {
      label: "About Us",
      href: "/about",
      font: "font-serif",
      fontSize: "text-lg black",
      fontColor: "text-black",
    },
    {
      label: "Policies",
      href: "/policies",
      font: "font-serif",
      fontSize: "text-lg black",
      fontColor: "text-black",
    },
  ],
  socialMedia: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
  },
  socialMediaStyles: {
    iconSize: 20,
    iconColor: "text-black",
    hoverColor: "text-black",
  },
  copyrightStyles: {
    font: "font-sans",
    fontSize: "text-sm",
    fontWeight: "font-light",
    fontColor: "text-black",
  },
};
