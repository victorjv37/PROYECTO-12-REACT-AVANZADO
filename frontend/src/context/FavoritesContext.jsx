import { createContext, useContext, useReducer, useEffect } from "react";
import {
  favoritesReducer,
  initialFavoritesState,
  FAVORITES_ACTIONS,
} from "../reducers/favoritesReducer";

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext debe ser usado dentro de FavoritesProvider"
    );
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("ninja-event-favorites");
      const savedRatings = localStorage.getItem("ninja-event-ratings");

      const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      const ratings = savedRatings ? JSON.parse(savedRatings) : {};

      dispatch({
        type: FAVORITES_ACTIONS.LOAD_FAVORITES,
        payload: { favorites, ratings },
      });
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ninja-event-favorites",
        JSON.stringify(state.favorites)
      );
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [state.favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ninja-event-ratings",
        JSON.stringify(state.ratings)
      );
    } catch (error) {
      console.error("Error saving ratings to localStorage:", error);
    }
  }, [state.ratings]);

  const addToFavorites = (evento) => {
    dispatch({
      type: FAVORITES_ACTIONS.ADD_FAVORITE,
      payload: evento,
    });
  };

  const removeFromFavorites = (eventoId) => {
    dispatch({
      type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
      payload: eventoId,
    });
  };

  const toggleFavorite = (evento) => {
    dispatch({
      type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
      payload: evento,
    });
  };

  const rateEvent = (eventoId, rating) => {
    dispatch({
      type: FAVORITES_ACTIONS.RATE_EVENT,
      payload: { eventoId, rating },
    });
  };

  const clearFavorites = () => {
    dispatch({
      type: FAVORITES_ACTIONS.CLEAR_FAVORITES,
    });
  };

  const isFavorite = (eventoId) => {
    return state.favorites.some((fav) => fav._id === eventoId);
  };

  const getEventRating = (eventoId) => {
    return state.ratings[eventoId] || 0;
  };

  const value = {
    favorites: state.favorites,
    ratings: state.ratings,
    favoritesCount: state.favorites.length,

    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    rateEvent,
    clearFavorites,

    isFavorite,
    getEventRating,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
