export interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
    status: string
    discountType?: string
    discountValue?: number
    minCap?: number
    percentageMax?: number
    maxCap?: number
    categoryId: number
    storeId: number
    images?: ProductImage[]
    category?: Category
}

export interface ProductImage {
    id: number
    url: string
    alt?: string
}

export interface Category {
    id: number
    title: string
    status: string
}

export interface ProductCreateDTO {
    name: string
    description: string
    price: number
    stock: number
    categoryId: number
    discountType?: string
    discountValue?: number
    minCap?: number
    percentageMax?: number
    maxCap?: number
}

export interface ProductStatistics {
    totalProducts: number
    inStock: number
    outOfStock: number
    lowStock: number
    totalValue: number
}

// API Functions
export const getProducts = async (): Promise<Product[]> => {
    try {
        console.log('📞 Fetching products from backend...');
        const response = await fetch('http://localhost:8080/products', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Products fetched successfully:', data);
        
        if (data.success && data.data) {
            // Transform the data to ensure proper structure
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
        console.log('📞 Fetching product:', productId);
        const response = await fetch(`http://localhost:8080/products/${productId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Product fetched successfully:', data);
        
        if (data.success && data.data) {
            return transformProduct(data.data);
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
        
        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));
        
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append('images', image);
            });
        }

        const response = await fetch('http://localhost:8080/products/create', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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

        const response = await fetch(`http://localhost:8080/products/update/${productId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        console.log('📞 Deleting product:', productId);
        const response = await fetch(`http://localhost:8080/products/delete/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
        console.log('📞 Fetching product statistics...');
        const response = await fetch('http://localhost:8080/products/statistics', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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

export const getLowStockProducts = async (): Promise<Product[]> => {
    try {
        console.log('📞 Fetching low stock products...');
        const response = await fetch('http://localhost:8080/products/low-stock', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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

export const getOutOfStockProducts = async (): Promise<Product[]> => {
    try {
        console.log('📞 Fetching out of stock products...');
        const response = await fetch('http://localhost:8080/products/out-of-stock', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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

export const getProductImages = async (productId: number): Promise<ProductImage[]> => {
    try {
        console.log('📞 Fetching product images:', productId);
        const response = await fetch(`http://localhost:8080/products/${productId}/images`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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

// Helper function to transform backend product to frontend format
export const transformProduct = (product: any): Product => {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price || 0,
        stock: product.stock || 0,
        status: product.stock > 0 ? 'In Stock' : 'Out Of Stock',
        discountType: product.discountType,
        discountValue: product.discountValue,
        minCap: product.minCap,
        percentageMax: product.percentageMax,
        maxCap: product.maxCap,
        categoryId: product.categoryId || 0,
        storeId: product.storeId || 0,
        images: product.images || [],
        category: product.category
    };
};