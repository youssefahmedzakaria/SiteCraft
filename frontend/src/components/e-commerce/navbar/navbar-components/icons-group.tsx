"use client";
import React from "react";
import { User, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface IconsGroupProps {
  iconColor?: string;
  showLabels?: boolean;
  textColor?: string;

  orientation?: "horizontal" | "vertical";
}

export const IconsGroup: React.FC<IconsGroupProps> = ({
  iconColor = "text-white",
  showLabels = false,
  textColor = "text-white",
  orientation = "horizontal",
}) => {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const icons = [
    { Icon: User, label: "Profile", href: `/e-commerce/${subdomain}/profile` },
    { Icon: ShoppingBag, label: "Cart", href: `/e-commerce/${subdomain}/cart` },
    {
      Icon: Heart,
      label: "Favorites",
      href: `/e-commerce/${subdomain}/favorites`,
    },
  ];

  return (
    <div
      className={`flex ${
        orientation === "horizontal" ? "space-x-6" : "flex-col space-y-4"
      }`}
    >
      {icons.map(({ Icon, label, href }) => (
        <Link
          key={label}
          href={href}
          className={`p-1 hover:opacity-80 flex ${
            orientation === "horizontal"
              ? "items-center"
              : "flex-col items-center"
          }`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {showLabels && (
            <span
              className={`${
                orientation === "horizontal" ? "ml-2" : "mt-1"
              } text-sm ${textColor}`}
            >
              {label}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};
