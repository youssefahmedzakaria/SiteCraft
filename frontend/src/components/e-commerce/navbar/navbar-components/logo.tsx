import type React from "react";
import Image from "next/image";

export interface LogoProps {
  brandName?: string | React.ReactNode;
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  textColor?: string
}

export const Logo: React.FC<LogoProps> = ({ brandName, logo, textColor }) => {
  return (
    <div className="flex items-center space-x-3 min-h-0 min-w-0 overflow-hidden">
      {logo && (
        <div className="h-12 md:h-16 max-h-full max-w-full flex-shrink-0 flex items-center">
          <Image
            src={logo.src || "/placeholder.png"}
            alt={logo.alt}
            width={logo.width || 32}
            height={logo.height || 32}
            className="object-contain max-h-full max-w-full"
            style={{height: '100%', width: 'auto', maxWidth: '100%'}}
            priority
          />
        </div>
      )}
      {typeof brandName === "string" ? (
        <span
          className="text-lg font-semibold"
          style={{
            color: textColor?.includes("[")
              ? textColor.split("-[")[1]?.slice(0, -1) || "#000000"
              : "#000000",
          }}
        >
          {brandName}
        </span>
      ) : (
        brandName
      )}
    </div>
  );
};
