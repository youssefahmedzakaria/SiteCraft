import { useState, useEffect } from 'react'
import { 
  Product, 
  SimplifiedProduct,
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductStatistics,
  getLowStockProducts,
  getOutOfStockProducts,
  ProductCreateDTO,
  ProductStatistics
} from '@/lib/products'

export const useProductManagement = () => {
  const [products, setProducts] = useState<SimplifiedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null)

  const fetchProducts = async () => {
    try {
      console.log('📝 Fetching products...');
      setIsLoading(true)
      setError('')
      
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
      console.log('✅ Products loaded successfully');
    } catch (err: any) {
      console.error('💥 Error fetching products:', err);
      setError(err.message || 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProduct = async (productId: number) => {
    try {
      console.log('📝 Fetching product:', productId);
      setError('')
      
      const product = await getProduct(productId)
      return product
    } catch (err: any) {
      console.error('💥 Error fetching product:', err);
      setError(err.message || 'Failed to fetch product')
      throw err
    }
  }

  const handleCreateProduct = async (productData: ProductCreateDTO, images?: File[]) => {
    try {
      console.log('📝 Creating product...');
      setIsCreating(true)
      setError('')
      
      const newProduct = await createProduct(productData, images)
      // Refresh the products list to get the updated data
      await fetchProducts()
      
      console.log('✅ Product created successfully');
      return newProduct
    } catch (err: any) {
      console.error('💥 Error creating product:', err);
      setError(err.message || 'Failed to create product')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateProduct = async (productId: number, productData: ProductCreateDTO, images?: File[]) => {
    try {
      console.log('📝 Updating product:', productId);
      setIsUpdating(productId)
      setError('')
      
      const updatedProduct = await updateProduct(productId, productData, images)
      // Refresh the products list to get the updated data
      await fetchProducts()
      
      console.log('✅ Product updated successfully');
      return updatedProduct
    } catch (err: any) {
      console.error('💥 Error updating product:', err);
      setError(err.message || 'Failed to update product')
      throw err
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      console.log('📝 Deleting product:', productId);
      setIsDeleting(productId)
      setError('')
      
      await deleteProduct(productId)
      setProducts(prev => prev.filter(product => product.id !== productId))
      
      console.log('✅ Product deleted successfully');
    } catch (err: any) {
      console.error('💥 Error deleting product:', err);
      setError(err.message || 'Failed to delete product')
      throw err
    } finally {
      setIsDeleting(null)
    }
  }

  const fetchStatistics = async () => {
    try {
      console.log('📝 Fetching product statistics...');
      setError('')
      
      const stats = await getProductStatistics()
      setStatistics(stats)
      console.log('✅ Product statistics loaded successfully');
      return stats
    } catch (err: any) {
      console.error('💥 Error fetching product statistics:', err);
      setError(err.message || 'Failed to fetch product statistics')
      throw err
    }
  }

  const fetchLowStockProducts = async () => {
    try {
      console.log('📝 Fetching low stock products...');
      setError('')
      
      const lowStockProducts = await getLowStockProducts()
      console.log('✅ Low stock products loaded successfully');
      return lowStockProducts
    } catch (err: any) {
      console.error('💥 Error fetching low stock products:', err);
      setError(err.message || 'Failed to fetch low stock products')
      throw err
    }
  }

  const fetchOutOfStockProducts = async () => {
    try {
      console.log('📝 Fetching out of stock products...');
      setError('')
      
      const outOfStockProducts = await getOutOfStockProducts()
      console.log('✅ Out of stock products loaded successfully');
      return outOfStockProducts
    } catch (err: any) {
      console.error('💥 Error fetching out of stock products:', err);
      setError(err.message || 'Failed to fetch out of stock products')
      throw err
    }
  }

  const clearError = () => setError('')

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    statistics,
    clearError,
    fetchProducts,
    fetchProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    fetchStatistics,
    fetchLowStockProducts,
    fetchOutOfStockProducts
  }
} 