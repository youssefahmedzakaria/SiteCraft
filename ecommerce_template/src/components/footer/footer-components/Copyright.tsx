import Link from "next/link";

interface CopyrightProps {
  text: string;
  styles: {
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
  };
}

export const Copyright = ({ text, styles }: CopyrightProps) => {
  return (
    <div className={`mt-8 text-center ${styles.font} ${styles.fontSize} ${styles.fontWeight} ${styles.fontColor}`}>
      {text}
      <span className="mx-2">|</span>
      <Link 
        href="" 
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Powered by SiteCraft
      </Link>
    </div>
  );
};