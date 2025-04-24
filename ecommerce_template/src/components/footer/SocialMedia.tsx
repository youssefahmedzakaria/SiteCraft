import Image from "next/image";
import Link from "next/link";

interface SocialMediaProps {
  socialMedia: Record<string, string | undefined>;
  styles: {
    iconSize: number;
    iconColor: string;
    hoverColor: string;
  };
  textColor: string;
}

export const SocialMedia = ({ socialMedia, styles, textColor }: SocialMediaProps) => {
  const socialIcons = {
    facebook: "/facebook.png",
    instagram: "/instagram.png",
    youtube: "/youtube.png",
    pinterest: "/pinterest.png",
    twitter: "/x.png",
    email: "/email.svg"
  };

  return (
    <div className="flex gap-6">
      {Object.entries(socialMedia).map(([platform, url]) => {
        if (!url) return null;
        
        if (platform === 'email') {
          return (
            <a 
              key={platform} 
              href={`mailto:${url}`} 
              rel="noopener noreferrer"
              className={`${styles.iconColor} hover:${styles.hoverColor}`}
            >
              <Image 
                src={socialIcons[platform as keyof typeof socialIcons]} 
                alt={platform} 
                width={styles.iconSize} 
                height={styles.iconSize} 
                className={`${textColor === 'text-white' ? 'filter brightness-0 invert' : ''}`}
              />
            </a>
          );
        }
        
        return (
          <Link 
            key={platform} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.iconColor} hover:${styles.hoverColor}`}
          >
            <Image 
              src={socialIcons[platform as keyof typeof socialIcons]} 
              alt={platform} 
              width={styles.iconSize} 
              height={styles.iconSize} 
              className={`${textColor === 'text-white' ? 'filter brightness-0 invert' : ''}`}
            />
          </Link>
        );
      })}
    </div>
  );
};