"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Card, CardContent } from "@/components/e-commerce/ui/card";
import { Badge } from "@/components/e-commerce/ui/badge";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import type { RelatedProduct } from "@/app/e-commerce/[subdomain]/product/[id]/product";

interface RelatedProductsProps {
  products: RelatedProduct[];
  theme: ThemeConfig;
}

export function RelatedProducts({ products, theme }: RelatedProductsProps) {
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className={cn("overflow-hidden group relative", theme.borderRadius)}
            style={{ backgroundColor: `${theme.secondaryColor}10` }}
          >
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  "bg-black/5"
                )}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/product/${product.id}`}
                  className="font-medium hover:underline line-clamp-2 flex-1"
                >
                  {product.name}
                </Link>
                <Badge
                  variant="outline"
                  className="ml-2"
                  style={{
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor,
                  }}
                >
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gray-300"
                    )}
                    style={{
                      color:
                        i < Math.floor(product.rating)
                          ? theme.secondaryColor
                          : undefined,
                    }}
                  />
                ))}
                <span className="text-xs opacity-75 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">${product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-sm opacity-75 line-through">
                      ${product.compareAtPrice}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn("rounded-full w-8 h-8 p-0 group relative")}
                  style={{
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor,
                  }}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full",
                      "bg-black/5"
                    )}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
