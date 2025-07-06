import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/SiteCraft/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export function SiteCraftNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Get the active link position for the sliding underline
  const getActiveIndex = () => {
    switch (pathname) {
      case "/about": return 0;
      case "/features": return 1;
      case "/pricing": return 2;
      case "/dashboard": return 3;
      default: return -1;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-colors hover:opacity-90"
          >
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="SiteCraft Logo"
                width={32}
                height={32}
                className="h-6 w-auto object-contain"
              />
              <Image
                src="/font.png"
                alt="SiteCraft"
                width={120}
                height={24}
                className="h-18 w-auto ml-2 object-contain hidden sm:block"
              />
            </div>
          </Link>
          
          {/* Animated Navigation */}
          <nav className="hidden md:flex items-center relative">
            <div className="flex items-center space-x-8">
              <Link
                href="/about"
                className={`text-sm font-medium transition-all duration-300 relative px-2 py-1 rounded-md group
                  ${pathname === "/about" 
                    ? "text-logo-txt-hover bg-logo-light-button-hover/20" 
                    : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover/10"
                  }`}
              >
                About
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-logo-txt-hover rounded-full transition-all duration-300
                  ${pathname === "/about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"}`} />
              </Link>
              <Link
                href="/features"
                className={`text-sm font-medium transition-all duration-300 relative px-2 py-1 rounded-md group
                  ${pathname === "/features" 
                    ? "text-logo-txt-hover bg-logo-light-button-hover/20" 
                    : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover/10"
                  }`}
              >
                Features
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-logo-txt-hover rounded-full transition-all duration-300
                  ${pathname === "/features" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"}`} />
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-all duration-300 relative px-2 py-1 rounded-md group
                  ${pathname === "/pricing" 
                    ? "text-logo-txt-hover bg-logo-light-button-hover/20" 
                    : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover/10"
                  }`}
              >
                Pricing
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-logo-txt-hover rounded-full transition-all duration-300
                  ${pathname === "/pricing" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"}`} />
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-all duration-300 relative px-2 py-1 rounded-md group
                  ${pathname === "/dashboard" 
                    ? "text-logo-txt-hover bg-logo-light-button-hover/20" 
                    : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover/10"
                  }`}
              >
                Dashboard
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-logo-txt-hover rounded-full transition-all duration-300
                  ${pathname === "/dashboard" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"}`} />
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex items-center">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={logout}
              className="font-medium text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-bg-hover transition-colors"
            >
              Logout
            </Button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover transition-colors sm:size-md"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
