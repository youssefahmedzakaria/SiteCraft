// Backend-compatible interfaces
export interface BackendCategory {
    id: number
    name: string
    description: string
    image: string
    store: {
        id: number
    }
    productCount: number
    createdAt?: string
}

// Frontend interfaces for display
export interface Category {
    id: string
    title: string
    numOfProducts: number
    createdAt: string
    status: string
}

export interface CategoryCreateDTO {
    name: string
    description: string
}

export interface CategoryStatistics {
    totalCategories: number
    categoriesWithProducts: number
    categoriesWithoutProducts: number
    topPerformingCategory?: {
        name: string
        productCount: number
    }
}

// Static data for fallback
export const categories: Category[] = [
  {
    id: '1',
    title: 'Electronics',
    numOfProducts: 64,
    createdAt: '2023-10-15',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Clothing',
    numOfProducts: 45,
    createdAt: '2023-09-22',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Home & Kitchen',
    numOfProducts: 32,
    createdAt: '2023-11-03',
    status: 'Active',
  },
  {
    id: '4',
    title: 'Beauty',
    numOfProducts: 0,
    createdAt: '2023-12-01',
    status: 'Empty',
  },
]

// API Functions
export const getCategories = async (): Promise<BackendCategory[]> => {
    try {
        console.log('📞 Fetching categories from backend...');
        const response = await fetch('http://localhost:8080/categories', {
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

export const getCategoryById = async (categoryId: number): Promise<BackendCategory> => {
    try {
        console.log('📞 Fetching category:', categoryId);
        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
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
        console.log('✅ Category fetched successfully:', data);
        
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch category');
        }
    } catch (error) {
        console.error('💥 Error fetching category:', error);
        throw error;
    }
};

export const createCategory = async (categoryData: CategoryCreateDTO, image?: File): Promise<BackendCategory> => {
    try {
        console.log('📞 Creating category...');
        
        const formData = new FormData();
        formData.append('category', JSON.stringify(categoryData));
        
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch('http://localhost:8080/categories', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Category created successfully:', data);
        
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to create category');
        }
    } catch (error) {
        console.error('💥 Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (categoryId: number, categoryData: CategoryCreateDTO, image?: File): Promise<BackendCategory> => {
    try {
        console.log('📞 Updating category:', categoryId);
        
        const formData = new FormData();
        formData.append('category', JSON.stringify(categoryData));
        
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Category updated successfully:', data);
        
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to update category');
        }
    } catch (error) {
        console.error('💥 Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
    try {
        console.log('📞 Deleting category:', categoryId);
        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
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
        console.log('✅ Category deleted successfully:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete category');
        }
    } catch (error) {
        console.error('💥 Error deleting category:', error);
        throw error;
    }
};

export const getCategoryStatistics = async (): Promise<CategoryStatistics> => {
    try {
        console.log('📞 Fetching category statistics...');
        const response = await fetch('http://localhost:8080/categories/analytics', {
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
        console.log('✅ Category statistics fetched successfully:', data);
        
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch category statistics');
        }
    } catch (error) {
        console.error('💥 Error fetching category statistics:', error);
        throw error;
    }
};

export const getCategoryProducts = async (categoryId: number): Promise<any[]> => {
    try {
        console.log('📞 Fetching category products:', categoryId);
        const response = await fetch(`http://localhost:8080/categories/${categoryId}/products`, {
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
        console.log('✅ Category products fetched successfully:', data);
        
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch category products');
        }
    } catch (error) {
        console.error('💥 Error fetching category products:', error);
        throw error;
    }
};

export const assignProductsToCategory = async (categoryId: number, productIds: number[]): Promise<void> => {
    try {
        console.log('📞 Assigning products to category:', categoryId, productIds);
        const response = await fetch(`http://localhost:8080/categories/${categoryId}/products`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Products assigned to category successfully:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to assign products to category');
        }
    } catch (error) {
        console.error('💥 Error assigning products to category:', error);
        throw error;
    }
};

export const removeProductFromCategory = async (categoryId: number, productId: number): Promise<void> => {
    try {
        console.log('📞 Removing product from category:', categoryId, productId);
        const response = await fetch(`http://localhost:8080/categories/${categoryId}/products/${productId}`, {
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
        console.log('✅ Product removed from category successfully:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to remove product from category');
        }
    } catch (error) {
        console.error('💥 Error removing product from category:', error);
        throw error;
    }
};

// Helper function to transform backend category to frontend format
export const transformCategory = (category: BackendCategory): Category => {
    const productCount = category.productCount || 0;
    const status = productCount > 0 ? 'Active' : 'Empty';
    
    // Use a consistent date format to avoid hydration mismatch
    // In a real app, you'd get this from the backend
    const createdAt = category.createdAt || '2024-01-01';
    
    return {
        id: category.id.toString(),
        title: category.name,
        numOfProducts: productCount,
        createdAt: createdAt,
        status: status,
    };
};