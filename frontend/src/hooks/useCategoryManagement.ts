import { useState, useEffect } from "react";
import {
  getCategories,
  getCategoryStatistics,
  createCategory,
  updateCategory,
  deleteCategory,
  assignProductsToCategory as assignProductsToCategoryAPI,
  transformCategory,
  Category,
  BackendCategory,
  CategoryCreateDTO,
  CategoryStatistics,
} from "@/lib/categories";
import { useAuth } from "./useAuth";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [statistics, setStatistics] = useState<CategoryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>(
    []
  );

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      // Check if user has storeId
      if (!user.storeId) {
        setError("User not assigned to a store. Please contact administrator.");
        return;
      }

      console.log("🔐 User authenticated for categories:", {
        userId: user.userId,
        storeId: user.storeId,
        role: user.role,
      });

      const backendCategories = await getCategories();
      setBackendCategories(backendCategories);
      const transformedCategories = backendCategories.map(transformCategory);
      setCategories(transformedCategories);
    } catch (err) {
      console.error("💥 Error in fetchCategories:", err);
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          setError("Authentication failed. Please log in again.");
        } else if (err.message.includes("403")) {
          setError(
            "Access denied. You don't have permission to view categories."
          );
        } else {
          setError(err.message || "Failed to fetch categories");
        }
      } else {
        setError("Failed to fetch categories");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getCategoryStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error("💥 Error fetching category statistics:", err);
      // Don't set error for statistics as it's not critical
    }
  };

  const addCategory = async (categoryData: CategoryCreateDTO, image?: File) => {
    try {
      setError(null);
      const newCategory = await createCategory(categoryData, image);
      const transformedCategory = transformCategory(newCategory);
      setCategories((prev) => [...prev, transformedCategory]);
      await fetchStatistics(); // Refresh statistics
      return transformedCategory;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create category";
      setError(errorMessage);
      throw err;
    }
  };

  const editCategory = async (
    categoryId: number,
    categoryData: CategoryCreateDTO,
    image?: File
  ) => {
    try {
      setError(null);
      const updatedCategory = await updateCategory(
        categoryId,
        categoryData,
        image
      );
      const transformedCategory = transformCategory(updatedCategory);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId.toString() ? transformedCategory : cat
        )
      );
      await fetchStatistics(); // Refresh statistics
      return transformedCategory;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update category";
      setError(errorMessage);
      throw err;
    }
  };

  const removeCategory = async (categoryId: number) => {
    try {
      setError(null);
      await deleteCategory(categoryId);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryId.toString())
      );
      await fetchStatistics(); // Refresh statistics
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage);
      throw err;
    }
  };

  const assignProductsToCategory = async (
    categoryId: number,
    productIds: number[]
  ) => {
    try {
      setError(null);
      await assignProductsToCategoryAPI(categoryId, productIds);
      // Refresh categories to show updated product counts
      await fetchCategories();
      await fetchStatistics();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to assign products to category";
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    // Only fetch categories if user is authenticated
    if (isAuthenticated && user) {
      fetchCategories();
      fetchStatistics();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  return {
    backendCategories,
    categories,
    statistics,
    isLoading,
    error,
    clearError,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    assignProductsToCategory,
  };
};
