/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"

export interface CartItem {
  name: string
  price: number
  quantity: number
  image: string
  id: string
  sku: string
  productId: number
  cartProductId?: number // Backend cart product ID
  originalPrice?: number
  discountType?: string | null
  discountValue?: number | null
  variantInfo?: {
    attributes: Array<{
      name: string
      value: string
    }>
  }
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "SYNC_WITH_BACKEND"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_CART_FROM_BACKEND"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addToCartBackend: (productId: number, sku: string, quantity: number) => Promise<boolean>
  loadCartFromBackend: () => Promise<boolean>
  updateQuantityBackend: (cartProductId: number, quantity: number) => Promise<boolean>
  removeFromCartBackend: (cartProductId: number) => Promise<boolean>
  clearCartBackend: () => Promise<boolean>
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.sku === action.payload.sku)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.sku === action.payload.sku ? { ...item, quantity: item.quantity + 1 } : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

        return { ...state, items: updatedItems, total, itemCount }
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        const updatedItems = [...state.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

        return { ...state, items: updatedItems, total, itemCount }
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.sku !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: updatedItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id })
      }

      const updatedItems = state.items.map((item) =>
        item.sku === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: updatedItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0 }

    case "LOAD_CART":
      return { ...state, ...action.payload }

    case "SYNC_WITH_BACKEND":
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: action.payload, total, itemCount }

    case "LOAD_CART_FROM_BACKEND":
      const backendTotal = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const backendItemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: action.payload, total: backendTotal, itemCount: backendItemCount, loading: false, error: null }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  })

  // Load cart from localStorage on mount (fallback)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes (fallback)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({
      items: state.items,
      total: state.total,
      itemCount: state.itemCount
    }))
  }, [state.items, state.total, state.itemCount])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  // Check if user is authenticated as customer
  const checkCustomerAuth = useCallback(async (): Promise<{ isAuthenticated: boolean; customerId?: number }> => {
    try {
      const sessionResponse = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
      });

      if (!sessionResponse.ok || sessionResponse.status === 401) {
        return { isAuthenticated: false };
      }

      const sessionData = await sessionResponse.json();
      if (!sessionData.customerId) {
        return { isAuthenticated: false };
      }

      return { isAuthenticated: true, customerId: sessionData.customerId };
    } catch (error) {
      console.error('Error checking authentication:', error);
      return { isAuthenticated: false };
    }
  }, [])

  // Load cart from backend
  const loadCartFromBackend = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const auth = await checkCustomerAuth();
      if (!auth.isAuthenticated) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to view your cart" });
        return false;
      }

      const response = await fetch('http://localhost:8080/api/cart/products', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to view your cart" });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
        }
        return false;
      }

      const cartProducts = await response.json();
      console.log('Loaded cart products from backend:', cartProducts);

      // Transform backend data to CartItem format with proper discount calculation
      const cartItems: CartItem[] = cartProducts.map((cp: any) => {
        const originalPrice = Number(cp.variant?.price || 0);
        const discountedPrice = Number(cp.variant?.discountedPrice || originalPrice);
        
        return {
          id: cp.cartProductId?.toString() || cp.id?.toString() || Date.now().toString(),
          cartProductId: cp.cartProductId || cp.id,
          name: cp.product?.name || "Unknown Product",
          price: discountedPrice,
          originalPrice: originalPrice,
          discountType: cp.product?.discountType || null,
          discountValue: cp.product?.discountValue || null,
          quantity: cp.quantity || 1,
          image: cp.product?.images?.[0]?.imageUrl || "/placeholder.png",
          sku: cp.sku || "",
          productId: cp.product?.id || 0,
          variantInfo: {
            attributes: cp.variant?.attributes?.map((attr: any) => ({
              name: attr.name || "Unknown",
              value: attr.value || "Unknown"
            })) || []
          }
        };
      });

      dispatch({ type: "LOAD_CART_FROM_BACKEND", payload: cartItems });
      return true;
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
      return false;
    }
  }, [checkCustomerAuth])

  // Update quantity via backend
  const updateQuantityBackend = useCallback(async (cartProductId: number, quantity: number): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const auth = await checkCustomerAuth();
      if (!auth.isAuthenticated) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        return false;
      }

      const response = await fetch('http://localhost:8080/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartProductId,
          quantity
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" });
        }
        return false;
      }

      // Reload cart to get updated data
      await loadCartFromBackend();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" });
      return false;
    }
  }, [checkCustomerAuth, loadCartFromBackend])

  // Remove item from cart via backend
  const removeFromCartBackend = useCallback(async (cartProductId: number): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const auth = await checkCustomerAuth();
      if (!auth.isAuthenticated) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        return false;
      }
      
      const response = await fetch(`http://localhost:8080/api/cart/remove/${cartProductId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to remove item" });
        }
        return false;
      }

      // Reload cart to get updated data
      await loadCartFromBackend();
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item" });
      return false;
    }
  }, [checkCustomerAuth, loadCartFromBackend])

  // Clear cart via backend
  const clearCartBackend = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const auth = await checkCustomerAuth();
      if (!auth.isAuthenticated) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        return false;
      }

      const response = await fetch('http://localhost:8080/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer" });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
        }
        return false;
      }

      // Clear local state
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "SET_LOADING", payload: false });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
      return false;
    }
  }, [checkCustomerAuth])

  const addToCartBackend = useCallback(async (productId: number, sku: string, quantity: number): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const auth = await checkCustomerAuth();
      if (!auth.isAuthenticated) {
        dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to add items to cart" });
        return false;
      }

      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          sku,
          quantity
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Please log in as a customer to add items to cart" });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to add to cart" });
        }
        return false;
      }

      const cartProduct = await response.json()
      console.log('Cart product response:', cartProduct)
      
      // Validate response structure
      if (!cartProduct) {
        console.error('Cart product response is null or undefined')
        dispatch({ type: "SET_ERROR", payload: "Failed to add to cart" });
        return false
      }
      
      // Update local cart with backend response
      const originalPrice = Number(cartProduct.variant?.price || 0);
      const discountedPrice = Number(cartProduct.variant?.discountedPrice || originalPrice);
      
      const cartItem: CartItem = {
        id: cartProduct.cartProductId?.toString() || cartProduct.id?.toString() || Date.now().toString(),
        cartProductId: cartProduct.cartProductId || cartProduct.id,
        name: cartProduct.product?.name || "Unknown Product",
        price: discountedPrice,
        originalPrice: originalPrice,
        discountType: cartProduct.product?.discountType || null,
        discountValue: cartProduct.product?.discountValue || null,
        quantity: cartProduct.quantity || 1,
        image: cartProduct.product?.images?.[0]?.imageUrl || "/placeholder.png",
        sku: cartProduct.sku || "",
        productId: cartProduct.product?.id || productId,
        variantInfo: {
          attributes: cartProduct.variant?.attributes?.map((attr: any) => ({
            name: attr.name || "Unknown",
            value: attr.value || "Unknown"
          })) || []
        }
      }

      console.log('Created cart item:', cartItem)
      dispatch({ type: "ADD_ITEM", payload: cartItem })
      dispatch({ type: "SET_LOADING", payload: false });
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      dispatch({ type: "SET_ERROR", payload: "Failed to add to cart" });
      return false
    }
  }, [checkCustomerAuth])

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToCartBackend,
        loadCartFromBackend,
        updateQuantityBackend,
        removeFromCartBackend,
        clearCartBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
