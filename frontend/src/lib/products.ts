/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Backend-compatible interfaces
export interface Product {
    id: number
    name: string
    description: string
    discountType?: string
    discountValue?: number
    minCap?: number
    percentageMax?: number
    maxCap?: number
    images?: ProductImage[]
    variants?: ProductVariant[]
    attributes?: ProductAttribute[]
    reviews?: ProductReview[]
    categories?: Category[]
    lowStockNotificationEnabled?: boolean
    currentTotalStock?: number
    atLowStockLevel?: boolean
    storeId?: number
}

export interface ProductImage {
  id: number;
  alt: string;
  imageUrl: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  stock: number;
  price: number | null;
  productionCost: number;
}

export interface ProductAttribute {
  id: number;
  attributeName: string;
  attributeValues: AttributeValue[];
}

export interface AttributeValue {
  id: number;
  attributeValue: string;
  variantAttributeValues: VariantAttributeValue[];
}

export interface VariantAttributeValue {
  id: number;
}

export interface ProductReview {
  id: number;
  comment: string;
  rate: number;
}

export interface CategoryProduct {
  id: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
  createdAt?: string;
}

// DTOs for creating/updating products
export interface ProductCreateDTO {
  name: string;
  description: string;
  discountType?: string;
  discountValue?: number;
  categoryIds?: number[];
  attributes?: ProductAttributeDTO[];
  variants?: ProductVariantDTO[];
  imageUrls?: string[];
  // Low stock notification settings
  lowStockType?: string; // "number" or "percentage"
  lowStockThreshold?: number; // the threshold value
  lowStockEnabled?: boolean; // whether notification is enabled
}

export interface ProductAttributeDTO {
  name: string;
  values: string[];
}

export interface ProductVariantDTO {
  id?: number;
  sku?: string;
  stock: number;
  price: number;
  productionCost: number;
  attributes?: VariantAttributeDTO[];
}

export interface VariantAttributeDTO {
  name: string;
  value: string;
}

// Simplified frontend interfaces for display
export interface SimplifiedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  discountType?: string;
  discountValue?: number;
  categories?: Category[];
  storeId: number;
  images?: SimplifiedProductImage[];
}

export interface SimplifiedProductImage {
  id: number;
  url: string;
  alt?: string;
}

