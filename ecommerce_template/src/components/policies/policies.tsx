import { cn } from "@/lib/utils";

export interface PoliciesProps {
  id?: string;
  title?: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
  variant?: "centered" | "default" | "left" | "titleLeftContentCenter";
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
  titleFont?: string;
  titleFontWeight?: string;
  sectionTitleColor?: string;
  sectionTitleSize?: string;
  sectionTitleFont?: string;
  sectionTitleFontWeight?: string;
  sectionContentColor?: string;
  sectionContentSize?: string;
  sectionContentFont?: string;
  sectionContentFontWeight?: string;
}

export function Policies({  
  id,
  variant = "default",
  title,
  sections,
  backgroundColor,
  titleColor,
  titleSize,
  titleFont,
  titleFontWeight,
  sectionTitleColor,
  sectionTitleSize,
  sectionTitleFont,
  sectionTitleFontWeight,
  sectionContentColor,
  sectionContentSize,
  sectionContentFont,
  sectionContentFontWeight,
}: PoliciesProps) {
  const variants = {
    centered: {
      container: `container mx-auto px-4 py-8 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-4xl mx-auto px-4 text-center",
      title: cn("md:text-4xl lg:text-6xl text-center mb-8 md:mb-12", titleColor, titleSize, titleFont, titleFontWeight),
      sectionTitle: cn(" md:text-2xl text-center mb-3 md:mb-4", sectionTitleColor, sectionTitleSize, sectionTitleFont, sectionTitleFontWeight),
      sectionContent: cn("text-center mb-8 md:mb-12", sectionContentColor, sectionContentSize, sectionContentFont, sectionContentFontWeight),
      subtitleWrapper: "mt-8 md:mt-12 text-center italic",
    },
    default: {
      container: `container mx-auto px-4 py-8 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4",
      title: cn(" md:text-4xl lg:text-6xl  text-center mb-8 md:mb-12", titleColor, titleSize, titleFont, titleFontWeight),
      sectionTitle: cn(" md:text-2xl  mb-3 md:mb-4", sectionTitleColor, sectionTitleSize, sectionTitleFont, sectionTitleFontWeight),
      sectionContent: cn(" mb-8 md:mb-12", sectionContentColor, sectionContentSize, sectionContentFont, sectionContentFontWeight),
      subtitleWrapper: "mt-8 md:mt-12 text-center italic",
    },
    titleLeftContentRight: {
      container: `container mx-auto px-4 py-8 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8",
      titleWrapper: "flex flex-col mb-6 md:mb-0",
      title: cn("md:text-4xl lg:text-6xl mb-2 md:mb-4", titleColor, titleSize, titleFont, titleFontWeight),
      contentWrapper: "space-y-6 md:space-y-8",
      sectionTitle: cn(" md:text-2xl mb-2", sectionTitleColor, sectionTitleSize, sectionTitleFont, sectionTitleFontWeight),
      sectionContent: cn( sectionContentColor, sectionContentSize, sectionContentFont, sectionContentFontWeight),
      subtitleWrapper: "mt-2 md:mt-4 italic",
    },
    left: {
      container: `container mx-auto px-4 py-8 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4",
      title: cn("md:text-4xl lg:text-6xl text-left mb-8 md:mb-12", titleColor, titleSize, titleFont, titleFontWeight),
      sectionTitle: cn(" md:text-2xl mb-3 md:mb-4", sectionTitleColor, sectionTitleSize, sectionTitleFont, sectionTitleFontWeight),
      sectionContent: cn(" mb-8 md:mb-12", sectionContentColor, sectionContentSize, sectionContentFont, sectionContentFontWeight),
      subtitleWrapper: "mt-8 md:mt-12 italic",
    },
    titleLeftContentCenter: {
      container: `container mx-auto px-4 py-8 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8",
      titleWrapper: "flex flex-col mb-6 md:mb-0",
      title: cn("md:text-4xl lg:text-6xl mb-2 md:mb-4", titleColor, titleSize, titleFont, titleFontWeight),
      contentWrapper: "space-y-6 md:space-y-8 md:col-span-2",
      sectionTitle: cn(" md:text-2xl text-center mb-3 md:mb-4", sectionTitleColor, sectionTitleSize, sectionTitleFont, sectionTitleFontWeight),
      sectionContent: cn("text-center", sectionContentColor, sectionContentSize, sectionContentFont, sectionContentFontWeight),
      subtitleWrapper: "mt-2 md:mt-4 italic text-center md:col-span-2",
    },
  };
  const style = variants[variant];
  return (
    <div className={cn("w-full flex-shrink-0", backgroundColor)}>
      <div className={cn("container mx-auto px-4 py-8 md:py-16", style.container)}>
        <h2
          className={cn(
            "md:text-4xl lg:text-6xl mb-4",
            titleColor,
            titleSize,
            titleFont,
            titleFontWeight,
            style.title
          )}
        >
          {title}
        </h2>
        <div className="max-w-4xl mx-auto px-4">
          {sections?.map((section, index) => (
            <div key={index} className="mb-8">
              <h3
                className={cn(
                  "md:text-2xl lg:text-4xl font-medium mb-4",
                  sectionTitleColor,
                  sectionTitleSize,
                  sectionTitleFont,
                  sectionTitleFontWeight,
                  style.sectionTitle
                )}
              >
                {section.title}
              </h3>
              <p
                className={cn(
                  "md:text-lg lg:text-xl text-gray-600",
                  sectionContentColor,
                  sectionContentSize,
                  sectionContentFont,
                  sectionContentFontWeight,
                  sectionContentFont,
                  sectionContentFontWeight,
                  style.sectionContent
                )}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}