import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SettingsStorage } from './SettingsStorage';

interface FavoritesContextValue {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  loaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await SettingsStorage.getFavorites();
      setFavorites(saved);
      setLoaded(true);
    })();
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      SettingsStorage.setFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const value = useMemo(() => ({ favorites, toggle, isFavorite, loaded }), [favorites, toggle, isFavorite, loaded]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};