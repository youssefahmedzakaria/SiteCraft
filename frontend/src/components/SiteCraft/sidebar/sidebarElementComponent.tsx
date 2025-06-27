import type { SidebarElement } from "@/lib/sidebarElements";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  Home,
  Layout,
  Tags,
  ShoppingBag,
  ShoppingCart,
  Users,
  BarChart2,
  Store,
  Truck,
  LucideIcon,
  CornerDownRight,
  Settings,
  LogOut,
} from "lucide-react";

// Create a mapping of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Home,
  Layout,
  Tags,
  ShoppingBag,
  ShoppingCart,
  Users,
  BarChart2,
  Store,
  Truck,
  CornerDownRight,
  Settings,
  LogOut,
};

export function SidebarElementComponent({
  element,
}: {
  element: SidebarElement;
}) {
  const pathname = usePathname();

  // Check if current path matches this element's destination
  const isActive =
    element.destination === "/"
      ? pathname === "/" // Log Out (only active on exact "/")
      : element.destination === "/dashboard"
      ? pathname === "/dashboard" || pathname === "/dashboard/" // Overview (only active on exact match)
      : pathname === element.destination || // Exact match (e.g., "/dashboard/products")
        (pathname.startsWith(`${element.destination}/`) && // Sub-route (e.g., "/dashboard/products/add")
          !pathname.includes("/dashboard/dashboard")); // Edge case guard

  // Dynamically get the icon component from lucide-react
  const IconComponent = iconMap[element.iconName];

  return (
    <>
      <Button
        variant="ghost"
        className={`w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2 ${
          isActive ? "bg-logo-light-button-hover text-logo-txt-hover" : ""
        }`}
      >
        {IconComponent && <IconComponent size={20} />}

        <span>{element.title}</span>
      </Button>
    </>
  );
}
