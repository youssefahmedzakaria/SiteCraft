"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  return (
    <Link href={`/e-commerce/${subdomain}`} className="flex items-center">
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