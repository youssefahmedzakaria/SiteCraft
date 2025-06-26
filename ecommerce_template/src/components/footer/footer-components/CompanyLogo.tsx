import Image from "next/image";
import Link from "next/link";

interface CompanyLogoProps {
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  name: string;
  textColor: string;
}

export const CompanyLogo = ({ logo, name, textColor }: CompanyLogoProps) => {
  return (
    <Link href="/" className="flex items-center">
      {logo ? (
        <Image 
          src={logo.src} 
          alt={logo.alt} 
          width={logo.width} 
          height={logo.height}
          className="h-auto" 
        />
      ) : (
        <span className={`text-2xl font-bold tracking-wide ${textColor}`}>
          {name}
        </span>
      )}
    </Link>
  );
};