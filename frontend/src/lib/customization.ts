export interface HeaderCustomizationAttributes {
  template:
    | "template1"
    | "template2"
    | "template3"
    | "template4"
    | "template5"
    | "template6"
    | "template7"
    | "template8";
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

export interface PromoCustomizationAttributes {
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
  imageObjectFit: "cover" | "fill" | "contain";
}

export interface AboutCustomizationAttributes {
  template: string;
  id: string;
  title: string;
  titleColor: string;
  description: string;
  secondaryDescription: string;
  descriptionColor: string;
  backgroundColor: string;
  image: string;
  imageAlt: string;
  imageObjectFit: "cover" | "fill" | "contain";
  titleFont: string;
  titleSize: string;
  descriptionFont: string;
  descriptionSize: string;
}

export interface PoliciesCustomizationAttributes {
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

export interface ContactCustomizationAttributes {
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
  imageUrl: string;
  showMap: boolean;
  backgroundColor: string;
  titleFont: string;
  titleColor: string;
  titleSize: string;
  contentFont: string;
  contentColor: string;
  contentSize: string;
}

export interface FooterCustomizationAttributes {
  brandName: string;
  backgroundColor: string;
  textColor: string;
  logo: {
    src: string | null;
    alt: string;
    size: string;
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
