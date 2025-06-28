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
