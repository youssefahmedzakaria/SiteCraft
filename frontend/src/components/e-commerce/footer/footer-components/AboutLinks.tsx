import Link from "next/link";

interface LinkItem {
  label: string;
  href: string;
  font?: string;
  fontSize?: string;
  fontWeight?: string;
  fontColor?: string;
}

interface AboutLinksProps {
  links: LinkItem[];
}

export const AboutLinks = ({ links }: AboutLinksProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 w-full">
      {links.map((link, index) => (
        <Link 
          key={index} 
          href={link.href}
          className={`hover:underline text-center ${link.font} ${link.fontSize} ${link.fontWeight} ${link.fontColor} hover:${link.fontColor}/80`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};