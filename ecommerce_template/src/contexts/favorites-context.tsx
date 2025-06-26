"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface FavoritesState {
  items: FavoriteItem[]
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "LOAD_FAVORITES"; payload: FavoritesState }

const FavoritesContext = createContext<{
  state: FavoritesState
  dispatch: React.Dispatch<FavoritesAction>
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
} | null>(null)

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case "ADD_FAVORITE": {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) return state

      return { items: [...state.items, action.payload] }
    }

    case "REMOVE_FAVORITE": {
      return { items: state.items.filter((item) => item.id !== action.payload) }
    }

    case "LOAD_FAVORITES":
      return action.payload

    default:
      return state
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] })

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        dispatch({ type: "LOAD_FAVORITES", payload: parsedFavorites })
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(state))
  }, [state])

  const addToFavorites = (item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item })
  }

  const removeFromFavorites = (id: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: id })
  }

  const isFavorite = (id: string) => {
    return state.items.some((item) => item.id === id)
  }

  return (
    <FavoritesContext.Provider
      value={{
        state,
        dispatch,
        addToFavorites,
        removeFromFavorites,
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
