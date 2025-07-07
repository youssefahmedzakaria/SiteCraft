"use client";

import { ShoppingCart, Heart, Share2, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/e-commerce/ui/tabs";
import { ProductVariants } from "@/components/e-commerce/product/product-variants";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import type { VariantGroup } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import { Product, ProductVariant } from "@/lib/products";

interface ProductInfoProps {
  product: Product;
  currentVariant: ProductVariant;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onAddToFavorites: () => void;
  onShare: () => void;
  theme: ThemeConfig;
  selectedVariants: Record<string, string>;
  onVariantChange: (
    groupId: string,
    optionId: string,
    productImages?: string[]
  ) => void;
  variantGroups: VariantGroup[];
  isInCart: boolean;
  isInFavorites: boolean;
  justAddedToCart: boolean;
  justAddedToFavorites: boolean;
  shareClicked: boolean;
  variantError?: string | null;
}

export function ProductInfo({
  product,
  currentVariant,
  quantity,
  onQuantityChange,
  onAddToCart,
  onAddToFavorites,
  onShare,
  theme,
  selectedVariants,
  onVariantChange,
  variantGroups,
  isInCart,
  isInFavorites,
  justAddedToCart,
  justAddedToFavorites,
  shareClicked,
  variantError,
}: ProductInfoProps) {
  return (
    <div className="space-y-8">
      {/* Product Title and Rating */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-bold">
          $
          {product.discountType !== null
            ? product.discountType === "amount"
              ? (currentVariant.price || 0) - Number(product.discountValue)
              : (currentVariant.price || 0) * (1 - Number(product.discountValue))
            : currentVariant.price || 0}
        </span>
        {product.discountValue && product.discountValue > 0 && product.discountType && (
          <span className="text-xl opacity-75 line-through">
            ${currentVariant.price || 0}
          </span>
        )}
        {product.discountValue && product.discountValue > 0 && product.discountType && (
          <span
            className="text-sm font-medium"
            style={{ color: theme.secondaryColor }}
          >
            Save ${product.discountType === "amount" ? product.discountValue : (currentVariant.price || 0) * product.discountValue}
          </span>
        )}
      </div>

      {/* Product Variants - Positioned directly under price */}
      <ProductVariants
        variantGroups={variantGroups}
        selectedVariants={selectedVariants}
        onVariantChange={onVariantChange}
        theme={theme}
      />

      {/* Quantity and Add to Cart Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className={cn("flex items-center border", theme.borderRadius)}
            style={{ borderColor: theme.secondaryColor }}
          >
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-white/20 border-r group relative"
              aria-label="Decrease quantity"
            >
              -
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  "bg-black/5"
                )}
              />
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="px-4 py-2 hover:bg-white/20 border-l group relative"
              aria-label="Increase quantity"
            >
              +
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  "bg-black/5"
                )}
              />
            </button>
          </div>

          {/* Add to Cart Button with Enhanced States */}
          <Button
            onClick={onAddToCart}
            className={cn(
              "flex-1 h-12 text-base group relative transition-all duration-300",
              justAddedToCart && "scale-105"
            )}
            style={{
              backgroundColor: justAddedToCart
                ? "#10B981"
                : theme.secondaryColor,
              color: theme.backgroundColor,
            }}
            disabled={!currentVariant.stock || currentVariant.stock <= 0}
          >
            {justAddedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {currentVariant.stock && currentVariant.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </>
            )}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                "bg-black/5"
              )}
            />
          </Button>

          {/* Add to Favorites Button with Enhanced States */}
          <Button
            variant="outline"
            onClick={onAddToFavorites}
            className={cn(
              "h-12 w-12 p-0 group relative transition-all duration-300",
              justAddedToFavorites && "scale-110",
              isInFavorites && "bg-red-50 border-red-300"
            )}
            style={{
              borderColor: isInFavorites ? "#F87171" : theme.secondaryColor,
              backgroundColor: isInFavorites ? "#FEF2F2" : undefined,
            }}
            aria-label={
              isInFavorites ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-300",
                isInFavorites ? "fill-red-500 text-red-500" : "text-current",
                justAddedToFavorites && "animate-pulse"
              )}
            />
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                "bg-black/5"
              )}
            />
          </Button>

          {/* Share Button with Enhanced States */}
          <Button
            variant="outline"
            onClick={onShare}
            className={cn(
              "h-12 w-12 p-0 group relative transition-all duration-300",
              shareClicked && "scale-110 bg-blue-50 border-blue-300"
            )}
            style={{ borderColor: theme.secondaryColor }}
            aria-label="Share product"
          >
            <Share2
              className={cn(
                "w-5 h-5 transition-all duration-300",
                shareClicked && "text-blue-500"
              )}
            />
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                "bg-black/5"
              )}
            />
          </Button>
        </div>

        {/* Status Messages */}
        <div className="min-h-[24px]">
          {variantError && (
            <div className="flex items-center gap-2 text-red-600 font-medium animate-fade-in">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{variantError}</span>
              {variantError.includes("log in") && (
                <a
                  href={`/e-commerce/${
                    window.location.pathname.split("/")[2]
                  }/login`}
                  className="text-blue-600 hover:text-blue-800 underline ml-2"
                >
                  Log In as Customer
                </a>
              )}
            </div>
          )}
          {justAddedToCart && (
            <div className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Successfully added to cart!</span>
            </div>
          )}
          {justAddedToFavorites && (
            <div className="flex items-center gap-2 text-red-500 font-medium animate-fade-in">
              <Heart className="w-4 h-4 fill-current" />
              <span>Added to favorites!</span>
            </div>
          )}
        </div>

        {/* Product Features - Show attributes if available */}
        {product.attributes &&
          product.attributes.length > 0 &&
          variantGroups.length === 0 && (
            <div className="grid grid-cols-3 gap-4">
              {product.attributes.map((attribute, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-4 group relative",
                    theme.borderRadius
                  )}
                  style={{ backgroundColor: `${theme.secondaryColor}20` }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-xs font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      {attribute.attributeName}
                    </h4>
                    <p className="text-sm opacity-75">
                      {attribute.attributeValues
                        .map((v) => v.attributeValue)
                        .join(", ")}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      theme.borderRadius,
                      "bg-black/5"
                    )}
                  />
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Product Information Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start bg-white/20">
          <TabsTrigger
            value="description"
            className="group relative data-[state=active]:bg-white/30"
          >
            Description
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                "bg-black/5"
              )}
            />
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="group relative data-[state=active]:bg-white/30"
          >
            Specifications
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                "bg-black/5"
              )}
            />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <p className="opacity-90 leading-relaxed">{product.description}</p>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-4 opacity-90 whitespace-pre-line">
            {variantGroups.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">
                  Product Specifications
                </h4>
                {variantGroups.map((group) => {
                  const selectedOption = group.options.find(
                    (option) => option.id === selectedVariants[group.id]
                  );

                  return (
                    <div key={group.id} className="border-b pb-4">
                      <h5 className="font-medium mb-2">{group.name}</h5>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => (
                          <span
                            key={option.id}
                            className={cn(
                              "px-3 py-1 text-sm rounded-full",
                              option.id === selectedVariants[group.id]
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-600"
                            )}
                          >
                            {option.label}
                          </span>
                        ))}
                      </div>
                      {selectedOption && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected:{" "}
                          <span className="font-medium">
                            {selectedOption.label}
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : product.attributes && product.attributes.length > 0 ? (
              <div className="space-y-2">
                {product.attributes.map((attr, index) => (
                  <div key={index}>
                    <strong>{attr.attributeName}:</strong>{" "}
                    {attr.attributeValues
                      .map((v) => v.attributeValue)
                      .join(", ")}
                  </div>
                ))}
              </div>
            ) : (
              <div>No specifications available for this product.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
