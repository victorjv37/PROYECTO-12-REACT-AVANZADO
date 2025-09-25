import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage("eventFavorites", []);

  const addToFavorites = useCallback(
    (evento) => {
      setFavorites((prevFavorites) => {
        const alreadyExists = prevFavorites.some(
          (fav) => fav._id === evento._id
        );
        if (alreadyExists) return prevFavorites;

        return [...prevFavorites, evento];
      });
    },
    [setFavorites]
  );

  const removeFromFavorites = useCallback(
    (eventoId) => {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav._id !== eventoId)
      );
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (evento) => {
      const isFavorite = favorites.some((fav) => fav._id === evento._id);

      if (isFavorite) {
        removeFromFavorites(evento._id);
      } else {
        addToFavorites(evento);
      }
    },
    [favorites, addToFavorites, removeFromFavorites]
  );

  const isFavorite = useCallback(
    (eventoId) => {
      return favorites.some((fav) => fav._id === eventoId);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
};
