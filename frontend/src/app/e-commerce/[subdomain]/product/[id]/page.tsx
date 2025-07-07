/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductImageGallery } from "@/components/e-commerce/product/product-image-gallery";
import { ProductInfo } from "@/components/e-commerce/product/product-info";
import { RelatedProducts } from "@/components/e-commerce/product/related-products";
import type { RelatedProduct, VariantGroup } from "./product";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { usePathname, useRouter } from "next/navigation";
import type { CartItem } from "@/contexts/cart-context";
import type { FavoriteItem } from "@/contexts/favorites-context";
import { getProduct, type Product, type ProductVariant, getProducts } from "@/lib/products";
import { validateVariantCombination, generateSku, extractSelectedVariants, getSession } from "@/lib/sku-generator";
import type { ThemeConfig } from "./product";


export default function ProductPage({ params }: { params: { id: string } }) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const productId = pathSegments[4];
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);

  // Action states
  const [isInCart, setIsInCart] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [justAddedToFavorites, setJustAddedToFavorites] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);

  const { addToCart, state: cartState, addToCartBackend } = useCart();
  const {
    addToWishlistBackend,
    removeFromWishlistBackend,
    state: favoritesState,
  } = useFavorites();
  const router = useRouter();

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [initialColors, setInitialColors] = useState<ThemeConfig>({
    primaryColor: "#000000",
    secondaryColor: "#000000",
    backgroundColor: "#ffffff",
    borderRadius: "rounded-md",
  });
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const product = await getProduct(parseInt(productId));
        console.log("Product data:",product);
        setProductData(product);

        // Set initial images and variant
        if (product.images && product.images.length > 0) {
          setCurrentImages(product.images.map((img) => img.imageUrl));
        }
        if (product.variants && product.variants.length > 0) {
          setCurrentVariant(product.variants[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Set default variant selections when product data loads
  useEffect(() => {
    if (!productData || !productData.attributes) return;

    const defaultSelections: Record<string, string> = {};
    productData.attributes.forEach((attr) => {
      if (attr.attributeValues && attr.attributeValues.length > 0) {
        // Select the first option by default
        defaultSelections[`attr-${attr.id}`] = `option-${attr.id}-${attr.attributeValues[0].id}`;
      }
    });
    setSelectedVariants(defaultSelections);
  }, [productData]);

  // Check if product is already in cart or favorites
  useEffect(() => {
    if (!productData) return;

    const inCart = cartState.items.some(
      (item: CartItem) => item.productId === productData.id
    );
    
    // Check if current variant is in favorites using SKU
    const checkFavorites = async () => {
      try {
        const sessionData = await getSession();
        if (sessionData?.storeId) {
          const extractedVariants = extractSelectedVariants(productData, selectedVariants);
          const sku = generateSku(sessionData.storeId, productData.id, extractedVariants);
          const inFavorites = favoritesState.items.some(
            (item: FavoriteItem) => item.sku === sku
          );
          setIsInFavorites(inFavorites);
        } else {
          setIsInFavorites(false);
        }
      } catch (error) {
        console.error('Error checking favorites status:', error);
        setIsInFavorites(false);
      }
    };
    
    checkFavorites();
    setIsInCart(inCart);
  }, [cartState.items, favoritesState.items, productData, productId, selectedVariants]);

  // Fetch and set related products from the same category (up to 4, excluding current product)
  useEffect(() => {
    async function fetchRelated() {
      if (!productData || !productData.categories || productData.categories.length === 0) return;
      const allProducts = await getProducts();
      // Find products that share at least one category with the current product
      const currentCategoryIds = productData.categories.map((cat) => cat.id);
      const filtered = allProducts.filter((p) =>
        p.id !== productData.id &&
        p.categories &&
        p.categories.some((cat) => currentCategoryIds.includes(cat.id))
      );
      // Map to RelatedProduct type and limit to 4
      const related = filtered.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        compareAtPrice: p.discountValue ? p.price + p.discountValue : undefined,
        image: p.images && p.images.length > 0 ? p.images[0].url : "/placeholder.png",
        category: p.categories && p.categories.length > 0 ? p.categories[0].name : "",
        rating: 4.0, // You can replace with real rating if available
        reviewCount: 0 // You can replace with real review count if available
      }));
      setRelatedProducts(related);
    }
    fetchRelated();
  }, [productData]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!productData) return;

    // Clear any previous errors
    setVariantError(null);

    // Log product and selection details for debugging
    console.log("[AddToCart] Product Data:", productData);
    console.log("[AddToCart] Selected Variants:", selectedVariants);
    console.log("[AddToCart] Quantity:", quantity);

    // Validate variant combination
    const validation = await validateVariantCombination(productData, selectedVariants);
    console.log("[AddToCart] Validation Result:", validation);
    
    if (!validation.isValid) {
      setVariantError(validation.error || "Invalid variant combination");
      console.log("[AddToCart] Validation failed:", validation.error);
      return;
    }

    const matchingVariant = validation.matchingVariant;
    if (!matchingVariant) {
      setVariantError("No matching variant found");
      console.log("[AddToCart] No matching variant found");
      return;
    }

    // Note: Removed the "View Cart" redirect functionality - button always shows "Add to Cart"

    // Generate SKU
    const extractedVariants = extractSelectedVariants(productData, selectedVariants);
    const session = await getSession();
    const sku = generateSku(session?.storeId || 1, productData.id, extractedVariants);
    console.log("[AddToCart] Extracted Variants:", extractedVariants);
    console.log("[AddToCart] Session:", session);
    console.log("[AddToCart] SKU:", sku);

    // Add to cart via backend (requires customer authentication)
    const success = await addToCartBackend(productData.id, sku, quantity);
    console.log("[AddToCart] Add to cart backend result:", success);
    
    if (success) {
      setIsInCart(true);
      setJustAddedToCart(true);
      setTimeout(() => {
        setJustAddedToCart(false);
      }, 2000);
    } else {
      // Check if it's an authentication error
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      });
      
      if (!sessionResponse.ok || sessionResponse.status === 401) {
        setVariantError("Please log in as a customer to add items to cart");
        console.log("[AddToCart] Not logged in as customer");
      } else {
        const sessionData = await sessionResponse.json();
        if (!sessionData.customerId) {
          setVariantError("Please log in as a customer to add items to cart");
          console.log("[AddToCart] Session data missing customerId:", sessionData);
        } else {
          setVariantError("Failed to add to cart. Please try again.");
          console.log("[AddToCart] Unknown failure. Session data:", sessionData);
        }
      }
    }
  };

  // Handle add to favorites
  const handleAddToFavorites = async () => {
    if (!productData || !currentVariant) return;

    // Clear any previous errors
    setVariantError(null);

    // Validate variant combination if product has variants
    if (productData.attributes && productData.attributes.length > 0) {
      const validation = await validateVariantCombination(productData, selectedVariants);
      
      if (!validation.isValid) {
        setVariantError(validation.error || "Please select all required options");
        return;
      }
    }

    // Generate SKU for wishlist
    const extractedVariants = extractSelectedVariants(productData, selectedVariants);
    const session = await getSession();
    const sku = generateSku(session?.storeId || 1, productData.id, extractedVariants);

    // Check if already in wishlist
    if (isInFavorites) {
      // Find the wishlist item to remove
      const wishlistItem = favoritesState.items.find(item => item.sku === sku);
      if (wishlistItem?.wishListProductId) {
        const success = await removeFromWishlistBackend(wishlistItem.wishListProductId);
        if (success) {
          setIsInFavorites(false);
        } else {
          setVariantError("Failed to remove from wishlist. Please try again.");
        }
      }
    } else {
      // Add to wishlist via backend
      const success = await addToWishlistBackend(productData.id, sku);
      
      if (success) {
        setIsInFavorites(true);
        setJustAddedToFavorites(true);
        setTimeout(() => {
          setJustAddedToFavorites(false);
        }, 2000);
      } else {
        // Check if it's an authentication error
        const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
          credentials: 'include',
        });
        
        if (!sessionResponse.ok || sessionResponse.status === 401) {
          setVariantError("Please log in as a customer to add items to wishlist");
        } else {
          const sessionData = await sessionResponse.json();
          if (!sessionData.customerId) {
            setVariantError("Please log in as a customer to add items to wishlist");
          } else {
            setVariantError("Failed to add to wishlist. Please try again.");
          }
        }
      }
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!productData) return;

    const url = window.location.href;
    const title = productData.name;
    const text = `Check out this ${productData.name}!`;

    setShareClicked(true);

    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        // Final fallback - just show the URL
        prompt("Copy this link to share:", url);
      }
    }

    // Reset share state after 1 second
    setTimeout(() => {
      setShareClicked(false);
    }, 1000);
  };
  
  const createVariantGroups = (): VariantGroup[] => {
    if (!productData || !productData.attributes) return [];

    return productData.attributes.map((attr, index) => {
      // Determine variant type and display style based on attribute name
      const attributeName = attr.attributeName.toLowerCase();
      let variantType: "color" | "size" | "material" | "custom" = "custom";
      let displayStyle: "color-circles" | "buttons" | "dropdown" | "image-grid" = "buttons";
      let changesImages = false;

      // Map attribute names to appropriate variant types and display styles
      // Examples:
      // - "Color" or "colour" -> color-circles display
      // - "Size" -> buttons display  
      // - "Material" or "fabric" -> buttons display
      // - "Style" or "pattern" -> image-grid display
      if (attributeName.includes("color") || attributeName.includes("colour")) {
        variantType = "color";
        displayStyle = "color-circles";
        changesImages = true;
      } else if (attributeName.includes("size")) {
        variantType = "size";
        displayStyle = "buttons";
      } else if (attributeName.includes("material") || attributeName.includes("fabric")) {
        variantType = "material";
        displayStyle = "buttons";
      } else if (attributeName.includes("style") || attributeName.includes("pattern")) {
        variantType = "custom";
        displayStyle = "image-grid";
        changesImages = true;
      }

      return {
        id: `attr-${attr.id}`,
        name: attr.attributeName,
        type: variantType,
        required: true,
        changesImages,
        displayStyle,
        options: attr.attributeValues.map((value, valueIndex) => {
          // Generate color codes for color attributes
          let colorCode: string | undefined;
          if (variantType === "color") {
            // Map common color names to hex codes
            const colorMap: Record<string, string> = {
              "red": "#FF0000",
              "blue": "#0000FF",
              "green": "#00FF00",
              "yellow": "#FFFF00",
              "black": "#000000",
              "white": "#FFFFFF",
              "gray": "#808080",
              "grey": "#808080",
              "purple": "#800080",
              "orange": "#FFA500",
              "pink": "#FFC0CB",
              "brown": "#A52A2A",
              "navy": "#000080",
              "maroon": "#800000",
              "olive": "#808000",
              "lime": "#00FF00",
              "aqua": "#00FFFF",
              "teal": "#008080",
              "silver": "#C0C0C0",
              "gold": "#FFD700"
            };
            
            const colorName = value.attributeValue.toLowerCase();
            colorCode = colorMap[colorName] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
          }

          return {
            id: `option-${attr.id}-${value.id}`,
            label: value.attributeValue,
            value: value.attributeValue,
            colorCode,
            imageUrl: variantType === "color" ? undefined : undefined, // Could be set from backend
            productImages: changesImages ? currentImages : undefined,
            metadata: {
              // Could include price adjustments if available
            }
          };
        })
      };
    });
  };

  // Handle variant change
  const handleVariantChange = async (
    groupId: string,
    optionId: string,
    productImages?: string[]
  ) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));

    // Clear any previous errors when user changes selection
    setVariantError(null);

    // Update images if this variant changes them
    if (productImages) {
      setCurrentImages(productImages);
    }

    // Update current variant based on new selection
    if (productData) {
      const validation = await validateVariantCombination(productData, {
        ...selectedVariants,
        [groupId]: optionId,
      });
      
      if (validation.isValid && validation.matchingVariant) {
        setCurrentVariant(validation.matchingVariant);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className={cn("min-h-screen pt-20",`text-[${initialColors.primaryColor}]`)}
        style={{
          backgroundColor: "bg-[#ffffff]",
          color:  `text-[${initialColors.primaryColor}]`,
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading product...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !productData || !currentVariant) {
    return (
      <div
        className={cn("min-h-screen pt-20 font-sans")}
        style={{
          backgroundColor: "bg-[#ffffff]",
          color:  `text-[${initialColors.primaryColor}]`,
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
            <p className="text-gray-600 mb-4">
              {error || "The requested product could not be loaded."}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("min-h-screen pt-20 font-sans")}
      style={{ backgroundColor: "bg-[#ffffff]", color:  `text-[${initialColors.primaryColor}]` }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery
            images={currentImages}
            productName={productData.name}
            theme={initialColors}
          />

          {/* Product Info with Variants positioned under price */}
          <div className="space-y-8">
            <ProductInfo
              product={productData}
              currentVariant={currentVariant}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
              onShare={handleShare}
              selectedVariants={selectedVariants}
              onVariantChange={handleVariantChange}
              variantGroups={createVariantGroups()}
              isInCart={isInCart}
              isInFavorites={isInFavorites}
              justAddedToCart={justAddedToCart}
              justAddedToFavorites={justAddedToFavorites}
              shareClicked={shareClicked}
              theme={initialColors}
              variantError={variantError}
            />
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts products={relatedProducts} theme={initialColors} />
      </div>
    </div>
  );
}
