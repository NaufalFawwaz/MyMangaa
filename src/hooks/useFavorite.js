import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('favoriteManga', []);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    setFavoriteIds(new Set(favorites.map(fav => fav.id)));
  }, [favorites]);

  const addFavorite = (manga) => {
    if (!favorites.find(fav => fav.id === manga.id)) {
      setFavorites([...favorites, manga]);
    }
  };

  const removeFavorite = (mangaId) => {
    setFavorites(favorites.filter(fav => fav.id !== mangaId));
  };

  const isFavorite = (mangaId) => {
    return favoriteIds.has(mangaId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}