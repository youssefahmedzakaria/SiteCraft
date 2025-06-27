import React from 'react';
import Image from 'next/image';

export interface LogoProps {
  brandName?: string | React.ReactNode;
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ brandName, logo, textColor }) => {
  return (
    <div className="flex items-center space-x-3">
      {logo && (
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width || 32}
          height={logo.height || 32}
          className="object-contain"
        />
      )}
      {typeof brandName === 'string' ? (
        <span className={`text-lg font-semibold ${textColor}`}>{brandName}</span>
      ) : (
        brandName
      )}
    </div>
  );
};