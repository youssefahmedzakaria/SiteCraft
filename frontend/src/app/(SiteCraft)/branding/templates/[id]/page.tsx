"use client";
import { CenteredAbout } from "@/components/e-commerce/about-us/templates/centered-about";
import { LeftAlignedAbout } from "@/components/e-commerce/about-us/templates/left-aligned-about";
import { RightAlignedAbout } from "@/components/e-commerce/about-us/templates/right-aligned-about";
import { TopImageAbout } from "@/components/e-commerce/about-us/templates/top-image-about";
import FeaturedGridCategoryTemplate from "@/components/e-commerce/category-lists/templates/featured-grid-template";
import { GridCategoryTemplate } from "@/components/e-commerce/category-lists/templates/grid-template";
import { HorizontalScrollCategoryTemplate } from "@/components/e-commerce/category-lists/templates/horizontal-scroll-template";
import { CenteredContact } from "@/components/e-commerce/contact/templates/centered-contact";
import { LeftAlignedContact } from "@/components/e-commerce/contact/templates/left-aligned";
import { MinimalLeftContact } from "@/components/e-commerce/contact/templates/minimal-left";
import { MinimalRightContact } from "@/components/e-commerce/contact/templates/minimal-right";
import { RightAlignedContact } from "@/components/e-commerce/contact/templates/right-aligned";
import { Footer } from "@/components/e-commerce/footer/Footer";
import Navbar from "@/components/e-commerce/navbar/Navbar";
import { CenteredPolicies } from "@/components/e-commerce/policies/templates/centerd";
import { DefaultPolicies } from "@/components/e-commerce/policies/templates/default";
import { LeftPolicies } from "@/components/e-commerce/policies/templates/left";
import { TitleLeftContentCenterPolicies } from "@/components/e-commerce/policies/templates/titleLeftContentCenter";
import { FeaturedGridProductTemplate } from "@/components/e-commerce/product-lists/templates/featured-grid-template";
import { GridProductTemplate } from "@/components/e-commerce/product-lists/templates/grid-template";
import { HorizontalScrollProductTemplate } from "@/components/e-commerce/product-lists/templates/horizontal-scroll-template";
import { CenteredPromo } from "@/components/e-commerce/promo/templates/centered-promo";
import { LeftAlignedPromo } from "@/components/e-commerce/promo/templates/left-aligned-promo";
import { MinimalLeftPromo } from "@/components/e-commerce/promo/templates/minimal-left-promo";
import { MinimalRightPromo } from "@/components/e-commerce/promo/templates/minimal-right-promo";
import { OverlayPromo } from "@/components/e-commerce/promo/templates/overlay-promo";
import { RightAlignedPromo } from "@/components/e-commerce/promo/templates/right-aligned-promo";
import { SplitPromo } from "@/components/e-commerce/promo/templates/split-promo";
import { CustomizedTemplate } from "@/lib/customization";
import { useTemplates } from "@/lib/templates";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

const initialSections: Section[] = [];

