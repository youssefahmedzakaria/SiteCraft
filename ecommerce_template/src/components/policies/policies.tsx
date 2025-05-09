import { cn } from "@/lib/utils";
export interface PoliciesProps {
  id?: string;
  title?: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
  variant?: "centered" | "default" | "left" |"titleLeftContentCenter";
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
  sectionTitleColor?: string;
  sectionTitleSize?: string;
  sectionContentColor?: string;
  sectionContentSize?: string;
  sectionContentFont?: string;
  sectionContentFontSize?: string;
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
  sectionTitleColor,
  sectionTitleSize,
  sectionContentColor,
  sectionContentSize,
  sectionContentFont,
  sectionContentFontSize,
  sectionContentFontWeight,
}: PoliciesProps) {
  const variants = {
    centered: {
      container: `relative py-12 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-4xl mx-auto px-4 text-center",
      title: cn("text-3xl md:text-4xl lg:text-6xl font-light text-center mb-8 md:mb-12", titleColor, titleSize),
      sectionTitle: cn("text-xl md:text-2xl font-medium text-center mb-3 md:mb-4", sectionTitleColor, sectionTitleSize),
      sectionContent: cn("text-center mb-8 md:mb-12", sectionContentColor, sectionContentSize),
      subtitleWrapper: "mt-8 md:mt-12 text-center italic",
    },
    default: {
      container: `relative py-12 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4",
      title: cn("text-3xl md:text-4xl lg:text-6xl font-light text-center mb-8 md:mb-12", titleColor, titleSize),
      sectionTitle: cn("text-xl md:text-2xl font-medium mb-3 md:mb-4", sectionTitleColor, sectionTitleSize),
      sectionContent: cn("text-gray-600 mb-8 md:mb-12", sectionContentColor, sectionContentSize),
      subtitleWrapper: "mt-8 md:mt-12 text-center italic",
    },
    titleLeftContentRight: {
      container: `relative py-12 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8",
      titleWrapper: "flex flex-col mb-6 md:mb-0",
      title: cn("text-3xl md:text-4xl lg:text-6xl font-light mb-2 md:mb-4", titleColor, titleSize),
      contentWrapper: "space-y-6 md:space-y-8",
      sectionTitle: cn("text-xl md:text-2xl font-medium mb-2", sectionTitleColor, sectionTitleSize),
      sectionContent: cn("text-gray-600", sectionContentColor, sectionContentSize),
      subtitleWrapper: "mt-2 md:mt-4 italic",
    },
    left: {
      container: `relative py-12 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4",
      title: cn("text-3xl md:text-4xl lg:text-6xl font-light text-left mb-8 md:mb-12", titleColor, titleSize),
      sectionTitle: cn("text-xl md:text-2xl font-medium mb-3 md:mb-4", sectionTitleColor, sectionTitleSize),
      sectionContent: cn("text-gray-600 mb-8 md:mb-12", sectionContentColor, sectionContentSize),
      subtitleWrapper: "mt-8 md:mt-12 italic",
    },
    titleLeftContentCenter: {
      container: `relative py-12 md:py-16 ${backgroundColor}`,
      wrapper: "max-w-6xl mx-auto px-4 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8",
      titleWrapper: "flex flex-col mb-6 md:mb-0",
      title: cn("text-3xl md:text-4xl lg:text-6xl font-light mb-2 md:mb-4", titleColor, titleSize),
      contentWrapper: "space-y-6 md:space-y-8 md:col-span-2",
      sectionTitle: cn("text-xl md:text-2xl font-medium text-center mb-3 md:mb-4", sectionTitleColor, sectionTitleSize),
      sectionContent: cn("text-center text-gray-600", sectionContentColor, sectionContentSize),
      subtitleWrapper: "mt-2 md:mt-4 italic text-center md:col-span-2",
    },
  };
  const style = variants[variant];
  return (
    <div
      id={id}
      className={cn(
        "w-full flex-shrink-0",
        style.container,
        backgroundColor
      )}
    >
      <h2
        className={cn(
          "text-xl md:text-4xl font-bold mb-4",
          titleColor,
          titleSize,
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
                "text-2xl font-medium mb-4",
                sectionTitleColor,
                sectionTitleSize,
                style.sectionTitle
              )}
            >
              {section.title}
            </h3>
            <p
              className={cn(
                "text-gray-600",
                sectionContentColor,
                sectionContentSize,
                sectionContentFont,
                sectionContentFontSize,
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
  );
  }
  


