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
import { siteCraftCache } from "@/lib/cache";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

const initialSections: Section[] = [];

export default function TemplateView() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const templateId = pathSegments[3];
  const { getTemplate } = useTemplates();
  const [params, setParams] = useState<CustomizedTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sections, setSections] = useState<Section[]>(initialSections);

  useEffect(() => {
    // Try to get template from cache first, then fall back to static templates
    const cachedData = siteCraftCache.getData();
    let template: CustomizedTemplate | null = null;

    if (cachedData.templates && cachedData.templates.length > 0) {
      // Find the template in cached templates
      template = cachedData.templates.find((t) => t.id === templateId) || null;
      console.log(
        `📦 Template ${templateId} from cache:`,
        template ? "Found" : "Not found"
      );
    }

    if (!template) {
      // Fall back to static templates
      template = getTemplate(templateId) || null;
      console.log(
        `📦 Template ${templateId} from static templates:`,
        template ? "Found" : "Not found"
      );
    }

    if (template) {
      setParams(template);
      console.log(`✅ Template ${templateId} loaded successfully:`, template);
    } else {
      console.error(
        `❌ Template ${templateId} not found in cache or static templates`
      );
    }

    setIsLoading(false);
  }, [templateId, getTemplate]);

  const getSectionsFromTemplate = () => {
    if (!params) return;

    const sectionIds = Object.keys(params);
    const sections = sectionIds.map((sectionId) => ({
      id: sectionId,
      title: sectionId,
    }));
    setSections(sections);
  };

  useEffect(() => {
    if (params) {
      getSectionsFromTemplate();
    }
  }, [params]);

  if (isLoading || !params) {
    return (
      <div className="flex-1 w-full h-full rounded-lg overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <span className="text-lg text-gray-600">Loading template...</span>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="flex-1 w-full h-full bg-gray-100 rounded-lg overflow-y-auto">
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
