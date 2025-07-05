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
import { useState } from "react";

export default function FavoritesPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  const { state, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    removeFromFavorites(item.id);
  };

  if (state.items.length === 0) {
    return (
      <div
        className={cn("min-h-screen pt-20 px-8 bg-[#ffffff] font-sans")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <Heart
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: initialColors.secondary }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            Your favorites list is empty
          </h1>
          <p className="mb-8" style={{ color: initialColors.secondary }}>
            Save items you love to easily find them later.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: initialColors.accent,
                color: initialColors.primary,
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
      className={cn("min-h-screen pt-20 px-8 bg-[#ffffff]")}
      style={{ color: initialColors.primary }}
    >
      <div className="flex justify-between items-center pt-8 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: initialColors.primary }}>
          My Favorites
        </h1>
        <p style={{ color: initialColors.secondary }}>
          {state.items.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative border overflow-hidden hover:shadow-lg transition-shadow rounded-lg"
            )}
            style={{
              backgroundColor: initialColors.accent,
              borderColor: initialColors.secondary,
            }}
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-colors"
                style={{ color: initialColors.secondary }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{
                    stroke: initialColors.secondary,
                    fill: initialColors.secondary,
                    strokeWidth: 2,
                  }}
                />
              </button>
            </div>

            <div className="p-4">
              <Link href={`/e-commerce/${subdomain}/product/${item.id}`}>
                <h3
                  className="font-medium hover:underline"
                  style={{ color: initialColors.primary }}
                >
                  {item.name}
                </h3>
              </Link>
              <p
                className="text-lg font-semibold mt-2"
                style={{ color: initialColors.primary }}
              >
                ${item.price}
              </p>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1"
                  size="sm"
                  style={{
                    backgroundColor: initialColors.secondary,
                    color: initialColors.accent,
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
                    borderColor: initialColors.secondary,
                    color: initialColors.secondary,
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
              backgroundColor: initialColors.secondary,
              color: initialColors.accent,
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
