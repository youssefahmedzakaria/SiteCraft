"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  wishListProductId?: number
  sku?: string
  variantInfo?: {
    attributes: Array<{
      name: string
      value: string
    }>
  }
  originalPrice?: number
  discountType?: string | null
  discountValue?: number | null
  storeId?: number
}

interface FavoritesState {
  items: FavoriteItem[]
  loading: boolean
  error: string | null
}

type FavoritesAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_FAVORITES"; payload: FavoriteItem[] }
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "CLEAR_FAVORITES" }

const FavoritesContext = createContext<{
  state: FavoritesState
  loadWishlistFromBackend: () => Promise<boolean>
  addToWishlistBackend: (productId: number, sku: string) => Promise<boolean>
  removeFromWishlistBackend: (wishListProductId: number) => Promise<boolean>
  clearWishlistBackend: () => Promise<boolean>
  isFavorite: (sku: string) => boolean
} | null>(null)

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "LOAD_FAVORITES":
      return { ...state, items: action.payload, loading: false, error: null }

    case "ADD_FAVORITE": {
      const exists = state.items.find((item) => item.sku === action.payload.sku)
      if (exists) return state
      return { ...state, items: [...state.items, action.payload], error: null }
    }

    case "REMOVE_FAVORITE":
      return { 
        ...state, 
        items: state.items.filter((item) => item.wishListProductId !== action.payload),
        error: null 
      }

    case "CLEAR_FAVORITES":
      return { ...state, items: [], error: null }

    default:
      return state
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { 
    items: [], 
    loading: false, 
    error: null 
  })

  const loadWishlistFromBackend = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      // First check if user is authenticated as a customer
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      })

      if (!sessionResponse.ok || sessionResponse.status === 401) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to view your wishlist" })
        dispatch({ type: "SET_LOADING", payload: false })
        return false
      }

      const sessionData = await sessionResponse.json()
      if (!sessionData.customerId) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to view your wishlist" })
        dispatch({ type: "SET_LOADING", payload: false })
        return false
      }

      const response = await fetch('/api/wishlist/products', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to view your wishlist" })
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to load wishlist" })
        }
        dispatch({ type: "SET_LOADING", payload: false })
        return false
      }

      const wishlistProducts = await response.json()
      
      // Transform backend data to frontend format
      const transformedItems: FavoriteItem[] = wishlistProducts.map((wp: any) => ({
        id: wp.product.id.toString(),
        name: wp.product.name,
        price: wp.product.price || 0,
        image: wp.product.images?.[0]?.imageUrl || "/placeholder.png",
        wishListProductId: wp.wishListProductId,
        sku: wp.sku,
        originalPrice: wp.product.originalPrice,
        discountType: wp.product.discountType,
        discountValue: wp.product.discountValue,
        storeId: wp.product.storeId,
        variantInfo: wp.variantInfo
      }))

      dispatch({ type: "LOAD_FAVORITES", payload: transformedItems })
      return true

    } catch (error) {
      console.error('Error loading wishlist:', error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load wishlist" })
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    }
  }, [])

  const addToWishlistBackend = useCallback(async (productId: number, sku: string): Promise<boolean> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })

      // First check if user is authenticated as a customer
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      })

      if (!sessionResponse.ok || sessionResponse.status === 401) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to add items to wishlist" })
        return false
      }

      const sessionData = await sessionResponse.json()
      if (!sessionData.customerId) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to add items to wishlist" })
        return false
      }

      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, sku })
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to add items to wishlist" })
        } else {
          const errorData = await response.json()
          dispatch({ type: "SET_ERROR", payload: errorData.error || "Failed to add to wishlist" })
        }
        return false
      }

      const wishlistProduct = await response.json()
      
      // Add the new item to state
      const newItem: FavoriteItem = {
        id: wishlistProduct.product.id.toString(),
        name: wishlistProduct.product.name,
        price: wishlistProduct.product.price || 0,
        image: wishlistProduct.product.images?.[0]?.imageUrl || "/placeholder.png",
        wishListProductId: wishlistProduct.wishListProductId,
        sku: wishlistProduct.sku,
        originalPrice: wishlistProduct.product.originalPrice,
        discountType: wishlistProduct.product.discountType,
        discountValue: wishlistProduct.product.discountValue,
        storeId: wishlistProduct.product.storeId,
        variantInfo: wishlistProduct.variantInfo
      }

      dispatch({ type: "ADD_FAVORITE", payload: newItem })
      return true

    } catch (error) {
      console.error('Error adding to wishlist:', error)
      dispatch({ type: "SET_ERROR", payload: "Failed to add to wishlist" })
      return false
    }
  }, [])

  const removeFromWishlistBackend = useCallback(async (wishListProductId: number): Promise<boolean> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })

      // First check if user is authenticated as a customer
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      })

      if (!sessionResponse.ok || sessionResponse.status === 401) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        return false
      }

      const sessionData = await sessionResponse.json()
      if (!sessionData.customerId) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        return false
      }

      const response = await fetch(`/api/wishlist/remove?wishListProductId=${wishListProductId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to remove from wishlist" })
        }
        return false
      }

      dispatch({ type: "REMOVE_FAVORITE", payload: wishListProductId })
      return true

    } catch (error) {
      console.error('Error removing from wishlist:', error)
      dispatch({ type: "SET_ERROR", payload: "Failed to remove from wishlist" })
      return false
    }
  }, [])

  const clearWishlistBackend = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })

      // First check if user is authenticated as a customer
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      })

      if (!sessionResponse.ok || sessionResponse.status === 401) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        return false
      }

      const sessionData = await sessionResponse.json()
      if (!sessionData.customerId) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        return false
      }

      const response = await fetch('/api/wishlist/clear', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to manage your wishlist" })
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to clear wishlist" })
        }
        return false
      }

      dispatch({ type: "CLEAR_FAVORITES" })
      return true

    } catch (error) {
      console.error('Error clearing wishlist:', error)
      dispatch({ type: "SET_ERROR", payload: "Failed to clear wishlist" })
      return false
    }
  }, [])

  const isFavorite = useCallback((sku: string): boolean => {
    return state.items.some((item) => item.sku === sku)
  }, [state.items])

  return (
    <FavoritesContext.Provider
      value={{
        state,
        loadWishlistFromBackend,
        addToWishlistBackend,
        removeFromWishlistBackend,
        clearWishlistBackend,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