export default function TemplateCard() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const templateId = pathSegments[3];
  const { getTemplate } = useTemplates();
  const [params, setParams] = useState<CustomizedTemplate>(
    getTemplate(templateId)!
  );

  const [sections, setSections] = useState<Section[]>(initialSections);

  const getSectionsFromTemplate = () => {
    const sectionIds = Object.keys(params);
    const sections = sectionIds.map((sectionId) => ({
      id: sectionId,
      title: sectionId,
    }));
    setSections(sections);
  };

  useEffect(() => {
    getSectionsFromTemplate();
  }, []);

  const sectionComponents = {
    PromoSlider: {
      CenteredPromo: (
        <CenteredPromo {...params.PromoSlider} isClickable={false} />
      ),
      LeftAlignedPromo: (
        <LeftAlignedPromo {...params.PromoSlider} isClickable={false} />
      ),
      RightAlignedPromo: (
        <RightAlignedPromo {...params.PromoSlider} isClickable={false} />
      ),
      MinimalLeftPromo: (
        <MinimalLeftPromo {...params.PromoSlider} isClickable={false} />
      ),
      MinimalRightPromo: (
        <MinimalRightPromo {...params.PromoSlider} isClickable={false} />
      ),
      OverlayPromo: (
        <OverlayPromo {...params.PromoSlider} isClickable={false} />
      ),
      SplitPromo: <SplitPromo {...params.PromoSlider!} isClickable={false} />,
    },
    Products: {
      FeaturedGrid: (
        <FeaturedGridProductTemplate
          {...params.Products!}
          isClickable={false}
        />
      ),
      HorizontalScroll: (
        <HorizontalScrollProductTemplate
          {...params.Products!}
          isClickable={false}
        />
      ),
      Grid: <GridProductTemplate {...params.Products!} isClickable={false} />,
    },
    Categories: {
      FeaturedGrid: (
        <FeaturedGridCategoryTemplate
          {...params.Categories!}
          isClickable={false}
        />
      ),
      HorizontalScroll: (
        <HorizontalScrollCategoryTemplate
          {...params.Categories!}
          isClickable={false}
        />
      ),
      Grid: (
        <GridCategoryTemplate {...params.Categories!} isClickable={false} />
      ),
    },
    AboutUs: {
      TopImageAbout: <TopImageAbout {...params.AboutUs!} />,
      CenteredAbout: <CenteredAbout {...params.AboutUs!} />,
      LeftAlignedAbout: <LeftAlignedAbout {...params.AboutUs!} />,
      RightAlignedAbout: <RightAlignedAbout {...params.AboutUs!} />,
    },
    ContactUs: {
      MinimalRightContact: <MinimalRightContact {...params.ContactUs} />,
      CenteredContact: <CenteredContact {...params.ContactUs} />,
      LeftAlignedContact: <LeftAlignedContact {...params.ContactUs} />,
      RightAlignedContact: <RightAlignedContact {...params.ContactUs} />,
      MinimalLeftContact: <MinimalLeftContact {...params.ContactUs} />,
    },
    Policies: {
      TitleLeftContentCenterPolicies: (
        <TitleLeftContentCenterPolicies {...params.Policies} />
      ),
      DefaultPolicies: <DefaultPolicies {...params.Policies} />,
      LeftPolicies: <LeftPolicies {...params.Policies} />,
      CenteredPolicies: <CenteredPolicies {...params.Policies} />,
    },
  };
  return (
    <div className="flex-1 bg-gray-100 rounded-lg overflow-y-auto">
      <div
        className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4`}
      >
        <Navbar
          isCustomize={true}
          template={params.header.template}
          brandName={params.header.brandName}
          backgroundColor={params.header.backgroundColor}
          textColor={params.header.textColor}
          logo={params.header.logo}
          menuItems={params.header.menuItems.map((item) => ({
            label: item.label,
            href: "#",
            isShown: item.isShown,
          }))}
          iconColor={params.header.iconColor}
          dividerColor={params.header.dividerColor}
          fontFamily={params.header.fontFamily}
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
              template = params.PromoSlider!.template;
              break;
            case "Products":
              template = params.Products!.template;
              break;
            case "Categories":
              template = params.Categories!.template;
              break;
            case "AboutUs":
              template = params.AboutUs!.template;
              break;
            case "Policies":
              template = params.Policies!.template;
              break;
            case "ContactUs":
              template = params.ContactUs!.template;
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
          companyName={params.footer.brandName}
          textColor={params.footer.textColor}
          companyLogo={{
            src: params.footer.logo.src || "/placeholder.png",
            alt: params.footer.logo.alt,
            width: parseInt(params.footer.logo.size) || 50,
            height: parseInt(params.footer.logo.size) || 50,
          }}
          aboutLinks={params.footer.aboutLinks}
          socialMedia={params.footer.socialMedia}
          socialMediaStyles={params.footer.socialMediaStyles}
          copyrightStyles={params.footer.copyrightStyles}
          backgroundColor={params.footer.backgroundColor}
        />
      </div>
    </div>
  );
}
