/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import { usePathname } from "next/navigation";

const defaultTheme: ThemeConfig = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "black",
  secondaryColor: "white",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

export default function FavoritesPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const { state, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const theme = defaultTheme;

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  if (state.items.length === 0) {
    return (
      <div
        className={cn("min-h-screen pt-20 px-8", theme.fontFamily)}
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
        }}
      >
        <div className="text-center py-16">
          <Heart
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: theme.secondaryColor }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            Your favorites list is empty
          </h1>
          <p className="mb-8" style={{ color: theme.secondaryColor }}>
            Save items you love to easily find them later.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: theme.secondaryColor,
                color: theme.backgroundColor,
              }}
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("min-h-screen pt-20 px-8", theme.fontFamily)}
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex justify-between items-center pt-8 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.textColor }}>
          My Favorites
        </h1>
        <p style={{ color: theme.secondaryColor }}>
          {state.items.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative border overflow-hidden hover:shadow-lg transition-shadow",
              theme.borderRadius
            )}
            style={{
              backgroundColor: theme.accentColor,
              borderColor: theme.secondaryColor,
            }}
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-colors"
                style={{ color: theme.secondaryColor }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{
                    stroke: theme.secondaryColor,
                    fill: theme.secondaryColor,
                    strokeWidth: 2,
                  }}
                />
              </button>
            </div>

            <div className="p-4">
              <Link href={`/e-commerce/${subdomain}/product/${item.id}`}>
                <h3
                  className="font-medium hover:underline"
                  style={{ color: theme.textColor }}
                >
                  {item.name}
                </h3>
              </Link>
              <p
                className="text-lg font-semibold mt-2"
                style={{ color: theme.textColor }}
              >
                ${item.price}
              </p>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1"
                  size="sm"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    color: theme.backgroundColor,
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromFavorites(item.id)}
                  style={{
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor,
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href={`/e-commerce/${subdomain}/products`}>
          <Button
            variant="outline"
            size="lg"
            style={{
              backgroundColor: theme.secondaryColor,
              color: theme.backgroundColor,
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
