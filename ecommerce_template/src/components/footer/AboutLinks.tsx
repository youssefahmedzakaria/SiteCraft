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
    <div className="flex flex-none justify-center items-center gap-8 md:gap-8 w-full md:w-auto">
      {links.map((link, index) => (
        <Link 
          key={index} 
          href={link.href}
          className={`hover:underline ${link.font} ${link.fontSize} ${link.fontWeight} ${link.fontColor} hover:${link.fontColor}/80`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};