export interface ProductStatistics {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// API Functions
export const getProducts = async (): Promise<SimplifiedProduct[]> => {
  try {
    console.log("📞 Fetching products from backend...");
    const response = await fetch("http://localhost:8080/products", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Products fetched successfully:', data);

        if (data.success && data.data) {
            // Transform the complex backend data to simplified frontend format
            return data.data.map((product: any) => transformProduct(product));
        } else {
            throw new Error(data.message || 'Failed to fetch products');
        }
    } catch (error) {
        console.error('💥 Error fetching products:', error);
        throw error;
    }
};

export const getProduct = async (productId: number): Promise<Product> => {
  try {
    console.log("📞 Fetching product:", productId);
    const response = await fetch(
      `http://localhost:8080/products/${productId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Product fetched successfully:', data);

        if (data.success && data.data) {
            return data.data; // Return the full product structure
        } else {
            throw new Error(data.message || 'Failed to fetch product');
        }
    } catch (error) {
        console.error('💥 Error fetching product:', error);
        throw error;
    }
};

export const createProduct = async (productData: ProductCreateDTO, images?: File[]): Promise<Product> => {
    try {
        console.log('📞 Creating product...');
        console.log('📤 Product data:', JSON.stringify(productData, null, 2));
        console.log('📤 Images count:', images?.length || 0);

        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));

        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append('images', image);
                console.log(`📤 Adding image ${index}:`, image.name, image.size, image.type);
            });
        }

    console.log("📤 FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `  ${key}:`,
        typeof value === "string"
          ? value
          : `${value.name} (${value.size} bytes)`
      );
    }

    const response = await fetch("http://localhost:8080/products/create", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log("📥 Response status:", response.status);
    console.log(
      "📥 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      if (response.status === 413) {
        // 413 Payload Too Large
        throw new Error(
          "Image is too large. Please upload files smaller than 5 MB each."
        );
      }
      // for other errors, pull the server's message if available
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(
        `Failed to create product: ${errText} (status ${response.status})`
      );
    }

        const data = await response.json();
        console.log('✅ Product created successfully:', data);

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to create product');
        }
    } catch (error) {
        console.error('💥 Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId: number, productData: ProductCreateDTO, images?: File[]): Promise<Product> => {
    try {
        console.log('📞 Updating product:', productId);

        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));

        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append('images', image);
            });
        }

    const response = await fetch(
      `http://localhost:8080/products/update/${productId}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

        if (!response.ok) {
            if (response.status === 413) {
                // 413 Payload Too Large
                throw new Error(
                    "Image is too large. Please upload files smaller than 5 MB each."
                );
            }
            // for other errors, pull the server's message if available
            const errText = await response.text().catch(() => response.statusText);
            throw new Error(
                `Failed to update product: ${errText} (status ${response.status})`
            );
        }


        const data = await response.json();
        console.log('✅ Product updated successfully:', data);

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to update product');
        }
    } catch (error) {
        console.error('💥 Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    console.log("📞 Deleting product:", productId);
    const response = await fetch(
      `http://localhost:8080/products/delete/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Product deleted successfully:', data);

        if (!data.success) {
            throw new Error(data.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('💥 Error deleting product:', error);
        throw error;
    }
};

export const getProductStatistics = async (): Promise<ProductStatistics> => {
  try {
    console.log("📞 Fetching product statistics...");
    const response = await fetch("http://localhost:8080/products/statistics", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Product statistics fetched successfully:', data);

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch product statistics');
        }
    } catch (error) {
        console.error('💥 Error fetching product statistics:', error);
        throw error;
    }
};

export const getLowStockNotificationStatistics =
  async (): Promise<ProductStatistics> => {
    try {
      const response = await fetch(
        "http://localhost:8080/products/low-stock-notifications",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

        const data = await response.json();

        if (data.success && data.data) {
            // Transform the low stock notification data to match ProductStatistics interface
            return {
                totalProducts: data.data.totalProducts || 0,
                lowStockCount: data.data.lowStockProducts || 0,
                outOfStockCount: 0 // We'll keep the original out of stock count from regular statistics
            };
        } else {
            throw new Error(data.message || 'Failed to fetch low stock notification statistics');
        }
    } catch (error) {
      console.error("Error fetching low stock notification statistics:", error);
      throw error;
    }
  };

export const getLowStockProducts = async (): Promise<SimplifiedProduct[]> => {
  try {
    console.log("📞 Fetching low stock products...");
    const response = await fetch("http://localhost:8080/products/low-stock", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Low stock products fetched successfully:', data);

        if (data.success && data.data) {
            return data.data.map((product: any) => transformProduct(product));
        } else {
            throw new Error(data.message || 'Failed to fetch low stock products');
        }
    } catch (error) {
        console.error('💥 Error fetching low stock products:', error);
        throw error;
    }
};

export const getOutOfStockProducts = async (): Promise<SimplifiedProduct[]> => {
  try {
    console.log("📞 Fetching out of stock products...");
    const response = await fetch(
      "http://localhost:8080/products/out-of-stock",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Out of stock products fetched successfully:', data);

        if (data.success && data.data) {
            return data.data.map((product: any) => transformProduct(product));
        } else {
            throw new Error(data.message || 'Failed to fetch out of stock products');
        }
    } catch (error) {
        console.error('💥 Error fetching out of stock products:', error);
        throw error;
    }
};

export const getProductImages = async (
  productId: number
): Promise<ProductImage[]> => {
  try {
    console.log("📞 Fetching product images:", productId);
    const response = await fetch(
      `http://localhost:8080/products/${productId}/images`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Product images fetched successfully:', data);

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch product images');
        }
    } catch (error) {
        console.error('💥 Error fetching product images:', error);
        throw error;
    }
};

export const deleteProductImage = async (
  productId: number,
  imageId: number
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/products/${productId}/images/${imageId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete product image");
  }
};

// Helper function to transform backend product to simplified frontend format
export const transformProduct = (product: any): SimplifiedProduct => {
    // Use backend's calculated stock if available, otherwise calculate from variants
    const totalStock = product.currentTotalStock ??
        (product.variants?.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0) || 0);

    // Get the first variant with a price as the main price
    const mainVariant = product.variants?.find((v: any) => v.price !== null);
    const mainPrice = mainVariant?.price || 0;

    // Transform images
    const transformedImages: SimplifiedProductImage[] = product.images?.map((img: any) => ({
        id: img.id,
        url: img.imageUrl,
        alt: img.alt
    })) || [];

  // Backend categories already have the correct structure
  const categories = product.categories || [];

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: mainPrice,
    stock: totalStock,
    status: totalStock > 0 ? "In Stock" : "Out Of Stock",
    discountType: product.discountType,
    discountValue: product.discountValue,
    categories: categories,
    storeId: 0,
    images: transformedImages,
  };
};

// Helper function to fetch categories from backend
export const getCategories = async (): Promise<any[]> => {
  try {
    console.log("📞 Fetching categories from backend...");
    const response = await fetch("http://localhost:8080/categories", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

        const data = await response.json();
        console.log('✅ Categories fetched successfully:', data);

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch categories');
        }
    } catch (error) {
        console.error('💥 Error fetching categories:', error);
        throw error;
    }
};

export const removeProductFromCategory = async (
  categoryId: number,
  productId: number
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/categories/${categoryId}/products/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to remove product from category");
  }
};
